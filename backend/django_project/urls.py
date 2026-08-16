from django.contrib import admin
from django.urls import path, include
from django.views.generic import TemplateView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('app.urls')),
    # Serve index.html from exported frontend for root
    path('', TemplateView.as_view(template_name='index.html')),
]
