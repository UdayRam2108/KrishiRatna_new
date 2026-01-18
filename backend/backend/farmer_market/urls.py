from django.urls import path
from .views import (
    all_listings,
    my_listings,
    single_listing,
    add_listing,
    delete_listing,
    update_listing,
)

urlpatterns = [
    path("", all_listings),
    path("my/", my_listings),   # ✅ NEW
    path("<int:pk>/", single_listing),
    path("add/", add_listing),
    path("delete/<int:pk>/", delete_listing),
    path("edit/<int:pk>/", update_listing),
]
