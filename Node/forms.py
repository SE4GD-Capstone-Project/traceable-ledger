from django import forms
from django.contrib.auth.forms import UserCreationForm
from .models import Company

class CompanySignUpForm(UserCreationForm):
    class Meta:
        model = Company
        fields = ['username', 'email', 'password1', 'password2']
