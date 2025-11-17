import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    // TODO: Implement forgot password logic
    setTimeout(() => {
      setLoading(false)
      setSubmitted(true)
      // alert('Password reset functionality will be implemented with backend authentication')
    }, 1000)
  }

  if (submitted) {
    return (
      <div className="flex items-center justify-center bg-gray-50 px-4 py-12 min-h-[calc(100vh-8rem)]">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Check Your Email</h1>
            <p className="text-gray-600">
              We've sent a password reset link to <span className="font-medium text-gray-900">{email}</span>
            </p>
          </div>

          <div className="card p-8">
            <p className="text-gray-600 text-center mb-6">
              Please check your email inbox and click on the reset link to create a new password. 
              The link will expire in 1 hour.
            </p>
            <div className="space-y-4">
              <button
                onClick={() => {
                  setSubmitted(false)
                  setEmail('')
                }}
                className="btn-secondary w-full"
              >
                Send Another Email
              </button>
              <Link to="/login" className="btn-primary w-full block text-center">
                Back to Sign In
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

