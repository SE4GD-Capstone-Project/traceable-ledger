from django.db import models

class Product(models.Model):
    name = models.CharField(max_length=100)
    number_of_units = models.IntegerField(help_text="Number of units available")
    co2_per_unit = models.FloatField(help_text="CO2 emitted per unit")

    def __str__(self):
        return self.name

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

class ProductSubpart(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='product_subparts')
    subpart = models.ForeignKey(Subpart, on_delete=models.CASCADE)
    quantity_needed_per_unit = models.FloatField(help_text="Quantity of the subpart needed to make one unit of product")
    units_to_buy = models.FloatField(help_text="Number of units to buy from the subcontractor")

    def __str__(self):
        return f"{self.subpart.name} for {self.product.name}"
