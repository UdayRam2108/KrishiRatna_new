from django.db import models

class MandiPrice(models.Model):
    """
    Stores mandi prices fetched from government / external sources.
    This table is READ-OPTIMIZED for frontend usage.
    """

    # Crop info
    crop_key = models.CharField(max_length=50)   # e.g. wheat, maize
    crop_name = models.CharField(max_length=100) # optional human-readable

    # Location info
    market = models.CharField(max_length=100)
    district = models.CharField(max_length=100, blank=True)
    state = models.CharField(max_length=100)

    # Price info
    price = models.IntegerField()  # modal price (₹)

    # Meta
    source = models.CharField(
        max_length=50,
        default="agmarknet"
    )

    date = models.DateField()  # price date
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        indexes = [
            models.Index(fields=["crop_key"]),
            models.Index(fields=["state"]),
            models.Index(fields=["district"]),
            models.Index(fields=["date"]),
        ]
        ordering = ["-date", "crop_key"]

    def __str__(self):
        return f"{self.crop_key} | {self.market} | ₹{self.price}"
