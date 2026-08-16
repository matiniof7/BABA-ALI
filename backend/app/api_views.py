from rest_framework import viewsets, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Category, Product, SiteSettings
from .serializers import CategorySerializer, ProductSerializer, SiteSettingsSerializer


class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.filter(is_active=True).order_by("display_order", "name")
    serializer_class = CategorySerializer


class ProductViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Product.objects.filter(is_active=True).select_related("category").order_by("display_order", "name")
    serializer_class = ProductSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ["name", "description"]

    def get_queryset(self):
        qs = super().get_queryset()
        category = self.request.query_params.get("category")
        category_id = self.request.query_params.get("category_id")
        if category:
            qs = qs.filter(category__slug=category)
        if category_id:
            qs = qs.filter(category__id=category_id)
        return qs


class SiteSettingsViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = SiteSettings.objects.all()
    serializer_class = SiteSettingsSerializer

    def list(self, request, *args, **kwargs):
        obj = SiteSettings.objects.first()
        serializer = self.get_serializer(obj)
        return Response(serializer.data)
