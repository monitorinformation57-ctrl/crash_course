from django.shortcuts import render
from django.shortcuts import get_object_or_404
from django.contrib.auth.models import User

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from .models import Product, cartUser, orderItem, paymentMethod, shippingAddress
from .serializers import ProductSerializer, RegisterSerializer


@api_view(['POST'])
def register_user(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "User created successfully."}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def product_list(request):
    products = Product.objects.all()
    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def profile_view(request):
    user = request.user
    return Response({
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "first_name": user.first_name,
        "last_name": user.last_name,
    }, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def profile_orders(request):
    order_items = orderItem.objects.filter(
        payment__user=request.user
    ).select_related('product', 'payment')

    data = []
    for item in order_items:
        product = item.product
        payment = item.payment

        data.append({
            "id": item.id,
            "productName": product.product_name if product else "Unknown Product",
            "purchaseDate": payment.PaidAt.isoformat() if payment and payment.PaidAt else None,
            "quantity": item.qty or 0,
            "amount": str(item.price if item.price is not None else (product.product_price * (item.qty or 0))),
            "image": request.build_absolute_uri(product.image.url) if product and product.image else None,
        })

    return Response(data, status=status.HTTP_200_OK)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_profile_order(request, order_id):
    order = get_object_or_404(orderItem, id=order_id, payment__user=request.user)
    order.delete()
    return Response({"message": "Purchase removed successfully."}, status=status.HTTP_200_OK)

@api_view(['GET'])
def get_product_data(request, pk):
    product = get_object_or_404(Product, pk=pk)
    serializer = ProductSerializer(product)
    return Response(serializer.data)


@api_view(['GET'])
def cart_view(request, user_id):
    cart_items = cartUser.objects.filter(user_id=user_id)

    data = []

    for item in cart_items:
        data.append({
            "cart_id": item.id,
            "product_id": item.products.id,
            "product_name": item.products.product_name,
            "price": item.products.product_price,
            "image": request.build_absolute_uri(item.products.image.url) if item.products.image else None,
            "qty": item.qty,
            "subtotal": item.products.product_price * item.qty
        })

    return Response(data, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def checkout_cart(request):
    cart_items = cartUser.objects.filter(user=request.user).select_related('products')

    if not cart_items.exists():
        return Response({"message": "Cart is empty."}, status=status.HTTP_400_BAD_REQUEST)

    total_price = 0
    for item in cart_items:
        if item.products and item.qty is not None:
            total_price += (item.products.product_price or 0) * item.qty

    payment = paymentMethod.objects.create(
        user=request.user,
        totalPrice=total_price,
        isPaid=True,
    )

    for item in cart_items:
        if item.products is None:
            continue

        orderItem.objects.create(
            product=item.products,
            payment=payment,
            qty=item.qty or 0,
            price=item.products.product_price or 0,
        )

    cart_items.delete()

    return Response(
        {
            "message": "Checkout successful.",
            "payment_id": payment.id,
            "totalPrice": total_price,
        },
        status=status.HTTP_201_CREATED,
    )

@api_view(['POST'])
def add_to_cart(request):
    user_id = request.data.get("user")
    product_id = request.data.get("product")
    qty = int(request.data.get("qty", 1))

    user = get_object_or_404(User, id=user_id)
    product = get_object_or_404(Product, id=product_id)

    cart_item = cartUser.objects.filter(
        user=user,
        products=product
    ).first()

    if cart_item:
        cart_item.qty += qty
        cart_item.save()

        return Response(
            {"message": "Cart quantity updated."},
            status=status.HTTP_200_OK
        )

    cartUser.objects.create(
        user=user,
        products=product,
        qty=qty
    )

    return Response(
        {"message": "Product added to cart."},
        status=status.HTTP_201_CREATED
    )


@api_view(['PUT'])
def update_cart(request, cart_id):
    cart_item = get_object_or_404(cartUser, id=cart_id)

    qty = int(request.data.get("qty"))

    if qty <= 0:
        return Response(
            {"error": "Quantity must be greater than zero."},
            status=status.HTTP_400_BAD_REQUEST
        )

    cart_item.qty = qty
    cart_item.save()

    return Response(
        {"message": "Cart updated successfully."},
        status=status.HTTP_200_OK
    )


@api_view(['DELETE'])
def delete_cart(request, cart_id):
    cart_item = get_object_or_404(cartUser, id=cart_id)

    cart_item.delete()

    return Response(
        {"message": "Item removed from cart."},
        status=status.HTTP_200_OK
    )


import uuid
from decimal import Decimal
from django.conf import settings
from django.db import transaction
import requests
from .models import paymentMethod
from .serializers import CheckoutSerializer

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_xendit_payment(request):
    serializer = CheckoutSerializer(data=request.data)

    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    user = request.user
    data = serializer.validated_data

    if not user.email:
        return Response(
            {'error': 'Your Account needs an email address before checkout.'},
            status=status.HTTP_400_BAD_REQUEST,
        )


    cart_items = cartUser.objects.filter(user=user).selected_related('product')

    if not cart_items.exist():
        return Response(
            {'error': 'Cart is empty'},
            status=status.HTTP_400_BAD_REQUEST
        )

    total_price = sum(
        item.product.product_price * item.qty
        for item in cart_items
        )

    if not settings.XENDIT_SECRET_KEY:
        return Response(
            {'error': 'Xendit secret key is not configured.'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

    xendit_amount = float(Decimal(total_price).quantize(Decimal('0.01')))
    external_id = f"order-{user.id}-{uuid.uuid4().hex[:8]}"

    payload = {
        "external_id": external_id,
        "amount": xendit_amount,
        "currency": "PHP",
        "payer_email": user.email,
        "description": "Payment for your order",
        "success_redirect_url": settings.XENDIT_SUCCESS_REDIRECT_URL,
        "fail_redirect_url": settings.XENDIT_FAILURE_REDIRECT_URL,
        "customer":{
            "given_names": data['fullname'],
            "email": user.email,
        },
        "customer_notification_preference": {
            "invoice_created": ["email"],
            "invoice_reminder": ["email"],
            "invoice_paid": ["email"],
            "invoice_expired": ["email"]
        }
    }

    try:
        xendit_response = requests.post(
            'https://api.xendit.co/v2/invoices',
            auth=(settings.XENDIT_SECRET_KEY, ''),
            json=payload,
            timeout=30
        )
        xendit_response.raise_for_status()

        result = xendit_response.json()
    except requests.exceptions.RequestException as exc:
        error_message = str(exc)
        if getattr(exc.response, 'content', None):
            try:
                error_data = exc.response.json()
            except ValueError:
                error_message = exc.response.text
        return Response(
            {'error': error_message},
            status=status.HTTP_400_BAD_REQUEST
        )

    if 'invoice_url' not in result or 'id' not in result:
        return Response(
            {'error': 'Failed to create Xendit invoice.'},
            status=status.HTTP_400_BAD_REQUEST
        )
    checkout_url = result['invoice_url']
    xendit_invoice_id = result['id']
    xendit_status = result.get('status', 'PENDING')

    with transaction.atomic():
        payment = paymentMethod.objects.create(
            user=user,
            totalPrice=total_price,
            isPaid=False,
            xendit_invoice_id=xendit_invoice_id,
            xendit_external_id=external_id,
            xendit_status=xendit_status
        )

        shippingAddress.objects.create(
            paymentId=payment,
            fullName = data['fullName'],
            address = data['address'],
            city = data['city'],
            postalCode = data['postalCode'],
            country = data['country'],
        )

        return Response({'checkout_url': checkout_url}, status=status.HTTP_200_OK)


import json

@csrf_exempt
@api_view(['POST'])
def xendit_webhook(request):
    try: 
        callback_token = request.header.get('x-callback-token')

        if not settings.XENDIT_CALLBACK_TOKEN:
            return Response({'error': 'Invalid xendit callback token'}, status=status.HTTP_403_FORBIDDEN)
        if callback_token != settings.XENDIT_CALLBACK_TOKEN:
            return Response({'error': 'Invalid Xendit callback token.'}, status=status.HTTP_403_FORBIDDEN)

        payload = json.loads(request.body)

        xendit_invoice_id = payload.get('id')
        xendit_external_id = payload.get('external_id')
        xendit_status = payload.get('status')

        if not xendit_invoice_id and not xendit_external_id:
            return Response({'error': 'Missing Xendit Invoice reference'}, status=status.HTTP_400_BAD_REQUEST)

        payment = None
        if xendit_invoice_id:
            payment = paymentMethod.objects.filter(xendit_invoice_id=xendit_invoice_id,).first()
        if not payment and xendit_external_id:
            payment = paymentMethod.objects.filter(xendit_external_id=xendit_external_id,).first()
        if not payment:
            return Response({'message': 'Payment not found'}, status=status.HTTP_404_NOT_FOUND)

        if xendit_status:
            payment.xendit_status = xendit_status
            payment.save(update_fields=['xendit_status'])

        if xendit_status not in ['PAID', 'SETTLED']:
            return Response({'message': 'Xendit event received'}, status=status.HTTP_200_OK)

        if payment.isPaid:
            return Response(
                {'message': 'Already Processed'}, status=status.HTTP_200_OK
            )
        payment.mark_as_paid()

        return Response({'message': 'Payment confirmed, Order Items Created'}, status=status.HTTP_200_OK)
    except(KeyError, TypeError, ValueError, json.JSONDecodeError) as exc:
        return Response({'error': str(exc)}, status=status.HTTP_400_BAD_REQUEST)

from .serializers import PaymentMethodSerializer
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_user_orders(request):
    user = request.user
    payments = paymentMethod.objects.filter(user=user).prefetch_related('orderitem_set_product', 'shippingaddress_set')

    serializer = PaymentMethodSerializer(payments, many=True)
    return Response(serializer.data)