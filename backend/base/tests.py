from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from unittest.mock import patch

from .models import Product, cartUser, paymentMethod
from .serializers import CheckoutSerializer


class CheckoutSerializerTests(TestCase):
    def test_accepts_frontend_field_names(self):
        payload = {
            "fullName": "Jane Doe",
            "address": "123 Main Street",
            "city": "Cebu City",
            "postalCode": "6000",
            "country": "Philippines",
        }

        serializer = CheckoutSerializer(data=payload)

        self.assertTrue(serializer.is_valid(), serializer.errors)
        self.assertEqual(serializer.validated_data["fullname"], "Jane Doe")
        self.assertEqual(serializer.validated_data["postal_code"], "6000")

    @patch("base.views.requests.post")
    def test_create_xendit_payment_uses_cart_products_relation(self, mock_post):
        user = User.objects.create_user(username="buyer", email="buyer@example.com", password="secret123")
        product = Product.objects.create(
            product_name="Switch",
            product_price=1000,
            brand="Cisco",
            description="Test product",
            countInStock=5,
            image="",
        )
        cartUser.objects.create(user=user, products=product, qty=2)

        mock_post.return_value.raise_for_status.return_value = None
        mock_post.return_value.json.return_value = {
            "id": "inv_123",
            "invoice_url": "https://example.com/invoice",
            "status": "PENDING",
        }

        client = APIClient()
        client.force_authenticate(user=user)

        response = client.post(
            "/api/create-xendit-payment/",
            {
                "fullName": "Jane Doe",
                "address": "123 Main Street",
                "city": "Cebu City",
                "postalCode": "6000",
                "country": "Philippines",
            },
            format="json",
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["checkout_url"], "https://example.com/invoice")

    def test_mark_as_paid_creates_order_items_and_clears_cart(self):
        user = User.objects.create_user(username="paiduser", email="paid@example.com", password="secret123")
        product = Product.objects.create(
            product_name="Paid Switch",
            product_price=1500,
            brand="Cisco",
            description="Paid test product",
            countInStock=3,
            image="",
        )
        cartUser.objects.create(user=user, products=product, qty=1)
        payment = paymentMethod.objects.create(user=user, totalPrice=1500, isPaid=False)

        payment.mark_as_paid()

        self.assertTrue(payment.isPaid)
        self.assertEqual(payment.orderitem_set.count(), 1)
        self.assertEqual(cartUser.objects.filter(user=user).count(), 0)

    @patch("base.views.requests.get")
    def test_confirm_xendit_payment_marks_paid_from_redirect(self, mock_get):
        user = User.objects.create_user(username="redirectbuyer", email="redirect@example.com", password="secret123")
        product = Product.objects.create(
            product_name="Redirect Switch",
            product_price=500,
            brand="Cisco",
            description="Redirect payment test",
            countInStock=4,
            image="",
        )
        cartUser.objects.create(user=user, products=product, qty=1)
        payment = paymentMethod.objects.create(
            user=user,
            totalPrice=500,
            isPaid=False,
            xendit_invoice_id="inv_redirect_1",
            xendit_external_id="order-redirect-123",
            xendit_status="PENDING",
        )

        mock_get.return_value.raise_for_status.return_value = None
        mock_get.return_value.json.return_value = {"status": "PAID"}

        client = APIClient()
        client.force_authenticate(user=user)

        response = client.post(
            "/api/confirm-xendit-payment/",
            {"invoice_id": "inv_redirect_1", "external_id": "order-redirect-123", "status": "PAID"},
            format="json",
        )

        self.assertEqual(response.status_code, 200)
        payment.refresh_from_db()
        self.assertTrue(payment.isPaid)
        self.assertEqual(payment.orderitem_set.count(), 1)

    def test_confirm_xendit_payment_uses_latest_pending_payment_when_ids_missing(self):
        user = User.objects.create_user(username="fallbackbuyer", email="fallback@example.com", password="secret123")
        product = Product.objects.create(
            product_name="Fallback Switch",
            product_price=900,
            brand="Cisco",
            description="Fallback payment test",
            countInStock=2,
            image="",
        )
        cartUser.objects.create(user=user, products=product, qty=1)
        payment = paymentMethod.objects.create(
            user=user,
            totalPrice=900,
            isPaid=False,
            xendit_status="PENDING",
        )

        client = APIClient()
        client.force_authenticate(user=user)

        response = client.post(
            "/api/confirm-xendit-payment/",
            {"status": "PAID"},
            format="json",
        )

        self.assertEqual(response.status_code, 200)
        payment.refresh_from_db()
        self.assertTrue(payment.isPaid)
        self.assertEqual(payment.orderitem_set.count(), 1)
