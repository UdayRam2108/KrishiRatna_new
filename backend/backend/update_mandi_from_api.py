import os
import django
import requests
from datetime import datetime

# ✅ Same as manage.py
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")
django.setup()

from mandi.models import MandiPrice

API_URL = "https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070/records"
API_KEY = "579b464db66ec23bdd000001bdaa9dbc27ed43cd6a3125f84c0e5961"

params = {
    "api-key": API_KEY,
    "format": "json",
    "limit": 100
}

headers = {
    "User-Agent": "Mozilla/5.0"
}

print("📡 Fetching mandi prices...")

res = requests.get(API_URL, params=params, headers=headers, timeout=30)

print("HTTP STATUS:", res.status_code)

if res.status_code != 200:
    print("❌ API blocked:", res.text[:300])
    exit()

data = res.json()
records = data.get("records", [])

print("Records received:", len(records))


def normalize_crop(name):
    if not name:
        return None
    name = name.lower()
    if "wheat" in name:
        return "wheat"
    if "maize" in name:
        return "maize"
    if "bajra" in name or "pearl millet" in name:
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

    date_str = r.get("arrival_date") or r.get("date")
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

print("✅ New records saved:", saved)
