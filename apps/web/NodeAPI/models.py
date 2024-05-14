from django.db import models 
from django.db.models.signals import post_save 
from django.dispatch import receiver 
 
 
class SubContractor(models.Model): 
    name = models.CharField(max_length=100, blank=True) 
    # Include other fields as necessary for subcontractors 
 
    def __str__(self): 
        return self.name 

class Subpart(models.Model): 
    name = models.CharField(max_length=100) 
    co2_footprint = models.FloatField(help_text="CO2 footprint per unit") 
    contractor = models.ForeignKey(SubContractor, on_delete=models.CASCADE, blank=True, null=True) 
    # You might include other fields relevant to subparts, such as a unit price, etc. 
 
    def __str__(self): 
        return self.name 
 

class Product(models.Model): 
    name = models.CharField(max_length=100) 
    number_of_units = models.IntegerField(help_text="Number of units available") 
    co2_footprint_per_unit = models.FloatField()
    subparts = models.ManyToManyField(Subpart, related_name='products')
     
     
    def __str__(self): 
        return self.name 
    
    def __hash__(self) -> int: 
        return hash((self.co2_footprint_per_unit)) 
 
 
# class ProductSubpart(models.Model): 
#     product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='product_subparts') 
#     subpart = models.ForeignKey(Subpart, on_delete=models.CASCADE) 
#     quantity_needed_per_unit = models.FloatField(help_text="Quantity of the subpart needed to make one unit of product") 
#     units_to_buy = models.FloatField(help_text="Number of units to buy from the subcontractor") 
 
#     def __str__(self): 
#         return f"{self.subpart.name} for {self.product.name}" 
     
#     def save(self, *args, **kwargs): 
#         super(ProductSubpart,self).save(*args, **kwargs) 
#         buyer_id = "123" 
#         seller_id = str(self.subpart.contractor) 
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
    units_to_buy = models.FloatField(help_text="Number of units to buy from the subcontractor") 
 
    def __str__(self): 
        return f"{self.subpart.name} for {self.product.name}" 
 
# Signal receiver function to create a TransactionLog after a ProductSubpart is saved 
@receiver(post_save, sender=ProductSubpart) 
def create_transaction_log(sender, instance, created, **kwargs): 
    if created:  # Only run this for newly created instances 
        TransactionLog.objects.create( 
            buyer_id="123",  # Assuming this is a fixed value or could be dynamic based on other logic 
            seller_id=str(instance.subpart.contractor), 
            product_id=str(instance.product), 
            subpart_id=str(instance.subpart), 
            amount=str(instance.units_to_buy) 
        )     
           
class TransactionLog(models.Model): 
    buyer_id = models.CharField(max_length=100) 
    seller_id = models.CharField(max_length=100) 
    product_id = models.CharField(max_length=100) 
    subpart_id = models.CharField(max_length=100) 
    amount = models.FloatField(max_length=100) 
    date = models.DateTimeField(auto_now=True) 
    log_hash = models.CharField(max_length=100) 
    def __hash__(self) -> int: 
        return hash(( 
            self.buyer_id,  
            self.seller_id,  
            self.product_id,  
            self.subpart_id,  
            self.amount, 
            self.date, 
            ) )
     
    def save(self, *args, **kwargs):
        self.log_hash = hash(self)         
        super(TransactionLog,self).save(*args, **kwargs)