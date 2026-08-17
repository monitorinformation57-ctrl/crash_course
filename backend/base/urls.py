from django.urls import path
from .views import (
    product_list,
    get_product_data,
    cart_view,
    add_to_cart,
    update_cart,
    delete_cart,
    register_user,
    profile_view,
    profile_orders,
    checkout_cart,
    delete_profile_order,
    create_xendit_payment,
    confirm_xendit_payment,
    list_user_orders,
    xendit_webhook,

)
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path('products/', product_list, name='product_list'),
    path('products/<int:pk>/', get_product_data, name='product_data'),
    path('register/', register_user, name='register_user'),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('profile/', profile_view, name='profile_view'),
    path('profile/orders/', profile_orders, name='profile_orders'),
    path('profile/orders/<int:order_id>/', delete_profile_order, name='delete_profile_order'),

    path('cart/<int:user_id>/', cart_view, name='cart_view'),
    path('cart/add/', add_to_cart, name='add_to_cart'),
    path('cart/checkout/', checkout_cart, name='checkout_cart'),
    path('cart/update/<int:cart_id>/', update_cart, name='update_cart'),
    path('cart/delete/<int:cart_id>/', delete_cart, name='delete_cart'),
    path('create-xendit-payment/', create_xendit_payment, name='create_xendit_payment'),
    path('confirm-xendit-payment/', confirm_xendit_payment, name='confirm_xendit_payment'),
    path('orders/', list_user_orders, name='list_user_orders'),
    path('webhook/xendit/', xendit_webhook, name='xendit_webhook'),
]