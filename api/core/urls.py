from django.contrib import admin
from django.urls import include, path
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView
from rest_framework_simplejwt.views import TokenBlacklistView, TokenObtainPairView, TokenRefreshView

from core.throttles import AuthRateThrottle


class ThrottledTokenObtainPairView(TokenObtainPairView):
    throttle_classes = [AuthRateThrottle]


class ThrottledTokenRefreshView(TokenRefreshView):
    throttle_classes = [AuthRateThrottle]


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('notes.urls')),
    path('api/auth/', include('users.urls')),
    path('api/auth/token/', ThrottledTokenObtainPairView.as_view(), name='token-obtain-pair'),
    path('api/auth/token/refresh/', ThrottledTokenRefreshView.as_view(), name='token-refresh'),
    path('api/auth/token/revoke/', TokenBlacklistView.as_view(), name='token-blacklist'),
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/schema/swagger-ui/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
]
