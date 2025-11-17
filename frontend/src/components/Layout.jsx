import { Link, Outlet } from 'react-router-dom'

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <nav className="border-b border-gray-200 bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="text-xl font-bold text-gray-900">
              AI Study Assistant
            </Link>
            <div className="flex items-center gap-6">
              <Link
                to="/notes"
                className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
              >
                Notes
              </Link>
              <Link
                to="/notes/create"
                className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
              >
                Create
              </Link>
              <Link
                to="/profile"
                className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
              >
                Profile
              </Link>
              <Link
                to="/login"
                className="btn-secondary text-sm"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </nav>
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t border-gray-200 bg-white mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
          <p className="text-center text-gray-600 text-xs">
            © 2024 AI Study Assistant. Transform your learning experience.
          </p>
        </div>
      </footer>
    </div>
  )
}

