from django.core.management.base import BaseCommand
from mandi.models import MandiPrice
import json
from datetime import datetime
import os

class Command(BaseCommand):
    help = "Import mandi prices from local JSON file"

    def handle(self, *args, **kwargs):
        file_path = os.path.join(os.getcwd(), "mandi_dump.json")

        if not os.path.exists(file_path):
            self.stderr.write("❌ mandi_dump.json file not found!")
            return

        with open(file_path, "r", encoding="utf-8") as f:
            data = json.load(f)

        records = data.get("records", [])

        if not records:
            self.stderr.write("❌ No records in JSON file")
            return

        def normalize_crop(name):
            if not name:
                return None
            name = name.lower()
            if "wheat" in name:
                return "wheat"
            if "maize" in name:
                return "maize"
            if "bajra" in name:
                return "bajra"
            if "onion" in name:
                return "onion"
            if "potato" in name:
                return "potato"
            if "chilli" in name or "chili" in name:
                return "chilli"
            return None

        saved = 0

        for r in records:
            crop_key = normalize_crop(r.get("commodity"))
            if not crop_key:
                continue

            try:
                price = int(float(r.get("modal_price") or 0))
            except:
                continue

            date_str = r.get("arrival_date")
            try:
                price_date = datetime.strptime(date_str, "%d/%m/%Y").date()
            except:
                price_date = datetime.today().date()

            obj, created = MandiPrice.objects.update_or_create(
                crop_key=crop_key,
                market=r.get("market", ""),
                state=r.get("state", ""),
                district=r.get("district", ""),
                date=price_date,
                defaults={
                    "crop_name": r.get("commodity", ""),
                    "price": price,
                    "source": "agmarknet"
                }
            )

            if created:
                saved += 1

        self.stdout.write(self.style.SUCCESS(f"✅ Imported {saved} records"))
