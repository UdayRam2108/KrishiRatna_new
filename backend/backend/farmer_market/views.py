from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from .models import Listing
from .serializers import ListingSerializer

# ===========================
# GET ALL LISTINGS (PUBLIC)
# ===========================
@api_view(["GET"])
def all_listings(request):
    qs = Listing.objects.all().order_by("-created_at")
    serializer = ListingSerializer(qs, many=True, context={"request": request})
    return Response(serializer.data)

# ===========================
# GET MY LISTINGS (LOGIN)
# ===========================
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def my_listings(request):
    qs = Listing.objects.filter(seller=request.user.username).order_by("-created_at")
    serializer = ListingSerializer(qs, many=True, context={"request": request})
    return Response(serializer.data)

# ===========================
# GET SINGLE LISTING
# ===========================
@api_view(["GET"])
def single_listing(request, pk):
    try:
        obj = Listing.objects.get(pk=pk)
    except Listing.DoesNotExist:
        return Response({"error": "Not found"}, status=404)

    serializer = ListingSerializer(obj, context={"request": request})
    return Response(serializer.data)

# ===========================
# ADD LISTING (LOGIN REQUIRED)
# ===========================
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def add_listing(request):
    data = request.data.copy()

    # 🔐 AUTO SET SELLER FROM LOGIN USER
    data["seller"] = request.user.username

    serializer = ListingSerializer(data=data, context={"request": request})

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)

    print("❌ SERIALIZER ERROR:", serializer.errors)
    return Response(serializer.errors, status=400)

# ===========================
# DELETE LISTING (ONLY OWNER)
# ===========================
@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def delete_listing(request, pk):
    try:
        obj = Listing.objects.get(pk=pk)
    except Listing.DoesNotExist:
        return Response({"error": "Not found"}, status=404)

    if obj.seller != request.user.username:
        return Response({"error": "Not allowed"}, status=403)

    obj.delete()
    return Response({"message": "Deleted successfully"})

# ===========================
# UPDATE LISTING (ONLY OWNER)
# ===========================
@api_view(["PUT"])
@permission_classes([IsAuthenticated])
def update_listing(request, pk):
    try:
        obj = Listing.objects.get(pk=pk)
    except Listing.DoesNotExist:
        return Response({"error": "Not found"}, status=404)

    if obj.seller != request.user.username:
        return Response({"error": "Not allowed"}, status=403)

    data = request.data.copy()
    data["seller"] = request.user.username  # force seller

    serializer = ListingSerializer(obj, data=data, partial=True, context={"request": request})

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)

    return Response(serializer.errors, status=400)
