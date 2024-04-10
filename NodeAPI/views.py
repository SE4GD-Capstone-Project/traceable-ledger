from django.shortcuts import redirect, render
from django.urls import reverse
from rest_framework import viewsets
from .models import Product
from .serializers import ProductSerializer

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer


from django.shortcuts import render, redirect
from django.http import JsonResponse
from .models import Product, Subpart, ProductSubpart
import json
from .forms import ProductForm

def create_product(request):
    if request.method == 'POST':
        form = ProductForm(request.POST)
        if form.is_valid():
            # Save the Product form but don't commit to DB yet as we need to manually set some fields
            product = form.save(commit=False)
            
            # Extract and set the calculated fields from the form
            product.number_of_units = request.POST.get('number_of_units', 0)
            product.co2_per_unit = request.POST.get('co2_per_unit', 0.0)
            # Now save Product to DB
            product.save()

            # Process the dynamically added subparts
            subparts_data = request.POST.getlist('subparts[]')
            for subpart_str in subparts_data:
                subpart_data = json.loads(subpart_str)
                
                # Ensure you're handling the possibility of the subpart already existing correctly
                subpart, created = Subpart.objects.get_or_create(
                    name=subpart_data['name'],
                    defaults={
                        'co2_footprint': subpart_data['co2_per_unit'],
                        # Add any additional default fields here
                    }
                )
                
                # Calculate the quantity needed per product from subpart_data
                quantity_needed_per_product = subpart_data.get('units_needed_per_product', 0)

                # Link the Subpart to the Product with the specified quantity
                ProductSubpart.objects.create(
                    product=product,
                    subpart=subpart,
                    quantity_needed_per_unit=quantity_needed_per_product,
                    units_to_buy=subpart_data['units_bought']
                )

            return redirect('../')  # Redirect as appropriate
    else:
        form = ProductForm()

    return render(request, 'create_product.html', {'form': form})
