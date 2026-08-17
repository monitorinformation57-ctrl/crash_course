from django.conf import settings
from django.conf.urls.static import static
from django.http import JsonResponse
from django.urls import include, path
from django.views.static import serve


def root_status(_request):
    return JsonResponse(
        {
            "status": "ok",
            "message": "Crashcourse backend is running.",
            "api_base": "/api/",
        }
    )

urlpatterns = [
    path("", root_status, name="root_status"),
    path("api/", include("base.urls")),
    path("images/<path:path>", serve, {"document_root": settings.MEDIA_ROOT}, name="media_files"),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
