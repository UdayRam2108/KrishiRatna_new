from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.db.models import Max
from mandi.models import MandiPrice


@api_view(["GET"])
def mandi_prices(request):
    """
    Returns mandi prices from DB with REAL trend (▲ / ▼)

    Query params:
      ?state=Gujarat
      ?district=Rajkot
      ?limit=6   (optional)
    """

    state = request.GET.get("state", "").strip()
    district = request.GET.get("district", "").strip()

    limit = request.GET.get("limit")
    limit = int(limit) if limit else 1000   # ✅ If not provided → return ALL

    # --------------------------
    # BASE QUERY
    # --------------------------
    base_qs = MandiPrice.objects.all()

    if state:
        base_qs = base_qs.filter(state__iexact=state)

    if district:
        base_qs = base_qs.filter(district__iexact=district)

    if not base_qs.exists():
        return Response({
            "state": state,
            "district": district,
            "updated_at": None,
            "prices": []
        })

    # --------------------------
    # FIND GLOBAL LATEST DATE
    # --------------------------
    latest_date = base_qs.aggregate(latest=Max("date"))["latest"]

    # --------------------------
    # GET LATEST AVAILABLE PER CROP
    # --------------------------
    qs = base_qs.order_by("crop_key", "-date", "-created_at")

    seen = set()
    prices = []

    for obj in qs:
        key = obj.crop_key

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
                date__lt=obj.date
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
            "crop_name": obj.crop_name,
            "market": obj.market,
            "state": obj.state,
            "district": obj.district,
            "price": obj.price,
            "trend": trend
        })

        if len(prices) >= limit:
            break

    return Response({
        "state": state,
        "district": district,
        "updated_at": latest_date.isoformat() if latest_date else None,
        "count": len(prices),
        "prices": prices
    })


# =====================================================
# ✅ NEW API — GET ALL STATES FOR DROPDOWN
# =====================================================
@api_view(["GET"])
def mandi_states(request):
    states = (
        MandiPrice.objects
        .exclude(state__isnull=True)
        .exclude(state__exact="")
        .values_list("state", flat=True)
        .distinct()
        .order_by("state")
    )

    return Response({
        "states": list(states)
    })
