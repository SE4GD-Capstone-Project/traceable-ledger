from django.db import models
import hashlib

class Product(models.Model):
    info = models.TextField()
    owner = models.TextField()
    quantity = models.IntegerField()
    # Subpart 1
    subpart1_product_id = models.IntegerField(null=True, blank=True)
    subpart1_quantity = models.IntegerField(null=True, blank=True)
    subpart1_hash = models.CharField(max_length=64, blank=True, editable=False)
    # Subpart 2
    subpart2_product_id = models.IntegerField(null=True, blank=True)
    subpart2_quantity = models.IntegerField(null=True, blank=True)
    subpart2_hash = models.CharField(max_length=64, blank=True, editable=False)
    # Subpart 3
    subpart3_product_id = models.IntegerField(null=True, blank=True)
    subpart3_quantity = models.IntegerField(null=True, blank=True)
    subpart3_hash = models.CharField(max_length=64, blank=True, editable=False)

    def save(self, *args, **kwargs):
        # Calculate hashes for each subpart that exists
        if self.subpart1_product_id and self.subpart1_quantity:
            self.subpart1_hash = hashlib.sha256(f'{self.subpart1_product_id}-{self.subpart1_quantity}'.encode()).hexdigest()
        if self.subpart2_product_id and self.subpart2_quantity:
            self.subpart2_hash = hashlib.sha256(f'{self.subpart2_product_id}-{self.subpart2_quantity}'.encode()).hexdigest()
        if self.subpart3_product_id and self.subpart3_quantity:
            self.subpart3_hash = hashlib.sha256(f'{self.subpart3_product_id}-{self.subpart3_quantity}'.encode()).hexdigest()

        super().save(*args, **kwargs)
