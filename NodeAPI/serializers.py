from rest_framework import serializers
from .models import Product, SubPart

class SubPartSerializer(serializers.ModelSerializer):
    class Meta:
        model = SubPart
        fields = ['id', 'product', 'quantity', 'hash']

class ProductSerializer(serializers.ModelSerializer):
    sub_parts = SubPartSerializer(many=True)

    class Meta:
        model = Product
        fields = ['id', 'info', 'owner', 'quantity', 'sub_parts']

    def create(self, validated_data):
        sub_parts_data = validated_data.pop('sub_parts')
        product = Product.objects.create(**validated_data)
        for sub_part_data in sub_parts_data:
            SubPart.objects.create(main_product=product, **sub_part_data)
        return product
