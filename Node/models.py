from django.db import models
from django.contrib.auth.models import AbstractUser

class Company(AbstractUser):
    # Add additional fields if needed
    pass

class Product(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='products')

    def __str__(self):
        return self.name
