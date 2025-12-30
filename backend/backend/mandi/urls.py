from django.urls import path
from .views import mandi_prices

urlpatterns = [
    path('prices/', mandi_prices),
]
