import random
import string
from django.shortcuts import redirect, render
from django.urls import reverse
from rest_framework import viewsets
from .models import Product, Subpart, ProductSubpart, SubManufacturer, SustainabilityMetrics,TransactionLog
from .serializers import ProductSerializer, SubpartSerializer, ProductSubpartSerializer, SubManufacturerSerializer, SustainabilityMetricsSerializer,TransactionLogSerializer
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from django.utils.text import slugify
from django.conf import settings

def print_database_settings():
    print(settings.DATABASES)
    db_settings = settings.DATABASES['default']
    print(f"ENGINE: {db_settings['ENGINE']}")
    print(f"NAME: {db_settings['NAME']}")
    print(f"USER: {db_settings['USER']}")
    print(f"PASSWORD: {db_settings['PASSWORD']}")
    print(f"HOST: {db_settings['HOST']}")
    print(f"PORT: {db_settings['PORT']}")

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    lookup_field = 'slug'

    

class SubPartViewSet(viewsets.ModelViewSet):
    queryset = Subpart.objects.all()
    serializer_class = SubpartSerializer
    lookup_field = 'slug'

    
class ProductSubpartViewSet(viewsets.ModelViewSet):
    queryset = ProductSubpart.objects.all()
    serializer_class = ProductSubpartSerializer


class SustainabilityMetricsViewSet(viewsets.ModelViewSet):
    queryset = SustainabilityMetrics.objects.all()
    serializer_class = SustainabilityMetricsSerializer
    
    

class SubManufacturerViewSet(viewsets.ModelViewSet):
    queryset = SubManufacturer.objects.all()
    serializer_class = SubManufacturerSerializer
    
    
class TransactionLogViewSet(viewsets.ModelViewSet):
    queryset = TransactionLog.objects.all()
    serializer_class = TransactionLogSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        product_id = self.request.query_params.get('product_id')
        if product_id:
            queryset = queryset.filter(product_id=product_id)
        return queryset
