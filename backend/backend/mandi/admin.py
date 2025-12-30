from django.contrib import admin
from .models import MandiPrice


@admin.register(MandiPrice)
class MandiPriceAdmin(admin.ModelAdmin):
    list_display = (
        "crop_key",
        "market",
        "district",
        "state",
        "price",
        "date",
        "source",
    )

    list_filter = ("state", "district", "crop_key", "date")
    search_fields = ("crop_key", "market", "district", "state")
    ordering = ("-date", "crop_key")
