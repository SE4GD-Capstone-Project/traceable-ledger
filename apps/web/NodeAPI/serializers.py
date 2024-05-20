from rest_framework import serializers
from .models import Product, Subpart, ProductSubpart,SubManufacturer

# # Serializer for Subpart
# class SubpartSerializer(serializers.ModelSerializer):
#     manufacturer_name = serializers.CharField(source='manufacturer.name', read_only=True)  # Assuming you might want the manufacturer's name

#     class Meta:
#         model = Subpart
#         fields = ['id', 'name', 'co2_footprint', 'manufacturer_name']

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


class SubManufacturerSerializer(serializers.ModelSerializer):
    class Meta:
        model = SubManufacturer
        fields = '__all__'


class SubpartSerializer(serializers.ModelSerializer):
    manufacturer = SubManufacturerSerializer()
    class Meta:
        model = Subpart
        fields = '__all__'
    
    def create(self, validated_data):
        manufacturer_data = validated_data.pop('manufacturer')
        manufacturer, created = SubManufacturer.objects.get_or_create(**manufacturer_data)
        subpart = Subpart.objects.create(manufacturer=manufacturer, **validated_data)
        return subpart


class ProductSerializer(serializers.ModelSerializer):
    subparts = SubpartSerializer(many=True)
    manufacturer = SubManufacturerSerializer()
    class Meta:
        model = Product
        fields = '__all__'
    
    def create(self, validated_data):
        subparts_data = validated_data.pop('subparts')
        manufacturer_data = validated_data.pop("manufacturer")
        manufacturer, created = SubManufacturer.objects.get_or_create(**manufacturer_data)

        product = Product.objects.create(manufacturer=manufacturer,**validated_data)

        for subpart_data in subparts_data:
            manufacturer_data = subpart_data.pop('manufacturer')
            manufacturer, created = SubManufacturer.objects.get_or_create(**manufacturer_data)
            subpart, created = Subpart.objects.get_or_create(manufacturer=manufacturer, **subpart_data)
            product.subparts.add(subpart)


            # Create TransactionLog for each subpart
            TransactionLog.objects.create(
                buyer_id="123",  # Assuming this is a fixed value or could be dynamic based on other logic
                seller_id=str(subpart.manufacturer),
                product_id=str(product.id),
                subpart_id=str(subpart.id),
                amount=subpart.units_bought
            )
        
        return product
    
    def update(self, instance, validated_data):
        subparts_data = validated_data.pop('subparts', None)

        # Update the product fields if provided
        instance.name = validated_data.get('name', instance.name)
        instance.number_of_units = validated_data.get('number_of_units', instance.number_of_units)
        instance.co2_footprint_per_unit = validated_data.get('co2_footprint_per_unit', instance.co2_footprint_per_unit)
        instance.save()

        if subparts_data:
            for subpart_data in subparts_data:
                manufacturer_data = subpart_data.pop('manufacturer')
                manufacturer, created = SubManufacturer.objects.get_or_create(**manufacturer_data)
                subpart, created = Subpart.objects.get_or_create(manufacturer=manufacturer, **subpart_data)
                instance.subparts.add(subpart)
                
                # Create TransactionLog for each subpart
                TransactionLog.objects.create(
                    buyer_id="123",  # Assuming this is a fixed value or could be dynamic based on other logic
                    seller_id=str(subpart.manufacturer),
                    product_id=str(instance.id),
                    subpart_id=str(subpart.id),
                    amount=subpart.units_bought
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