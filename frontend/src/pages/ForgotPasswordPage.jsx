import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { requestPasswordReset, confirmPasswordReset } from '../api'

export default function ForgotPasswordPage() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [password2, setPassword2] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')

    try {
      if (token) {
        // Password reset confirmation
        if (password !== password2) {
          setError('Passwords do not match')
          setLoading(false)
          return
        }
        await confirmPasswordReset(token, { new_password: password, new_password2: password2 })
        setMessage('Password has been reset successfully! You can now sign in.')
      } else {
        // Password reset request
        await requestPasswordReset({ email })
        setSubmitted(true)
      }
    } catch (err) {
      const errorData = err.response?.data
      if (typeof errorData === 'object') {
        const errorMessages = Object.values(errorData).flat().join(', ')
        setError(errorMessages || 'Request failed. Please try again.')
      } else {
        setError(errorData?.error || errorData || 'Request failed. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  if (submitted || message) {
    return (
      <div className="flex items-center justify-center bg-gray-50 px-4 py-12 min-h-[calc(100vh-8rem)]">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {message ? 'Password Reset Successful' : 'Check Your Email'}
            </h1>
            <p className="text-gray-600">
              {message || (
                <>
                  We've sent a password reset link to <span className="font-medium text-gray-900">{email}</span>
                </>
              )}
            </p>
          </div>

          <div className="card p-8">
            {!message && (
              <p className="text-gray-600 text-center mb-6">
                Please check your email inbox and click on the reset link to create a new password. 
                The link will expire in 1 hour.
              </p>
            )}
            <div className="space-y-4">
              {!message && (
                <button
                  onClick={() => {
                    setSubmitted(false)
                    setEmail('')
                  }}
                  className="btn-secondary w-full"
                >
                  Send Another Email
                </button>
              )}
              <Link to="/login" className="btn-primary w-full block text-center">
                Back to Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (token) {
    return (
      <div className="flex items-center justify-center bg-gray-50 px-4 py-12 min-h-[calc(100vh-8rem)]">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Reset Password</h1>
            <p className="text-gray-600">Enter your new password</p>
          </div>

          <div className="card p-8">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  className="input-field"
                  placeholder="Enter new password"
                />
              </div>

              <div>
                <label htmlFor="password2" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm New Password
                </label>
                <input
                  id="password2"
                  type="password"
                  value={password2}
                  onChange={(e) => setPassword2(e.target.value)}
                  required
                  minLength={8}
                  className="input-field"
                  placeholder="Confirm new password"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full disabled:opacity-50"
              >
                {loading ? 'Resetting...' : 'Reset Password'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <Link to="/login" className="text-sm text-gray-600 hover:text-gray-900 font-medium">
                ← Back to Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center bg-gray-50 px-4 py-12 min-h-[calc(100vh-8rem)]">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Forgot Password</h1>
          <p className="text-gray-600">Enter your email address and we'll send you a link to reset your password</p>
        </div>

        <div className="card p-8">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="input-field"
                placeholder="you@example.com"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full disabled:opacity-50"
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>

          <div className="mt-6 text-center space-y-2">
            <Link to="/login" className="text-sm text-gray-600 hover:text-gray-900 font-medium block">
              ← Back to Sign In
            </Link>
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link to="/register" className="font-medium text-gray-900 hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

