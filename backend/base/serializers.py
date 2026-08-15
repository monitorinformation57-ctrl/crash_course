from rest_framework import serializers
from .models import Product, orderItem, shippingAddress, paymentMethod
from rest_framework.validators import UniqueValidator
from django.contrib.auth.models import User

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'

class RegisterSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(
        required=True,
        validators=[UniqueValidator(queryset=User.objects.all())]
    ) 

    password = serializers.CharField(write_only=True)

    def create(self, validated_data):
        
        return User.objects.create_user(**validated_data)

    class Meta:
        model = User
        fields = ['email', 'password']

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
    fullname = serializers.CharField(max_length=100)
    address = serializers.CharField(max_length=200)
    city = serializers.CharField(max_length=100)
    postal_code = serializers.CharField(max_length=20)
    country = serializers.CharField(max_length=100)

# Backward compatibility for older imports.
checkOutSerializer = CheckoutSerializer