import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import { getNote, summarize, generateQuiz, generateFlashcards, submitQuiz } from '../api'
import Flashcard from '../components/Flashcard'

export default function NoteDetailPage() {
  const { id } = useParams()
  const [note, setNote] = useState(null)
  const [loading, setLoading] = useState(true)
  const [answers, setAnswers] = useState({})
  const [quizResult, setQuizResult] = useState(null)
  const [submittedAnswers, setSubmittedAnswers] = useState({})
  const [processing, setProcessing] = useState({ summarize: false, quiz: false, flashcards: false })

  useEffect(() => {
    getNote(id)
      .then(setNote)
      .finally(() => setLoading(false))
  }, [id])

  if (loading || !note) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-center items-center h-64">
          <div className="w-8 h-8 border-2 border-gray-200 border-t-gray-900 rounded-full animate-spin"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link to="/notes" className="text-gray-600 hover:text-gray-900 mb-6 inline-block">
        ← Back to Notes
      </Link>

      <div className="card p-8 mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">{note.title}</h1>
        <div className="prose max-w-none">
          <div className="text-gray-700 whitespace-pre-wrap leading-relaxed bg-gray-50 p-6 rounded-lg">
            {note.original_text}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 mb-8">
        <button
          onClick={async () => {
            setProcessing(p => ({ ...p, summarize: true }))
            try {
              await summarize(id)
              setNote(await getNote(id))
            } finally {
              setProcessing(p => ({ ...p, summarize: false }))
            }
          }}
          disabled={processing.summarize}
          className="btn-secondary disabled:opacity-50"
        >
          {processing.summarize ? 'Processing...' : 'Generate Summary'}
        </button>
        <button
          onClick={async () => {
            setProcessing(p => ({ ...p, quiz: true }))
            try {
              await generateQuiz(id)
              setNote(await getNote(id))
            } finally {
              setProcessing(p => ({ ...p, quiz: false }))
            }
          }}
          disabled={processing.quiz}
          className="btn-secondary disabled:opacity-50"
        >
          {processing.quiz ? 'Processing...' : 'Generate Quiz'}
        </button>
        <button
          onClick={async () => {
            setProcessing(p => ({ ...p, flashcards: true }))
            try {
              await generateFlashcards(id)
              setNote(await getNote(id))
            } finally {
              setProcessing(p => ({ ...p, flashcards: false }))
            }
          }}
          disabled={processing.flashcards}
          className="btn-secondary disabled:opacity-50"
        >
          {processing.flashcards ? 'Processing...' : 'Generate Flashcards'}
        </button>
      </div>

      {note.summary?.content && (
        <div className="card p-8 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Summary</h2>
          <div className="prose prose-gray max-w-none bg-gray-50 p-6 rounded-lg">
            <ReactMarkdown
              components={{
                h1: (props) => <h1 className="text-2xl font-bold text-gray-900 mb-4 mt-6 first:mt-0" {...props} />,
                h2: (props) => <h2 className="text-xl font-semibold text-gray-900 mb-3 mt-5 first:mt-0" {...props} />,
                h3: (props) => <h3 className="text-lg font-semibold text-gray-900 mb-2 mt-4 first:mt-0" {...props} />,
                p: (props) => <p className="text-gray-700 mb-4 leading-relaxed" {...props} />,
                ul: (props) => <ul className="list-none text-gray-700 mb-4 space-y-2" {...props} />,
                ol: (props) => <ol className="list-none text-gray-700 mb-4 space-y-2" {...props} />,
                li: (props) => <li className="text-gray-700" {...props} />,
                strong: (props) => <strong className="font-semibold text-gray-900" {...props} />,
                em: (props) => <em className="italic text-gray-800" {...props} />,
              }}
            >
              {note.summary.content}
            </ReactMarkdown>
          </div>
        </div>
      )}

      {note.quiz_questions?.length > 0 && (
        <div className="card p-8 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Quiz</h2>
          <div className="space-y-6">
            {note.quiz_questions.map(q => {
              const userAnswer = submittedAnswers[q.id]
              const correctAnswer = q.correct_option
              const isAnswered = !!quizResult
              
              return (
                <div key={q.id} className="border-b border-gray-200 pb-6 last:border-0 last:pb-0">
                  <div className="font-medium text-gray-900 mb-4">{q.question}</div>
                  <div className="space-y-2">
                    {['A', 'B', 'C', 'D'].map(k => {
                      const isSelected = userAnswer === k
                      const isCorrect = k === correctAnswer
                      const isWrong = isSelected && !isCorrect
                      const showCorrect = isAnswered && isCorrect
                      const showWrong = isAnswered && isWrong
                      
                      let bgColor = 'hover:bg-gray-50'
                      let borderColor = ''
                      if (showCorrect) {
                        bgColor = 'bg-green-50 border-green-300'
                        borderColor = 'border-2'
                      } else if (showWrong) {
                        bgColor = 'bg-red-50 border-red-300'
                        borderColor = 'border-2'
                      }
                      
                      return (
                        <label 
                          key={k} 
                          className={`flex items-center gap-3 p-3 rounded-lg ${isAnswered ? 'cursor-default' : 'cursor-pointer'} ${bgColor} ${borderColor}`}
                        >
                          <input
                            type="radio"
                            name={`q_${q.id}`}
                            value={k}
                            checked={answers[q.id] === k}
                            onChange={() => {
                              if (!isAnswered) {
                                setAnswers(a => ({ ...a, [q.id]: k }))
                              }
                            }}
                            disabled={isAnswered}
                            className="w-4 h-4 text-gray-900 focus:ring-gray-900 disabled:opacity-50"
                          />
                          <span className={`text-gray-700 ${showCorrect ? 'font-semibold text-green-800' : ''} ${showWrong ? 'font-semibold text-red-800' : ''}`}>
                            {k}) {q[`option_${k.toLowerCase()}`] || `Answer option ${k}`}
                            {showCorrect && ' ✓'}
                            {showWrong && ' ✗'}
                          </span>
                        </label>
                      )
                    })}
                  </div>
                </div>
              )
            })}
            {!quizResult && (
              <button
                onClick={async () => {
                  const result = await submitQuiz(id, answers)
                  setQuizResult(result)
                  setSubmittedAnswers(answers)
                  setAnswers({})
                }}
                className="btn-primary w-full"
              >
                Submit Quiz
              </button>
            )}
            {quizResult && (
              <div className="card p-6 bg-gray-50">
                <h3 className="font-semibold text-gray-900 mb-3">Quiz Results</h3>
                <p className="text-gray-700 mb-2">
                  Correct: {quizResult.correct}/{quizResult.total}
                </p>
                <p className="text-gray-700 mb-4">
                  Score: {Math.round((quizResult.correct / quizResult.total) * 100)}%
                </p>
                <button
                  onClick={() => {
                    setQuizResult(null)
                    setAnswers({})
                    setSubmittedAnswers({})
                  }}
                  className="btn-secondary"
                >
                  Try Again
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {note.flashcards?.length > 0 && (
        <div className="card p-8 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Flashcards</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {note.flashcards.map((c, idx) => (
              <Flashcard
                key={idx}
                front={c.front}
                back={c.back}
              />
            ))}
          </div>
        </div>
      )}

      {note.progress_entries?.length > 0 && (
        <div className="card p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Progress</h2>
          <div className="space-y-4">
            {note.progress_entries.map(p => (
              <div key={p.id} className="border-b border-gray-200 pb-4 last:border-0 last:pb-0">
                <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-700">
                  <div>
                    <span className="font-medium">Quiz:</span> {p.correct_quiz_answers}/{p.completed_quiz_questions}
                  </div>
                  <div>
                    <span className="font-medium">Flashcards:</span> {p.flashcards_reviewed}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

