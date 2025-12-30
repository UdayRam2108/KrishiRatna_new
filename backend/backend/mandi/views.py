from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.db.models import Max
from mandi.models import MandiPrice
from datetime import date


@api_view(["GET"])
def mandi_prices(request):
    """
    Returns latest mandi prices from DB with REAL trend (▲ / ▼)
    Query params:
      ?state=Gujarat
      ?district=Rajkot
      ?limit=6
    """

    state = request.GET.get("state", "").strip()
    district = request.GET.get("district", "").strip()
    limit = int(request.GET.get("limit", 6))

    # --------------------------
    # BASE QUERY
    # --------------------------
    base_qs = MandiPrice.objects.all()

    if state:
        base_qs = base_qs.filter(state__iexact=state)

    if district:
        base_qs = base_qs.filter(district__iexact=district)

    # --------------------------
    # FIND LATEST DATE
    # --------------------------
    latest_date = base_qs.aggregate(latest=Max("date"))["latest"]

    if not latest_date:
        return Response({
            "state": state,
            "district": district,
            "updated_at": None,
            "prices": []
        })

    today_qs = base_qs.filter(date=latest_date)

    # --------------------------
    # BUILD RESPONSE (ONE PER CROP)
    # --------------------------
    seen = set()
    prices = []

    for obj in today_qs.order_by("crop_key", "-created_at"):
        key = (obj.crop_key, obj.market)

        if key in seen:
            continue
        seen.add(key)

        # --------------------------
        # FIND PREVIOUS PRICE
        # --------------------------
        prev_obj = (
            MandiPrice.objects
            .filter(
                crop_key=obj.crop_key,
                market=obj.market,
                date__lt=latest_date
            )
            .order_by("-date")
            .first()
        )

        trend = "same"
        if prev_obj:
            if obj.price > prev_obj.price:
                trend = "up"
            elif obj.price < prev_obj.price:
                trend = "down"

        prices.append({
            "crop_key": obj.crop_key,
            "market": obj.market,
            "price": obj.price,
            "trend": trend
        })

        if len(prices) >= limit:
            break

    return Response({
        "state": state,
        "district": district,
        "updated_at": latest_date.isoformat(),
        "prices": prices
    })
