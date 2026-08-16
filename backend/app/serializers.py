from rest_framework import serializers
from .models import Category, Product, SiteSettings


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["id", "name", "slug", "is_active", "display_order", "icon"]


class ProductSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source="category.name", read_only=True)
    category_slug = serializers.CharField(source="category.slug", read_only=True)

    class Meta:
        model = Product
        fields = [
            "id",
            "name",
            "slug",
            "category",
            "category_name",
            "category_slug",
            "description",
            "image",
            "price",
            "unit",
            "weight_or_volume",
            "is_available",
            "is_active",
            "is_featured",
            "display_order",
            "created_at",
            "updated_at",
        ]


class SiteSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = SiteSettings
        fields = "__all__"
