import os
from django.shortcuts import get_object_or_404
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.response import Response

from .models import Note, Summary, QuizQuestion, Flashcard, StudyProgress
from .serializers import (
    NoteSerializer,
    NoteCreateSerializer,
    SummarySerializer,
    QuizQuestionSerializer,
    FlashcardSerializer,
    StudyProgressSerializer,
)
from .utils import coalesce_note_text
from .ai import summarize_text, generate_quiz, generate_flashcards


class NoteViewSet(viewsets.ModelViewSet):
    queryset = Note.objects.all().order_by("-created_at")
    parser_classes = (MultiPartParser, FormParser, JSONParser)

    def get_serializer_class(self):
        if self.action in {"create", "update", "partial_update"}:
            return NoteCreateSerializer
        return NoteSerializer

    @action(detail=True, methods=["post"], url_path="summarize")
    def summarize(self, request, pk=None):
        note = self.get_object()
        text = coalesce_note_text(note.original_text, note.uploaded_file.path if note.uploaded_file else None)
        try:
            summary_content = summarize_text(text)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        Summary.objects.update_or_create(
            note=note,
            defaults={"content": summary_content, "model_name": os.getenv("OPENAI_MODEL", "gpt-4o-mini")},
        )
        return Response(SummarySerializer(note.summary).data)

    @action(detail=True, methods=["post"], url_path="generate-quiz")
    def generate_quiz_action(self, request, pk=None):
        note = self.get_object()
        text = coalesce_note_text(note.original_text, note.uploaded_file.path if note.uploaded_file else None)
        try:
            items = generate_quiz(text)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        note.quiz_questions.all().delete()
        created = []
        for q, options, correct, explanation in items:
            qq = QuizQuestion.objects.create(
                note=note,
                question=q,
                option_a=options[0] if len(options) > 0 else "",
                option_b=options[1] if len(options) > 1 else "",
                option_c=options[2] if len(options) > 2 else "",
                option_d=options[3] if len(options) > 3 else "",
                correct_option=correct,
                explanation=explanation,
            )
            created.append(qq)
        return Response(QuizQuestionSerializer(created, many=True).data)

    @action(detail=True, methods=["post"], url_path="generate-flashcards")
    def generate_flashcards_action(self, request, pk=None):
        note = self.get_object()
        text = coalesce_note_text(note.original_text, note.uploaded_file.path if note.uploaded_file else None)
        try:
            cards = generate_flashcards(text)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        note.flashcards.all().delete()
        created = []
        for front, back in cards:
            created.append(Flashcard.objects.create(note=note, front=front, back=back))
        return Response(FlashcardSerializer(created, many=True).data)

    @action(detail=True, methods=["post"], url_path="submit-quiz")
    def submit_quiz(self, request, pk=None):
        note = self.get_object()
        submitted = request.data.get("answers", {})  # {question_id: "A"}
        if not isinstance(submitted, dict):
            return Response({"error": "answers must be an object {id: option}"}, status=400)

        total = 0
        correct = 0
        for qq in note.quiz_questions.all():
            total += 1
            if str(qq.id) in submitted and str(submitted[str(qq.id)]).upper()[:1] == qq.correct_option:
                correct += 1

        progress, _ = StudyProgress.objects.get_or_create(note=note)
        progress.completed_quiz_questions += total
        progress.correct_quiz_answers += correct
        progress.save()

        return Response({
            "total": total,
            "correct": correct,
            "accuracy": (correct / total) if total else 0.0,
            "progress": StudyProgressSerializer(progress).data,
        })

    @action(detail=True, methods=["post"], url_path="flashcard-reviewed")
    def flashcard_reviewed(self, request, pk=None):
        note = self.get_object()
        progress, _ = StudyProgress.objects.get_or_create(note=note)
        progress.flashcards_reviewed += 1
        progress.save()
        return Response(StudyProgressSerializer(progress).data)


class ProgressViewSet(viewsets.ModelViewSet):
    queryset = StudyProgress.objects.all().order_by("-last_interaction_at")
    serializer_class = StudyProgressSerializer


# Create your views here.
