from django.db import models 
from django.db.models.signals import post_save 
from django.dispatch import receiver 
 
 
class SubManufacturer(models.Model):
    name = models.CharField(max_length=100, blank=True)
    mainURL = models.CharField(max_length=100, blank=True)
# Include other fields as necessary for submanufacturers
 
    def __str__(self): 
        return self.name 

class SustainabilityMetrics(models.Model):
    name = models.CharField(max_length=255, blank=True)
    unit = models.CharField(max_length=100, blank=True)
    description = models.TextField()
    
    def __str__(self): 
        return self.name 


class Subpart(models.Model): 
    name = models.CharField(max_length=100) 
    sustainability_metrics = models.ManyToManyField(SustainabilityMetrics, related_name='subparts')
    quantity_needed_per_unit = models.FloatField(help_text="Quantity of the subpart needed to make one unit of product") 
    units_bought = models.FloatField(help_text="Number of units to buy from the submanufacturer") 
    manufacturer = models.ForeignKey(SubManufacturer, on_delete=models.CASCADE, blank=True, null=True)
    # You might include other fields relevant to subparts, such as a unit price, etc. 
 
    def __str__(self): 
        return self.name 
    def get_sustainablity_data(self):
        data = {"co2_footprint": self.co2_footprint}
        return data
 

class Product(models.Model): 
    name = models.CharField(max_length=100) 
    number_of_units = models.IntegerField(help_text="Number of units available")
    co2_footprint = models.FloatField()
    subparts = models.ManyToManyField(Subpart, related_name='products')
    manufacturer = models.ForeignKey(SubManufacturer, on_delete=models.CASCADE, blank=True, null=True)
     
     
    def __str__(self): 
        return self.name 
    
    def __hash__(self) -> int: 
        return hash((self.co2_footprint))

    
 
# class ProductSubpart(models.Model): 
#     product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='product_subparts') 
#     subpart = models.ForeignKey(Subpart, on_delete=models.CASCADE) 
#     quantity_needed_per_unit = models.FloatField(help_text="Quantity of the subpart needed to make one unit of product") 
#     units_to_buy = models.FloatField(help_text="Number of units to buy from the submanufacturer") 
 
#     def __str__(self): 
#         return f"{self.subpart.name} for {self.product.name}" 
     
#     def save(self, *args, **kwargs): 
#         super(ProductSubpart,self).save(*args, **kwargs) 
#         buyer_id = "123" 
#         seller_id = str(self.subpart.manufacturer) 
#         product_id = str(self.product) 
#         subpart_id = str(self.subpart) 
#         amount = str(self.units_to_buy) 
         
#         TransactionLog.objects.create(buyer_id=buyer_id, 
#                                       seller_id=seller_id, 
#                                       product_id=product_id, 
#                                       subpart_id=subpart_id, 
#                                       amount=amount) 
     
 
 
class ProductSubpart(models.Model): 
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='product_subparts') 
    subpart = models.ForeignKey(Subpart, on_delete=models.CASCADE) 
    quantity_needed_per_unit = models.FloatField(help_text="Quantity of the subpart needed to make one unit of product") 
    units_to_buy = models.FloatField(help_text="Number of units to buy from the submanufacturer") 
 
    def __str__(self): 
        return f"{self.subpart.name} for {self.product.name}" 
 
# from django.db.models.signals import post_save
# from django.dispatch import receiver

# @receiver(post_save, sender=Product)
# def create_transaction_log(sender, instance, created, **kwargs):
#     print("in product post save")
#     if created:  # Only run this for newly created instances
#         for subpart in instance.subparts.all():
#             TransactionLog.objects.create(
#                 buyer_id="123",  # Assuming this is a fixed value or could be dynamic based on other logic
#                 seller_id=str(subpart.manufacturer),
#                 product_id=str(instance.id),
#                 subpart_id=str(subpart.id),
#                 amount=str(subpart.units_bought)
#             )
           
class TransactionLog(models.Model): 
    buyer_id = models.CharField(max_length=100) 
    seller_id = models.CharField(max_length=100) 
    product_id = models.CharField(max_length=100) 
    subpart_id = models.CharField(max_length=100) 
    amount = models.FloatField(max_length=100) 
    date = models.DateTimeField(auto_now=True)
    sustainability_data = models.CharField(max_length=1000,blank=True, null=True) 
    log_hash = models.CharField(max_length=100) 
    def __hash__(self) -> int: 
        return hash(( 
            self.buyer_id,  
            self.seller_id,  
            self.product_id,  
            self.subpart_id,  
            self.amount, 
            self.date, 
            self.sustainability_data
            ) )
     
    def save(self, *args, **kwargs):
        self.log_hash = hash(self)         
        super(TransactionLog,self).save(*args, **kwargs)