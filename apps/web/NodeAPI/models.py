from django.db import models 
from django.db.models.signals import post_save 
from django.dispatch import receiver 
import json
from django.utils.text import slugify
 
class SubManufacturer(models.Model):
    name = models.CharField(max_length=100, blank=True)
    mainURL = models.CharField(max_length=100, blank=True)
   
 
    def __str__(self): 
        return self.name 

class SustainabilityMetric(models.Model):
    metric_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255, blank=True)
    unit = models.CharField(max_length=100, blank=True)
    description = models.TextField()

import random,string
from django.utils.text import slugify

class Subpart(models.Model): 
    subpart_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100) 
    quantity_needed_per_unit = models.FloatField(help_text="Quantity of the subpart needed to make one unit of product")
    units_bought = models.FloatField(help_text="Number of units to buy from the submanufacturer")
    manufacturer = models.ForeignKey(SubManufacturer, on_delete=models.CASCADE, blank=True, null=True)
    slug = models.SlugField(unique=True, blank=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            random_string = ''.join(random.choices(string.ascii_lowercase + string.digits, k=5))
            self.slug = slugify(f"{self.name}-{random_string}")
        super(Subpart, self).save(*args, **kwargs)

    # You might include other fields relevant to subparts, such as a unit price, etc. 
 
    def __str__(self): 
        return self.name

class Product(models.Model): 
    product_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100) 
    number_of_units = models.IntegerField(help_text="Number of units available")
    subparts = models.ManyToManyField(Subpart, related_name='products')
    manufacturer = models.ForeignKey(SubManufacturer, on_delete=models.CASCADE, blank=True, null=True)
    slug = models.SlugField(unique=True, blank=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super(Product, self).save(*args, **kwargs)
     
     
    def __str__(self): 
        return self.name
 
class ProductSubpart(models.Model): 
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='product_subparts') 
    subpart = models.ForeignKey(Subpart, on_delete=models.CASCADE) 
    quantity_needed_per_unit = models.FloatField(help_text="Quantity of the subpart needed to make one unit of product") 
    units_to_buy = models.FloatField(help_text="Number of units to buy from the submanufacturer") 
 
    def __str__(self): 
        return f"{self.subpart.name} for {self.product.name}"

class ProductSustainabilityMetric(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="sustainability_metrics")
    sustainability_metric = models.ForeignKey(SustainabilityMetric, on_delete=models.CASCADE)
    value = models.FloatField()

class SubpartSustainabilityMetric(models.Model):
    subpart = models.ForeignKey(Subpart, on_delete=models.CASCADE, related_name="sustainability_metrics")
    sustainability_metric = models.ForeignKey(SustainabilityMetric, on_delete=models.CASCADE)
    value = models.FloatField()

class TransactionLog(models.Model):
    transaction_log_id = models.AutoField(primary_key=True)
    buyer_id = models.CharField(max_length=100) 
    seller_id = models.CharField(max_length=100) 
    product_id = models.CharField(max_length=100) 
    subpart_id = models.CharField(max_length=100) 
    amount = models.FloatField(max_length=100) 
    date = models.DateTimeField(auto_now=True)
    sustainability_data_subpart = models.CharField(max_length=1000,blank=True, null=True) 
    sustainability_data_product = models.CharField(max_length=1000,blank=True, null=True) 
    log_hash = models.CharField(max_length=100) 
    def __hash__(self) -> int: 
        return hash(( 
            self.buyer_id,  
            self.seller_id,  
            self.product_id,  
            self.subpart_id,  
            self.amount, 
            self.date, 
            self.sustainability_data_subpart,
            self.sustainability_data_product
            ) )
     
    def save(self, *args, **kwargs):
        self.log_hash = hash(self)         
        super(TransactionLog,self).save(*args, **kwargs)