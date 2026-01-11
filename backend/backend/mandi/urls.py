from django.urls import path
from .views import mandi_prices, mandi_states

urlpatterns = [
    path("prices/", mandi_prices),
    path("states/", mandi_states),
]
