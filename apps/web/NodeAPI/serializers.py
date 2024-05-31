from rest_framework import serializers
from .models import Product, Subpart, ProductSubpart,SubManufacturer, SustainabilityMetrics
from django.db import transaction

class SubManufacturerSerializer(serializers.ModelSerializer):
    class Meta:
        model = SubManufacturer
        fields = '__all__'


class SustainabilityMetricsSerializer(serializers.ModelSerializer):
    class Meta:
        model = SustainabilityMetrics
        fields = '__all__'

class SubpartSerializer(serializers.ModelSerializer):
    manufacturer = SubManufacturerSerializer()
    sustainability_metrics = SustainabilityMetricsSerializer(many=True)

    class Meta:
        model = Subpart
        fields = '__all__'

    def create(self, validated_data):
        manufacturer_data = validated_data.pop('manufacturer')
        manufacturer, created = SubManufacturer.objects.get_or_create(**manufacturer_data)
        
        sustainability_metrics_data = validated_data.pop('sustainability_metrics')
        subpart = Subpart.objects.create(manufacturer=manufacturer, **validated_data)
        
        for sm_data in sustainability_metrics_data:
            sm, created = SustainabilityMetrics.objects.get_or_create(**sm_data)
            subpart.sustainability_metrics.add(sm)

        return subpart

class ProductSerializer(serializers.ModelSerializer):
    subparts = SubpartSerializer(many=True)
    sustainability_metrics = SustainabilityMetricsSerializer(many=True)
    manufacturer = SubManufacturerSerializer()
    class Meta:
        model = Product
        fields = '__all__'
    
    # all operations within the block are treated as a single atomic unit. 
    # If any operation within the block fails, the entire transaction will be rolled back, 
    # and none of the operations will be committed to the database.
    @transaction.atomic
    def create(self, validated_data):
        subparts_data = validated_data.pop('subparts', [])
        manufacturer_data = validated_data.pop("manufacturer")
        manufacturer, created = SubManufacturer.objects.get_or_create(**manufacturer_data)
        sustainability_metrics_data = validated_data.pop('sustainability_metrics', [])
        
        product = Product.objects.create(manufacturer=manufacturer, **validated_data)
        
        for sm_data in sustainability_metrics_data:
            sm, created = SustainabilityMetrics.objects.get_or_create(**sm_data)
            product.sustainability_metrics.add(sm)
                
        for subpart_data in subparts_data:
            subpart_manufacturer_data = subpart_data.pop('manufacturer')
            subpart_manufacturer, created = SubManufacturer.objects.get_or_create(**subpart_manufacturer_data)
            subpart_sustainability_metrics_data = subpart_data.pop('sustainability_metrics', [])
            subpart = Subpart.objects.create(manufacturer=subpart_manufacturer, **subpart_data)
            
            for sm_data in subpart_sustainability_metrics_data:
                sm, created = SustainabilityMetrics.objects.get_or_create(**sm_data)
                subpart.sustainability_metrics.add(sm)
                
            product.subparts.add(subpart)

            # Assuming TransactionLog creation logic is correct
            
            TransactionLog.objects.create(
                buyer_id=str(product.manufacturer),
                seller_id=str(subpart.manufacturer),
                product_id=str(product.product_id),
                subpart_id=str(subpart.subpart_id),
                amount=subpart.units_bought,
                sustainability_data_subpart= subpart.get_sustainablity_data(),
                sustainability_data_product=product.get_sustainablity_data()
            )
        
        return product
    
    @transaction.atomic
    def update(self, instance, validated_data):
        subparts_data = validated_data.pop('subparts', None)
        sustainability_metrics_data = validated_data.pop('sustainability_metrics', None)

        # Update the product fields if provided
        instance.name = validated_data.get('name', instance.name)
        instance.number_of_units = validated_data.get('number_of_units', instance.number_of_units)
        instance.save()
        
        # Update sustainability metrics
        if sustainability_metrics_data:
            for sm_data in sustainability_metrics_data:
                sm, created = SustainabilityMetrics.objects.get_or_create(**sm_data)
                instance.sustainability_metrics.add(sm)

        if subparts_data:
            for subpart_data in subparts_data:
                subpart_manufacturer_data = subpart_data.pop('manufacturer')
                subpart_manufacturer, created = SubManufacturer.objects.get_or_create(**subpart_manufacturer_data)
                subpart_sustainability_metrics_data = subpart_data.pop('sustainability_metrics', [])
                subpart = Subpart.objects.create(manufacturer=subpart_manufacturer, **subpart_data)
                
                for sm_data in subpart_sustainability_metrics_data:
                    sm, created = SustainabilityMetrics.objects.get_or_create(**sm_data)
                    subpart.sustainability_metrics.add(sm)
                    
                instance.subparts.add(subpart)

                # Assuming TransactionLog creation logic is correct
                TransactionLog.objects.create(
                    buyer_id=str(instance.manufacturer),
                    seller_id=str(subpart.manufacturer),
                    product_id=str(instance.product_id),
                    subpart_id=str(subpart.subpart_id),
                    amount=subpart.units_bought,
                    sustainability_data_subpart= subpart.get_sustainablity_data(),
                    sustainability_data_product=instance.get_sustainablity_data()
                )

        return instance


class ProductSubpartSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = ProductSubpart
        fields = '__all__'

from .models import TransactionLog

class TransactionLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = TransactionLog
        fields = '__all__'