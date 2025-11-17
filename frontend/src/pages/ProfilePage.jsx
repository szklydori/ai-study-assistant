import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getProfile, updateProfile, logout, isAuthenticated } from '../api'

export default function ProfilePage() {
  const [user, setUser] = useState(null)
  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login')
      return
    }

    loadProfile()
  }, [navigate])

  const loadProfile = async () => {
    try {
      const userData = await getProfile()
      setUser(userData)
    } catch (err) {
      console.error('Failed to load profile:', err)
      if (err.response?.status === 401) {
        navigate('/login')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    setError('')

    try {
      const updatedUser = await updateProfile({
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
      })
      setUser(updatedUser)
      setEditing(false)
    } catch (err) {
      const errorData = err.response?.data
      if (typeof errorData === 'object') {
        const errorMessages = Object.values(errorData).flat().join(', ')
        setError(errorMessages || 'Failed to update profile')
      } else {
        setError(errorData || 'Failed to update profile')
      }
    } finally {
      setSaving(false)
    }
  }

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Profile</h1>

      <div className="card p-8 mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Account Information</h2>
          <button
            onClick={() => setEditing(!editing)}
            className="btn-secondary text-sm"
          >
            {editing ? 'Cancel' : 'Edit'}
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Username
            </label>
            <p className="text-gray-900">{user.username}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              First Name
            </label>
            {editing ? (
              <input
                type="text"
                value={user.first_name || ''}
                onChange={(e) => setUser({ ...user, first_name: e.target.value })}
                className="input-field"
              />
            ) : (
              <p className="text-gray-900">{user.first_name || 'Not set'}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Last Name
            </label>
            {editing ? (
              <input
                type="text"
                value={user.last_name || ''}
                onChange={(e) => setUser({ ...user, last_name: e.target.value })}
                className="input-field"
              />
            ) : (
              <p className="text-gray-900">{user.last_name || 'Not set'}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            {editing ? (
              <input
                type="email"
                value={user.email || ''}
                onChange={(e) => setUser({ ...user, email: e.target.value })}
                className="input-field"
              />
            ) : (
              <p className="text-gray-900">{user.email || 'Not set'}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Member Since
            </label>
            <p className="text-gray-600">
              {user.date_joined ? new Date(user.date_joined).toLocaleDateString() : 'N/A'}
            </p>
          </div>

          {editing && (
            <div className="flex gap-4">
              <button
                onClick={handleSave}
                disabled={saving}
                className="btn-primary disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                onClick={() => {
                  setEditing(false)
                  loadProfile()
                }}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="card p-8 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Statistics</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <p className="text-3xl font-bold text-gray-900 mb-2">0</p>
            <p className="text-gray-600">Total Notes</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-gray-900 mb-2">0</p>
            <p className="text-gray-600">Quizzes Completed</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-gray-900 mb-2">0</p>
            <p className="text-gray-600">Flashcards Reviewed</p>
          </div>
        </div>
      </div>

      <div className="card p-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Settings</h2>
        <div className="space-y-4">
          <button
            onClick={handleLogout}
            className="btn-secondary w-full text-left text-red-600 hover:bg-red-50"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  )
}

