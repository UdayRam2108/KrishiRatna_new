from django.core.management.base import BaseCommand
from mandi.models import MandiPrice
from datetime import date

class Command(BaseCommand):
    help = "Seed demo mandi prices (fallback data)"

    def handle(self, *args, **kwargs):
        demo_data = [
            ("wheat", "Wheat", "Rajkot", "Rajkot", "Gujarat", 5500),
            ("maize", "Maize", "Ahmedabad", "Ahmedabad", "Gujarat", 2400),
            ("bajra", "Bajra", "Junagadh", "Junagadh", "Gujarat", 3500),
            ("onion", "Onion", "Lasalgaon", "Nashik", "Maharashtra", 2392),
            ("potato", "Potato", "Agra", "Agra", "Uttar Pradesh", 1118),
        ]

        for crop_key, crop_name, market, district, state, price in demo_data:
            MandiPrice.objects.update_or_create(
                crop_key=crop_key,
                market=market,
                district=district,
                state=state,
                date=date.today(),
                defaults={
                    "crop_name": crop_name,
                    "price": price,
                    "source": "demo"
                }
            )

        self.stdout.write(self.style.SUCCESS("✅ Demo mandi data inserted successfully"))
