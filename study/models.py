from django.db import models
from django.utils import timezone
from django.contrib.auth.models import User


class Note(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notes', null=True, blank=True)
    title = models.CharField(max_length=255)
    original_text = models.TextField(blank=True)
    uploaded_file = models.FileField(upload_to="notes/", blank=True, null=True)
    created_at = models.DateTimeField(default=timezone.now, editable=False)

    def __str__(self) -> str:
        return self.title


class Summary(models.Model):
    note = models.OneToOneField(Note, related_name="summary", on_delete=models.CASCADE)
    content = models.TextField()
    model_name = models.CharField(max_length=128, blank=True)
    created_at = models.DateTimeField(default=timezone.now, editable=False)

    def __str__(self) -> str:
        return f"Summary for {self.note.title}"


class QuizQuestion(models.Model):
    note = models.ForeignKey(Note, related_name="quiz_questions", on_delete=models.CASCADE)
    question = models.TextField()
    option_a = models.CharField(max_length=500, blank=True)
    option_b = models.CharField(max_length=500, blank=True)
    option_c = models.CharField(max_length=500, blank=True)
    option_d = models.CharField(max_length=500, blank=True)
    correct_option = models.CharField(max_length=1, choices=[("A", "A"), ("B", "B"), ("C", "C"), ("D", "D")])
    explanation = models.TextField(blank=True)
    created_at = models.DateTimeField(default=timezone.now, editable=False)

    def __str__(self) -> str:
        return f"{self.question[:50]}..."


class Flashcard(models.Model):
    note = models.ForeignKey(Note, related_name="flashcards", on_delete=models.CASCADE)
    front = models.TextField()
    back = models.TextField()
    created_at = models.DateTimeField(default=timezone.now, editable=False)

    def __str__(self) -> str:
        return f"Flashcard for {self.note.title}"


class StudyProgress(models.Model):
    note = models.ForeignKey(Note, related_name="progress_entries", on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='study_progress', null=True, blank=True)
    completed_quiz_questions = models.PositiveIntegerField(default=0)
    correct_quiz_answers = models.PositiveIntegerField(default=0)
    flashcards_reviewed = models.PositiveIntegerField(default=0)
    last_interaction_at = models.DateTimeField(default=timezone.now)

    def __str__(self) -> str:
        return f"Progress for {self.note.title}"
