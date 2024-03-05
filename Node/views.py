from django.shortcuts import render

from django.shortcuts import render, redirect
from django.contrib.auth import login, authenticate
from django.views.generic import CreateView, ListView
from django.urls import reverse_lazy
from .forms import CompanySignUpForm
from .models import Product

def signup_view(request):
    if request.method == 'POST':
        form = CompanySignUpForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)
            return redirect('product-list')
    else:
        form = CompanySignUpForm()
    return render(request, 'signup.html', {'form': form})

class ProductCreateView(CreateView):
    model = Product
    fields = ['name', 'description']
    success_url = reverse_lazy('product-list')

    def form_valid(self, form):
        form.instance.company = self.request.user
        return super().form_valid(form)

class ProductListView(ListView):
    model = Product
    context_object_name = 'products'
    template_name = 'product_list.html'
