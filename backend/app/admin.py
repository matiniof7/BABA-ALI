from django.contrib import admin
from .models import Category, Product, SiteSettings


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ("name", "slug", "is_active", "display_order")
    prepopulated_fields = {"slug": ("name",)}
    list_filter = ("is_active",)
    search_fields = ("name",)


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ("name", "slug", "category", "price", "is_available", "is_active", "is_featured")
    prepopulated_fields = {"slug": ("name",)}
    list_filter = ("is_active", "is_featured", "is_available", "category")
    search_fields = ("name", "description")


@admin.register(SiteSettings)
class SiteSettingsAdmin(admin.ModelAdmin):
    list_display = ("store_name", "updated_at")
