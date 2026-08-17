from django.http import JsonResponse
from django.urls import include, path


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
]