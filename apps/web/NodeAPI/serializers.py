from rest_framework import serializers
from .models import Product, Subpart, ProductSubpart,SubContractor

# # Serializer for Subpart
# class SubpartSerializer(serializers.ModelSerializer):
#     contractor_name = serializers.CharField(source='contractor.name', read_only=True)  # Assuming you might want the contractor's name

#     class Meta:
#         model = Subpart
#         fields = ['id', 'name', 'co2_footprint', 'contractor_name']

# # Serializer for ProductSubpart which uses SubpartSerializer
# class ProductSubpartSerializer(serializers.ModelSerializer):
#     subpart = SubpartSerializer(read_only=True)
#     quantity_needed_per_unit = serializers.FloatField()
#     units_to_buy = serializers.FloatField()

#     class Meta:
#         model = ProductSubpart
#         fields = ['subpart', 'quantity_needed_per_unit', 'units_to_buy']

# # Updated ProductSerializer to include subparts
# class ProductSerializer(serializers.ModelSerializer):
#     subparts = ProductSubpartSerializer(source='product_subparts', many=True, read_only=True)

#     class Meta:
#         model = Product
#         fields = ['id', 'name', 'number_of_units', 'co2_per_unit', 'subparts']


class SubContractorSerializer(serializers.ModelSerializer):
    class Meta:
        model = SubContractor
        fields = '__all__'


class SubpartSerializer(serializers.ModelSerializer):
    contractor = SubContractorSerializer()
    class Meta:
        model = Subpart
        fields = '__all__'
    
    def create(self, validated_data):
        contractor_data = validated_data.pop('contractor')
        contractor, created = SubContractor.objects.get_or_create(**contractor_data)
        subpart = Subpart.objects.create(contractor=contractor, **validated_data)
        return subpart


class ProductSerializer(serializers.ModelSerializer):
    subparts = SubpartSerializer(many=True)
    class Meta:
        model = Product
        fields = '__all__'
    
    def create(self, validated_data):
        subparts_data = validated_data.pop('subparts')
        product = Product.objects.create(**validated_data)
        
        for subpart_data in subparts_data:
            contractor_data = subpart_data.pop('contractor')
            contractor, created = SubContractor.objects.get_or_create(**contractor_data)
            subpart, created = Subpart.objects.get_or_create(contractor=contractor, **subpart_data)
            product.subparts.add(subpart)
        
        return product


class ProductSubpartSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = ProductSubpart
        fields = '__all__'

from .models import TransactionLog

class TransactionLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = TransactionLog
        fields = '__all__'