from django.core.management.base import BaseCommand
from mandi.models import MandiPrice
import requests
from datetime import datetime

AGMARKNET_API = "https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070"
API_KEY = "579b464db66ec23bdd000001bdaa9dbc27ed43cd6a3125f84c0e5961"

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
    if "chilli" in name:
        return "chilli"
    return None

class Command(BaseCommand):
    help = "Fetch mandi prices from Agmarknet and store in database"

    def handle(self, *args, **kwargs):
        self.stdout.write("📡 Fetching LIVE mandi prices...")

        params = {
            "api-key": API_KEY,
            "format": "json",
            "limit": 100
        }

        try:
            response = requests.get(AGMARKNET_API, params=params, timeout=20)
            print("HTTP:", response.status_code)

            if response.status_code != 200:
                print(response.text[:500])
                return

            data = response.json()
            records = data.get("records", [])
        except Exception as e:
            self.stderr.write(f"❌ API error: {e}")
            return

        saved = 0

        for r in records:
            crop_key = normalize_crop(r.get("commodity"))
            if not crop_key:
                continue

            try:
                price = int(float(r.get("modal_price")))
            except:
                continue

            date_str = r.get("arrival_date")
            try:
                price_date = datetime.strptime(date_str, "%d/%m/%Y").date()
            except:
                continue

            MandiPrice.objects.update_or_create(
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
            saved += 1

        self.stdout.write(self.style.SUCCESS(f"✅ LIVE Mandi prices updated: {saved} records"))
