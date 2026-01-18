from django.db import models

class Listing(models.Model):

    CATEGORY_CHOICES = (
        ("tools", "Tools"),
        ("cattle", "Cattle"),
    )

    CATTLE_CHOICES = (
        ("cow", "Cow"),
        ("buffalo", "Buffalo"),
        ("ox", "Ox"),
        ("other", "Other"),
    )

    TOOL_CHOICES = (
        ("vehicles", "Vehicles"),
        ("machinery", "Machinery"),
        ("instruments", "Instruments"),
        ("other", "Other"),
    )

    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)

    title = models.CharField(max_length=200)

    cattle_type = models.CharField(
        max_length=20,
        choices=CATTLE_CHOICES,
        blank=True,
        null=True
    )

    tool_type = models.CharField(
        max_length=20,
        choices=TOOL_CHOICES,
        blank=True,
        null=True
    )

    price = models.IntegerField()
    phone = models.CharField(max_length=15)
    seller = models.CharField(max_length=100)
    location = models.CharField(max_length=200)
    description = models.TextField()
    photo = models.ImageField(upload_to="market/")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} ({self.category})"
