from rest_framework import serializers
from .models import Product, orderItem, shippingAddress, paymentMethod
from rest_framework.validators import UniqueValidator
from django.contrib.auth.models import User

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'

class RegisterSerializer(serializers.ModelSerializer):
    username = serializers.CharField(
        required=True,
        validators=[UniqueValidator(queryset=User.objects.all())],
        min_length=3,
        max_length=150,
    )
    email = serializers.EmailField(
        required=True,
        validators=[UniqueValidator(queryset=User.objects.all())],
    )
    password = serializers.CharField(write_only=True, min_length=8)

    def create(self, validated_data):
        password = validated_data.pop('password')
        return User.objects.create_user(password=password, **validated_data)

    class Meta:
        model = User
        fields = ['username', 'email', 'password']

class ShippingAddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = shippingAddress
        fields = '__all__'

class OrderItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    line_total = serializers.SerializerMethodField()

    class Meta:
        model = orderItem
        fields = ['id','product', 'qty', 'price', 'line_total']

    def get_line_total(self, obj):
        return obj.qty * obj.price

class PaymentMethodSerializer(serializers.ModelSerializer):
    items = serializers.SerializerMethodField()
    shipping = serializers.SerializerMethodField()

    class Meta: 
        model = paymentMethod
        fields = ['id', 'user', 'totalPrice', 'isPaid', 'PaidAt', 'xendit_invoice_id', 'xendit_external_id', 'xendit_status', 'items', 'shipping']

    def get_items(self, obj):
        qs = obj.orderitem_set.all().select_related('product')
        return OrderItemSerializer(qs, many=True).data

    def get_shipping(self, obj):
        addr = shippingAddress.objects.filter(paymentId=obj).first()
        if addr:
            return ShippingAddressSerializer(addr).data
        return None

class CheckoutSerializer(serializers.Serializer):
    fullName = serializers.CharField(max_length=100, source='fullname')
    address = serializers.CharField(max_length=200)
    city = serializers.CharField(max_length=100)
    postalCode = serializers.CharField(max_length=20, source='postal_code')
    country = serializers.CharField(max_length=100)

    def to_internal_value(self, data):
        if 'fullName' in data and 'fullname' not in data:
            data = data.copy()
            data['fullname'] = data['fullName']
        if 'postalCode' in data and 'postal_code' not in data:
            data = data.copy()
            data['postal_code'] = data['postalCode']
        return super().to_internal_value(data)

# Backward compatibility for older imports.
checkOutSerializer = CheckoutSerializer