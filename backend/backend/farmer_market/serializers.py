from rest_framework import serializers
from .models import Listing

class ListingSerializer(serializers.ModelSerializer):
    photo = serializers.ImageField(use_url=True)

    class Meta:
        model = Listing
        fields = "__all__"

