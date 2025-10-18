from rest_framework import serializers
from .models import Note, Summary, QuizQuestion, Flashcard, StudyProgress


class SummarySerializer(serializers.ModelSerializer):
    class Meta:
        model = Summary
        fields = ["id", "content", "model_name", "created_at"]


class QuizQuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuizQuestion
        fields = [
            "id",
            "question",
            "option_a",
            "option_b",
            "option_c",
            "option_d",
            "correct_option",
            "explanation",
            "created_at",
        ]


class FlashcardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Flashcard
        fields = ["id", "front", "back", "created_at"]


class StudyProgressSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudyProgress
        fields = [
            "id",
            "completed_quiz_questions",
            "correct_quiz_answers",
            "flashcards_reviewed",
            "last_interaction_at",
        ]


class NoteSerializer(serializers.ModelSerializer):
    summary = SummarySerializer(read_only=True)
    quiz_questions = QuizQuestionSerializer(many=True, read_only=True)
    flashcards = FlashcardSerializer(many=True, read_only=True)
    progress_entries = StudyProgressSerializer(many=True, read_only=True)

    class Meta:
        model = Note
        fields = [
            "id",
            "title",
            "original_text",
            "uploaded_file",
            "created_at",
            "summary",
            "quiz_questions",
            "flashcards",
            "progress_entries",
        ]


class NoteCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Note
        fields = ["id", "title", "original_text", "uploaded_file", "created_at"]

