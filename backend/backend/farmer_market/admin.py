from django.contrib import admin
from .models import Listing

@admin.register(Listing)
class ListingAdmin(admin.ModelAdmin):
    list_display = ("title", "category", "price", "location", "phone", "created_at")
    list_filter = ("category", "created_at")
    search_fields = ("title", "location", "phone")
