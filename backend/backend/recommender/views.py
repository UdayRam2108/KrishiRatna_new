# backend/recommender/views.py

from django.contrib.auth.models import User
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
import requests
import pickle
import os

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
# 🌦️ WEATHER API (OLD)
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
# 🌦️ WEATHER BY CITY + FORECAST
# ================================
@api_view(['GET'])
def weather_by_city(request):
    city = request.GET.get("city")

    if not city:
        return Response({"error": "City required"}, status=400)

    current_url = "https://api.openweathermap.org/data/2.5/weather"
    forecast_url = "https://api.openweathermap.org/data/2.5/forecast"

    params = {
        "q": city,
        "appid": OPENWEATHER_API_KEY,
        "units": "metric"
    }

    current_res = requests.get(current_url, params=params)
    forecast_res = requests.get(forecast_url, params=params)

    if current_res.status_code != 200:
        return Response({"error": "City not found"}, status=400)

    current_data = current_res.json()
    forecast_data = forecast_res.json()

    daily = []
    seen_dates = set()

    for item in forecast_data.get("list", []):
        date = item["dt_txt"].split(" ")[0]
        if date not in seen_dates:
            seen_dates.add(date)
            daily.append({
                "date": date,
                "temp": item["main"]["temp"],
                "desc": item["weather"][0]["description"]
            })
        if len(daily) >= 5:
            break

    return Response({
        "city": city,
        "current": {
            "temp": current_data["main"]["temp"],
            "humidity": current_data["main"]["humidity"],
            "desc": current_data["weather"][0]["description"]
        },
        "forecast": daily
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


# ================================
# 🌱 FERTILIZER RECOMMENDATION API
# ================================
@api_view(['POST'])
def fertilizer_recommend(request):
    try:
        data = request.data

        crop = data.get("crop", "")
        N = float(data.get("N"))
        P = float(data.get("P"))
        K = float(data.get("K"))
        ph = float(data.get("ph"))

        suggestions = []

        if N < 50:
            suggestions.append("Urea (Nitrogen)")
        if P < 40:
            suggestions.append("DAP (Phosphorus)")
        if K < 40:
            suggestions.append("Potash (Potassium)")
        if ph < 5.5:
            suggestions.append("Lime (to increase soil pH)")
        if ph > 7.5:
            suggestions.append("Gypsum (to reduce soil pH)")

        if not suggestions:
            suggestions.append("Organic Compost is enough. Soil is balanced")

        return Response({
            "crop": crop,
            "suggestions": suggestions
        })

    except Exception as e:
        return Response({
            "error": str(e)
        }, status=400)
