from django.urls import path
from . import views


urlpatterns = [
    path('api/favourites', views.FavouriteView.as_view()),
    path('api/favourites/remove', views.RemoveFavouriteView.as_view()),
]
