from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView
from .views import register_user, weather_view, recommend_crop

urlpatterns = [
    path('register/', register_user),
    path('login/', TokenObtainPairView.as_view()),
    path('weather/', weather_view),
    path('recommend/', recommend_crop),
]
