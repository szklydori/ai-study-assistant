import { useState } from 'react'

export default function ProfilePage() {
  const [user, setUser] = useState({
    name: 'John Doe',
    email: 'john@example.com',
    joinedDate: 'January 2024'
  })
  const [editing, setEditing] = useState(false)

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

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            {editing ? (
              <input
                type="text"
                value={user.name}
                onChange={(e) => setUser({ ...user, name: e.target.value })}
                className="input-field"
              />
            ) : (
              <p className="text-gray-900">{user.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            {editing ? (
              <input
                type="email"
                value={user.email}
                onChange={(e) => setUser({ ...user, email: e.target.value })}
                className="input-field"
              />
            ) : (
              <p className="text-gray-900">{user.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Member Since
            </label>
            <p className="text-gray-600">{user.joinedDate}</p>
          </div>

          {editing && (
            <button className="btn-primary">
              Save Changes
            </button>
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
          <button className="btn-secondary w-full text-left">
            Change Password
          </button>
          <button className="btn-secondary w-full text-left">
            Notification Preferences
          </button>
          <button className="btn-secondary w-full text-left text-red-600 hover:bg-red-50">
            Delete Account
          </button>
        </div>
      </div>
    </div>
  )
}

