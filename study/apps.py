from django.apps import AppConfig


class StudyConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'study'

    def ready(self):
        # Load .env if present
        try:
            from dotenv import load_dotenv
            load_dotenv()
        except Exception:
            pass