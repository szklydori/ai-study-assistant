from django.urls import path
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView
from .views import NoteViewSet, ProgressViewSet
from .auth_views import (
    register,
    login,
    logout,
    profile,
    update_profile,
    change_password,
    password_reset_request,
    password_reset_confirm,
)

router = DefaultRouter()
router.register(r'notes', NoteViewSet, basename='note')
router.register(r'progress', ProgressViewSet, basename='progress')

urlpatterns = [
    # Authentication endpoints
    path('auth/register/', register, name='register'),
    path('auth/login/', login, name='login'),
    path('auth/logout/', logout, name='logout'),
    path('auth/profile/', profile, name='profile'),
    path('auth/profile/update/', update_profile, name='update_profile'),
    path('auth/change-password/', change_password, name='change_password'),
    path('auth/password-reset/', password_reset_request, name='password_reset_request'),
    path('auth/password-reset/confirm/', password_reset_confirm, name='password_reset_confirm'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
] + router.urls
