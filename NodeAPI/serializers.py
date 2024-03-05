from rest_framework import serializers
from .models import Product

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ['id', 'info', 'owner', 'quantity', 'subpart1_product_id', 'subpart1_quantity', 'subpart1_hash', 'subpart2_product_id', 'subpart2_quantity', 'subpart2_hash', 'subpart3_product_id', 'subpart3_quantity', 'subpart3_hash']
        read_only_fields = ['subpart1_hash', 'subpart2_hash', 'subpart3_hash']  # Hashes are generated automatically

    def create(self, validated_data):
        product = Product.objects.create(**validated_data)
        return product
