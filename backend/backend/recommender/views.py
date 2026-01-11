from django.contrib.auth.models import User
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
import requests
import pickle
import os
import requests
from mandi.models import MandiPrice
from datetime import datetime

def fetch_and_store_mandi():
    url = "https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070/records"

    params = {
        "api-key": "579b464db66ec23bdd000001bdaa9dbc27ed43cd6a3125f84c0e5961",
        "format": "json",
        "limit": 100
    }

    res = requests.get(url, params=params)
    data = res.json()

    records = data.get("records", [])

    count = 0

    for r in records:
        MandiPrice.objects.update_or_create(
            state=r.get("state"),
            district=r.get("district"),
            market=r.get("market"),
            commodity=r.get("commodity"),
            variety=r.get("variety"),
            arrival_date=r.get("arrival_date"),
            defaults={
                "min_price": float(r.get("min_price") or 0),
                "max_price": float(r.get("max_price") or 0),
                "modal_price": float(r.get("modal_price") or 0),
            }
        )
        count += 1

    return count

# ================================
# 🔐 USER REGISTRATION API
# ================================
@api_view(['POST'])
def register_user(request):
    username = request.data.get('username')
    email = request.data.get('email')
    password = request.data.get('password')

    if not username or not password:
        return Response(
            {"error": "Username and password required"},
            status=status.HTTP_400_BAD_REQUEST
        )

    if User.objects.filter(username=username).exists():
        return Response(
            {"error": "User already exists"},
            status=status.HTTP_400_BAD_REQUEST
        )

    User.objects.create_user(
        username=username,
        email=email,
        password=password
    )

    return Response(
        {"message": "User registered successfully"},
        status=status.HTTP_201_CREATED
    )


# ================================
# 🌦️ WEATHER API
# ================================
OPENWEATHER_API_KEY = "388657e81d4d0bbd127bd3ee2ddf486d"


@api_view(['GET'])
def weather_view(request):
    lat = request.GET.get('lat')
    lon = request.GET.get('lon')

    if not lat or not lon:
        return Response(
            {"error": "Latitude and Longitude required"},
            status=status.HTTP_400_BAD_REQUEST
        )

    url = "https://api.openweathermap.org/data/2.5/weather"
    params = {
        "lat": lat,
        "lon": lon,
        "appid": OPENWEATHER_API_KEY,
        "units": "metric"
    }

    response = requests.get(url, params=params)

    if response.status_code != 200:
        return Response(
            {"error": "Weather API error", "details": response.json()},
            status=status.HTTP_400_BAD_REQUEST
        )

    data = response.json()

    return Response({
        "temperature": data["main"]["temp"],
        "humidity": data["main"]["humidity"]
    })


# ================================
# 🌾 CROP RECOMMENDATION API
# ================================
@api_view(['POST'])
def recommend_crop(request):
    try:
        data = request.data

        features = [
            float(data['N']),
            float(data['P']),
            float(data['K']),
            float(data['temperature']),
            float(data['humidity']),
            float(data['ph']),
            float(data['rainfall']),
        ]

        # 🔥 SAFE ABSOLUTE PATH (manage.py based)
        BASE_PATH = os.path.dirname(
            os.path.dirname(
                os.path.dirname(os.path.abspath(__file__))
            )
        )

        model_path = os.path.join(BASE_PATH, "crop_model.pkl")

        model = pickle.load(open(model_path, "rb"))
        prediction = model.predict([features])[0]

        return Response(
            {"recommended_crop": prediction},
            status=status.HTTP_200_OK
        )

    except Exception as e:
        return Response(
            {"error": str(e)},
            status=status.HTTP_400_BAD_REQUEST
        )
