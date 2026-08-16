from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views, api_views

router = DefaultRouter()
router.register(r"categories", api_views.CategoryViewSet, basename="category")
router.register(r"products", api_views.ProductViewSet, basename="product")
router.register(r"site-settings", api_views.SiteSettingsViewSet, basename="sitesettings")

urlpatterns = [
    path('health/', views.health, name='health'),
    path('', include(router.urls)),
]
