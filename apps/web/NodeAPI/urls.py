from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProductViewSet
from .views import create_product

router = DefaultRouter()
router.register(r'products', ProductViewSet)

urlpatterns = [
    path('products/create/', create_product, name='create_product'),
    path('', include(router.urls)),
]
