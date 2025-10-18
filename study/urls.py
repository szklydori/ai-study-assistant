from rest_framework.routers import DefaultRouter
from .views import NoteViewSet, ProgressViewSet

router = DefaultRouter()
router.register(r'notes', NoteViewSet, basename='note')
router.register(r'progress', ProgressViewSet, basename='progress')

urlpatterns = router.urls
