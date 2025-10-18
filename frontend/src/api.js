import axios from 'axios'

export const api = axios.create({
  baseURL: 'http://localhost:8000/api/',
  withCredentials: false,
  headers: { 'Content-Type': 'application/json' },
  validateStatus: s => s >= 200 && s < 300,
  timeout: 15000,
})

export async function listNotes() {
  const { data } = await api.get('notes/')
  return data
}

export async function createNote(payload) {
  const { data } = await api.post('notes/', payload)
  return data
}

export async function getNote(id) {
  const { data } = await api.get(`notes/${id}/`)
  return data
}

export async function summarize(id) {
  const { data } = await api.post(`notes/${id}/summarize/`)
  return data
}

export async function generateQuiz(id) {
  const { data } = await api.post(`notes/${id}/generate-quiz/`)
  return data
}

export async function generateFlashcards(id) {
  const { data } = await api.post(`notes/${id}/generate-flashcards/`)
  return data
}

export async function submitQuiz(id, answers) {
  const { data } = await api.post(`notes/${id}/submit-quiz/`, { answers })
  return data
}

export async function flashcardReviewed(id) {
  const { data } = await api.post(`notes/${id}/flashcard-reviewed/`)
  return data
}

