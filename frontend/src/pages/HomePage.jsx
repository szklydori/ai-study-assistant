import { Link } from 'react-router-dom'

export default function HomePage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      {/* Hero Section */}
      <div className="text-center mb-20">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          AI Study Assistant
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10">
          Transform your study materials into interactive learning experiences with the power of artificial intelligence
        </p>
        <div className="flex gap-4 justify-center">
          <Link to="/register" className="btn-primary">
            Get Started
          </Link>
          <Link to="/notes" className="btn-secondary">
            View Notes
          </Link>
        </div>
      </div>

      {/* Introduction Section */}
      <div className="mb-20">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          About This Project
        </h2>
        <div className="prose prose-lg max-w-none">
          <div className="card p-8 mb-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Intelligent Note Management
            </h3>
            <p className="text-gray-600 leading-relaxed">
              AI Study Assistant is a modern web application designed to revolutionize how you study and learn. 
              Built with React and Django, it leverages OpenAI's powerful language models to help you understand, 
              summarize, and master your study materials more effectively.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-6">
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                AI Summarization
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Automatically generate concise summaries of your notes, helping you quickly grasp key concepts 
                and main ideas without reading through entire documents.
              </p>
            </div>

            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Quiz Generation
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Create interactive multiple-choice quizzes from your study materials to test your understanding 
                and reinforce your learning through active recall.
              </p>
            </div>

            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Flashcard System
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Generate digital flashcards automatically from your notes, making it easy to review and memorize 
                important information using proven spaced repetition techniques.
              </p>
            </div>
          </div>

          <div className="card p-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              How It Works
            </h3>
            <ol className="list-decimal list-inside space-y-3 text-gray-600">
              <li>Create an account and sign in to access your personal study space</li>
              <li>Add your study materials by creating new notes with titles and content</li>
              <li>Use AI-powered features to generate summaries, quizzes, and flashcards</li>
              <li>Track your progress as you complete quizzes and review flashcards</li>
              <li>Review your learning history and improve your study habits over time</li>
            </ol>
          </div>

          <div className="card p-8 mt-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Technology Stack
            </h3>
            <div className="grid md:grid-cols-2 gap-4 text-gray-600">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Frontend</h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>React 19 with modern hooks and components</li>
                  <li>Vite for fast development and optimized builds</li>
                  <li>Tailwind CSS for responsive, utility-first styling</li>
                  <li>React Router for seamless navigation</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Backend</h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Django REST Framework for robust API endpoints</li>
                  <li>OpenAI API integration for AI-powered features</li>
                  <li>SQLite database for reliable data storage</li>
                  <li>CORS support for seamless frontend-backend communication</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="text-center">
        <div className="card p-12 bg-gray-50">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Ready to Transform Your Learning?
          </h2>
          <p className="text-gray-600 mb-8">
            Join thousands of students who are already using AI Study Assistant to improve their study habits
          </p>
          <Link to="/register" className="btn-primary inline-block">
            Create Free Account
          </Link>
        </div>
      </div>
    </div>
  )
}

