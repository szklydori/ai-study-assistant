<<<<<<< HEAD
# AI Study Assistant

A modern, AI-powered study application built with React and Django.

## Features

- 📝 **Note Creation**: Create and manage study notes
- 🤖 **AI Summarization**: Automatically summarize your notes using OpenAI
- 🧠 **Quiz Generation**: Generate multiple choice quizzes from your notes
- 🃏 **Flashcards**: Create interactive flashcards for memorization
- 📊 **Progress Tracking**: Track your learning progress
- 🌍 **Multi-language Support**: Automatically detects and responds in English or Hungarian

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

## Setup Instructions

### Prerequisites
- Python 3.11+
- Node.js 18+
- OpenAI API Key

### Backend Setup
1. Install Python dependencies:
```bash
pip install django djangorestframework django-cors-headers python-dotenv openai PyPDF2
```

2. Create environment file:
```bash
# Create .env file in project root
OPENAI_MODEL=gpt-4o-mini
OPENAI_API_KEY=your-openai-api-key-here
```

3. Run migrations:
```bash
python manage.py migrate
```

4. Start Django server:
```bash
python manage.py runserver
```

### Frontend Setup
1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm run dev
```

## Usage

1. Open your browser and go to `http://localhost:5173`
2. Create a new note with your study material
3. Use AI features to:
   - Summarize your notes
   - Generate quizzes
   - Create flashcards
4. Track your learning progress

## API Endpoints

- `GET /api/notes/` - List all notes
- `POST /api/notes/` - Create a new note
- `GET /api/notes/{id}/` - Get specific note
- `POST /api/notes/{id}/summarize/` - Generate summary
- `POST /api/notes/{id}/generate-quiz/` - Generate quiz
- `POST /api/notes/{id}/generate-flashcards/` - Generate flashcards
- `POST /api/notes/{id}/submit-quiz/` - Submit quiz answers
- `POST /api/notes/{id}/flashcard-reviewed/` - Mark flashcard as reviewed



