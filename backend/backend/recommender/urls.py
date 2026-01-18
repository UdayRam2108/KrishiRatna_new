
from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView
from .views import (
    register_user,
    weather_view,
    weather_by_city,
    recommend_crop,
    fertilizer_recommend,
)

urlpatterns = [
    path('register/', register_user),
    path('login/', TokenObtainPairView.as_view()),

    # OLD weather (lat, lon)
    path('weather/', weather_view),

    # NEW weather by city
    path('weather-by-city/', weather_by_city),

    # Crop & Fertilizer
    path('recommend/', recommend_crop),
    path('fertilizer-recommend/', fertilizer_recommend),
]
