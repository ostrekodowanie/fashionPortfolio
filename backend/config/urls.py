"""config URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from . import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', views.index),
    path('clothing', views.index),
    path('clothing/women', views.index),
    path('clothing/men', views.index),
    path('clothing/collection', views.index),
    path('clothing/trending', views.index),
    path('clothing/new', views.index),
    path('contact', views.index),
    path('signup', views.index),
    path('login', views.index),
    path('login/recovery', views.index),
    path('login/recovery/complete', views.index),
    path('cart', views.index),
    path('cart/shipping', views.index),
    path('cart/payment', views.index),
    path('profile', views.index),
    path('', include('apps.Clothing.urls')),
    path('', include('apps.Auth.urls')),
    path('', include('apps.Orders.urls')),
    path('', include('apps.Favourites.urls')),
]

