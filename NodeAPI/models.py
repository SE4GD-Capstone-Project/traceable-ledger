from django.db import models
import hashlib

class Product(models.Model):
    info = models.TextField()
    owner = models.TextField()
    quantity = models.IntegerField()

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        for sub_part in self.sub_parts.all():
            sub_part.hash = hashlib.sha256(f'{sub_part.product.id}-{sub_part.quantity}'.encode()).hexdigest()
            sub_part.save()

class SubPart(models.Model):
    main_product = models.ForeignKey(Product, related_name='sub_parts', on_delete=models.CASCADE)
    product = models.ForeignKey(Product, related_name='+', on_delete=models.CASCADE)
    quantity = models.IntegerField()
    hash = models.CharField(max_length=64, blank=True)
