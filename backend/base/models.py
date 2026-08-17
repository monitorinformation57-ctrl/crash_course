from django.db import models, transaction
from django.contrib.auth.models import User
from django.utils import timezone

# Create your models here.
class Product(models.Model):
    product_name = models.CharField(max_length=200, null=True, blank=True)
    product_price = models.DecimalField(max_digits=7, decimal_places=2, null=True, blank=True)
    brand = models.CharField(max_length=200, null=True, blank=True)
    description = models.TextField(null=True, blank=True)
    countInStock = models.IntegerField(null=True, blank=True)
    image = models.ImageField(upload_to='product_images/', null=True, blank=True)
    createdAt = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.product_name

class cartUser(models.Model):
    products = models.ForeignKey(Product, blank=True, on_delete=models.CASCADE)
    user = models.ForeignKey(User, blank=True, on_delete=models.CASCADE)
    qty = models.IntegerField(null=True, blank=True)


class paymentMethod(models.Model):
    user = models.ForeignKey(User, blank=True, on_delete=models.CASCADE)
    totalPrice = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    isPaid = models.BooleanField(default=False)
    PaidAt = models.DateTimeField(auto_now_add=True)
    xendit_invoice_id = models.CharField(max_length=200, null=True, blank=True)
    xendit_external_id = models.CharField(max_length=200, null=True, blank=True)
    xendit_status = models.CharField(max_length=200, null=True, blank=True)

    def mark_as_paid(self):
        if self.isPaid:
            return

        cart_items = list(cartUser.objects.filter(user=self.user).select_related('products'))

        with transaction.atomic():
            for item in cart_items:
                orderItem.objects.create(
                    product=item.products,
                    payment=self,
                    qty=item.qty,
                    price=(item.products.product_price or 0) * (item.qty or 0),
                )

            cartUser.objects.filter(user=self.user).delete()
            self.isPaid = True
            self.PaidAt = timezone.now()
            self.save(update_fields=['isPaid', 'PaidAt'])

class orderItem(models.Model):
    product = models.ForeignKey(Product, blank=True, on_delete=models.CASCADE)
    payment = models.ForeignKey(paymentMethod, blank=True, on_delete=models.CASCADE)
    qty = models.IntegerField(null=True, blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)

class shippingAddress(models.Model):
    paymentId = models.ForeignKey(paymentMethod, blank=True, on_delete=models.CASCADE)
    fullName = models.CharField(max_length=200, null=True, blank=True)
    address = models.CharField(max_length=200, null=True, blank=True)
    city = models.CharField(max_length=200, null=True, blank=True)
    postalCode = models.CharField(max_length=20, null=True, blank=True)
    country = models.CharField(max_length=200, null=True, blank=True)

