from django.shortcuts import render
from django.http import JsonResponse
from rest_framework import viewsets
from .models import Product
from .serializers import ProductSerializer

def demo_get(request):
    static_data = {
        "key1" : "val1",
        "key2" : "val2",
        "list" : [1,2,3] 
    }
    return JsonResponse(static_data)

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
