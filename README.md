# AI Study Assistant

A modern, AI-powered study application built with React and Django.

## Features

- **Note Creation**: Create and manage study notes
- **AI Summarization**: Automatically summarize your notes using OpenAI
- **Quiz Generation**: Generate multiple choice quizzes from your notes
- **Flashcards**: Create interactive flashcards for memorization
- **Progress Tracking**: Track your learning progress
- **Multi-language Support**: Automatically detects and responds in English or Hungarian

## Tech Stack

### Frontend
- React 19.1.1
- Vite
- Tailwind CSS
- DaisyUI

### Backend
- Django 5.2.1
- Django REST Framework
- SQLite Database
- OpenAI API Integration

## API Endpoints

- `GET /api/notes/` - List all notes
- `POST /api/notes/` - Create a new note
- `GET /api/notes/{id}/` - Get specific note
- `POST /api/notes/{id}/summarize/` - Generate summary
- `POST /api/notes/{id}/generate-quiz/` - Generate quiz
- `POST /api/notes/{id}/generate-flashcards/` - Generate flashcards
- `POST /api/notes/{id}/submit-quiz/` - Submit quiz answers
- `POST /api/notes/{id}/flashcard-reviewed/` - Mark flashcard as reviewed

## Quick Start Summary

```bash
# Terminal 1 - Backend
cd C:\Users\doras\Desktop\IMC\portfolio\ai-study-assistant
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
copy env.example .env
# Edit .env and add your OpenAI API key
python manage.py migrate
python manage.py runserver

# Terminal 2 - Frontend
cd C:\Users\doras\Desktop\IMC\portfolio\ai-study-assistant\frontend
npm install
npm run dev

# Then open http://localhost:5173 in your browser
```

