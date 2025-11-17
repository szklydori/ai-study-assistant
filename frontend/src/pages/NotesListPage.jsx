import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { listNotes } from '../api'

export default function NotesListPage() {
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    listNotes()
      .then(setNotes)
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-center items-center h-64">
          <div className="w-8 h-8 border-2 border-gray-200 border-t-gray-900 rounded-full animate-spin"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Notes</h1>
          <p className="text-gray-600">Manage and review all your study materials</p>
        </div>
        <Link to="/notes/create" className="btn-primary">
          Create Note
        </Link>
      </div>

      {notes.length === 0 ? (
        <div className="card p-12 text-center">
          <p className="text-gray-600 mb-6">You haven't created any notes yet.</p>
          <Link to="/notes/create" className="btn-primary inline-block">
            Create Your First Note
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {notes.map(note => (
            <Link
              key={note.id}
              to={`/notes/${note.id}`}
              className="card p-6 hover:shadow-md transition-shadow"
            >
              <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                {note.title}
              </h3>
              <p className="text-sm text-gray-600 line-clamp-3 mb-4">
                {note.original_text?.substring(0, 150)}...
              </p>
              <span className="text-sm text-gray-500">View details →</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

