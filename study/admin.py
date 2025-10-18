from django.contrib import admin
from .models import Note, Summary, QuizQuestion, Flashcard, StudyProgress


@admin.register(Note)
class NoteAdmin(admin.ModelAdmin):
    list_display = ("id", "title", "created_at")
    search_fields = ("title",)


@admin.register(Summary)
class SummaryAdmin(admin.ModelAdmin):
    list_display = ("id", "note", "model_name", "created_at")
    search_fields = ("note__title",)


@admin.register(QuizQuestion)
class QuizQuestionAdmin(admin.ModelAdmin):
    list_display = ("id", "note", "question", "correct_option", "created_at")
    search_fields = ("question", "note__title")


@admin.register(Flashcard)
class FlashcardAdmin(admin.ModelAdmin):
    list_display = ("id", "note", "created_at")
    search_fields = ("note__title",)


@admin.register(StudyProgress)
class StudyProgressAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "note",
        "completed_quiz_questions",
        "correct_quiz_answers",
        "flashcards_reviewed",
        "last_interaction_at",
    )
    search_fields = ("note__title",)

# Register your models here.
