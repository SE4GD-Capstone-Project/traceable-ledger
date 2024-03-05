from django.db import models
from django.contrib.auth.models import AbstractUser

from django.contrib.auth.models import AbstractUser
from django.db import models

class Company(AbstractUser):
    # Redefine the groups and user_permissions fields with a unique related_name
    groups = models.ManyToManyField(
        'auth.Group',
        verbose_name='groups',
        blank=True,
        help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.',
        related_name="company_groups",  # Unique related_name
        related_query_name="company",  # Optional: makes querying in templates & elsewhere a bit clearer
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        verbose_name='user permissions',
        blank=True,
        help_text='Specific permissions for this user.',
        related_name="company_user_permissions",  # Unique related_name
        related_query_name="company",  # Optional
    )


class Product(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='products')

    def __str__(self):
        return self.name
