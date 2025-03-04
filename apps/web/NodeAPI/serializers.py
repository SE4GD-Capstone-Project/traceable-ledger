import hashlib
from rest_framework import serializers
from .models import Product, Subpart, ProductSubpart,SubManufacturer, SustainabilityMetric, ProductSustainabilityMetric, SubpartSustainabilityMetric
from django.db import transaction
import random , string
from django.utils.text import slugify

class SubManufacturerSerializer(serializers.ModelSerializer):
    class Meta:
        model = SubManufacturer
        fields = '__all__'


class SustainabilityMetricSerializer(serializers.ModelSerializer):
    class Meta:
        model = SustainabilityMetric
        fields = '__all__'

class ProductSustainabilityMetricSerializer(serializers.ModelSerializer):
    name = serializers.CharField(source="sustainability_metric.name")
    description = serializers.CharField(source="sustainability_metric.description")
    unit = serializers.CharField(source="sustainability_metric.unit")
    class Meta:
        model = ProductSustainabilityMetric
        fields = ['name', 'description', 'unit', 'value']

class SubpartSustainabilityMetricSerializer(serializers.ModelSerializer):
    name = serializers.CharField(source="sustainability_metric.name")
    description = serializers.CharField(source="sustainability_metric.description")
    unit = serializers.CharField(source="sustainability_metric.unit")
    class Meta:
        model = SubpartSustainabilityMetric
        fields = ['name', 'description', 'unit', 'value']

class SubpartSerializer(serializers.ModelSerializer):
    manufacturer = SubManufacturerSerializer()
    sustainability_metrics = SubpartSustainabilityMetricSerializer(many=True, read_only=True)
    sustainability_metrics_input = serializers.ListField(child=serializers.DictField(), write_only=True)

    class Meta:
        model = Subpart
        fields = '__all__'

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        if "sustainability_metrics" not in representation:
            representation["sustainability_metrics"] = SubpartSustainabilityMetricSerializer(instance.sustainability_metrics.all(), many=True).data
        return representation

    def create(self, validated_data):
        manufacturer_data = validated_data.pop('manufacturer')
        manufacturer, created = SubManufacturer.objects.get_or_create(**manufacturer_data)
        sustainability_metrics_data = validated_data.pop('sustainability_metrics_input', [])

        # Generate a random string of fixed length
        random_string = ''.join(random.choices(string.ascii_lowercase + string.digits, k=5))
        validated_data['slug'] = slugify(f"{validated_data['name']}-{random_string}")

        subpart = Subpart.objects.create(manufacturer=manufacturer, **validated_data)

        for sm_data in sustainability_metrics_data:
            metric_id = sm_data.get('metric_id')
            value= sm_data.get('value')
            metric = SustainabilityMetric.objects.get(metric_id=metric_id)
            SubpartSustainabilityMetric.objects.create(
                subpart=subpart,
                sustainability_metric=metric,
                value=value
            )

        return subpart

class ProductSerializer(serializers.ModelSerializer):
    subparts = SubpartSerializer(many=True)
    sustainability_metrics = ProductSustainabilityMetricSerializer(many=True, read_only=True)
    sustainability_metrics_input = serializers.ListField(child=serializers.DictField(), write_only=True)
    manufacturer = SubManufacturerSerializer()

    class Meta:
        model = Product
        fields = '__all__'

    def get_hashed_id(self, obj):
        return hashlib.sha256(str(obj.product_id).encode()).hexdigest()

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        hashed_id = self.get_hashed_id(instance)
        representation['product_id'] = hashed_id
        if "sustainability_metrics" not in representation:
            representation["sustainability_metrics"] = ProductSustainabilityMetricSerializer(instance.sustainability_metrics.all(), many=True).data
        return representation
    
    # all operations within the block are treated as a single atomic unit. 
    # If any operation within the block fails, the entire transaction will be rolled back, 
    # and none of the operations will be committed to the database.
    @transaction.atomic
    def create(self, validated_data):
        subparts_data = validated_data.pop('subparts', [])
        manufacturer_data = validated_data.pop("manufacturer")
        manufacturer, created = SubManufacturer.objects.get_or_create(**manufacturer_data)
        sustainability_metrics_data = validated_data.pop('sustainability_metrics_input', [])
        
        # Generate a random string of fixed length
        random_string = ''.join(random.choices(string.ascii_lowercase + string.digits, k=5))
        validated_data['slug'] = slugify(f"{validated_data['name']}-{random_string}")



        product = Product.objects.create(manufacturer=manufacturer, **validated_data)
        
        for sm_data in sustainability_metrics_data:
            metric_id = sm_data.get('metric_id')
            value= sm_data.get('value')
            metric = SustainabilityMetric.objects.get(metric_id=metric_id)
            ProductSustainabilityMetric.objects.create(
                product=product,
                sustainability_metric=metric,
                value=value
            )

        for subpart_data in subparts_data:
            subpart_manufacturer_data = subpart_data.pop('manufacturer')
            subpart_manufacturer, created = SubManufacturer.objects.get_or_create(**subpart_manufacturer_data)
            sustainability_metrics_data = subpart_data.pop('sustainability_metrics_input', [])

            subpart, created = Subpart.objects.get_or_create(manufacturer=subpart_manufacturer, **subpart_data)

            for sm_data in sustainability_metrics_data:
                metric_id = sm_data.get('metric_id')
                value= sm_data.get('value')
                metric = SustainabilityMetric.objects.get(metric_id=metric_id)
                SubpartSustainabilityMetric.objects.create(
                    subpart=subpart,
                    sustainability_metric=metric,
                    value=value
                )

            product.subparts.add(subpart)

            # Assuming TransactionLog creation logic is correct
            
            TransactionLog.objects.create(
                buyer_id=str(product.manufacturer),
                buyer_url=str(product.manufacturer.mainURL),
                seller_id=str(subpart.manufacturer),
                product_id=str(product.slug),
                subpart_id=str(subpart.slug),
                amount=subpart.units_bought,
            )
        
        return product
    
    @transaction.atomic
    def update(self, instance, validated_data):
        subparts_data = validated_data.pop('subparts', None)
        sustainability_metrics_data = validated_data.pop('sustainability_metrics_input', None)

        # Update the product fields if provided
        instance.name = validated_data.get('name', instance.name)
        instance.number_of_units = validated_data.get('number_of_units', instance.number_of_units)
        instance.save()

        # Update sustainability metrics
        if sustainability_metrics_data:
            for sm_data in sustainability_metrics_data:
                metric_id = sm_data.get('metric_id')
            value= sm_data.get('value')
            metric = SustainabilityMetric.objects.get(metric_id=metric_id)
            ProductSustainabilityMetric.objects.get_or_create(
                product=instance,
                sustainability_metric=metric,
                value=value
            )

        if subparts_data:
            for subpart_data in subparts_data:
                subpart_manufacturer_data = subpart_data.pop('manufacturer')
                subpart_manufacturer, created = SubManufacturer.objects.get_or_create(**subpart_manufacturer_data)
                # subpart_sustainability_metrics_data = subpart_data.pop('sustainability_metrics', [])
                subpart = Subpart.objects.create(manufacturer=subpart_manufacturer, **subpart_data)
                
                # for sm_data in subpart_sustainability_metrics_data:
                #     sm, created = SustainabilityMetrics.objects.get_or_create(**sm_data)
                #     subpart.sustainability_metrics.add(sm)
                #
                instance.subparts.add(subpart)

                # Assuming TransactionLog creation logic is correct
                TransactionLog.objects.create(
                    buyer_id=str(instance.manufacturer),
                    seller_id=str(subpart.manufacturer),
                    product_id=str(instance.slug),
                    subpart_id=str(subpart.slug),
                    amount=subpart.units_bought,
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