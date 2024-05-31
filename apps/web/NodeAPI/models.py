from django.db import models 
from django.db.models.signals import post_save 
from django.dispatch import receiver 
import json

 
class SubManufacturer(models.Model):
    sub_manufacturer_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100, blank=True)
    mainURL = models.CharField(max_length=100, blank=True)
# Include other fields as necessary for submanufacturers
 
    def __str__(self): 
        return self.name 

class SustainabilityMetrics(models.Model):
    sustainability_metrics_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255, blank=True)
    unit = models.CharField(max_length=100, blank=True)
    description = models.TextField()
    quantity_needed_per_unit = models.FloatField() 
    
    def __str__(self): 
            data = {
                "name": self.name,
                "unit": self.unit,
                "description": self.description
            }
            # Convert the dictionary to a JSON string
            return json.dumps(data)


class Subpart(models.Model): 
    subpart_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100) 
    sustainability_metrics = models.ManyToManyField(SustainabilityMetrics, related_name='subparts')
    units_bought = models.FloatField(help_text="Number of units to buy from the submanufacturer") 
    manufacturer = models.ForeignKey(SubManufacturer, on_delete=models.CASCADE, blank=True, null=True)
    # You might include other fields relevant to subparts, such as a unit price, etc. 
 
    def __str__(self): 
        return self.name 
    
    def get_sustainablity_data(self):
        data = {"sustainability_metrics": self.sustainability_metrics}
        return str(data)
 
class Product(models.Model): 
    product_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100) 
    number_of_units = models.IntegerField(help_text="Number of units available")
    sustainability_metrics = models.ManyToManyField(SustainabilityMetrics, related_name='products_sustainability')
    subparts = models.ManyToManyField(Subpart, related_name='products')
    manufacturer = models.ForeignKey(SubManufacturer, on_delete=models.CASCADE, blank=True, null=True)
     
     
    def __str__(self): 
        return self.name 
    
    def get_sustainablity_data(self):
        data = {"sustainability_metrics": self.sustainability_metrics}
        return str(data)
    
    def __hash__(self) -> int: 
        return hash(str((self.sustainability_metrics))) 
 
class ProductSubpart(models.Model): 
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='product_subparts') 
    subpart = models.ForeignKey(Subpart, on_delete=models.CASCADE) 
    quantity_needed_per_unit = models.FloatField(help_text="Quantity of the subpart needed to make one unit of product") 
    units_to_buy = models.FloatField(help_text="Number of units to buy from the submanufacturer") 
 
    def __str__(self): 
        return f"{self.subpart.name} for {self.product.name}" 
            
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