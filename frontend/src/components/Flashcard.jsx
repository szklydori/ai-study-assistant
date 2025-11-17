import { useState } from 'react'

export default function Flashcard({ front, back, onReviewed }) {
  const [isFlipped, setIsFlipped] = useState(false)
  const [isReviewed, setIsReviewed] = useState(false)

  const handleReviewed = async () => {
    if (!isReviewed) {
      await onReviewed()
      setIsReviewed(true)
    }
  }

  return (
    <div className="w-72 h-48" style={{ perspective: '1000px' }}>
      <div
        className="relative w-full h-full cursor-pointer"
        onClick={() => setIsFlipped(!isFlipped)}
        style={{
          transformStyle: 'preserve-3d',
          transition: 'transform 0.6s',
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}
      >
        <div
          className="absolute w-full h-full card p-6 flex items-center justify-center text-center"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(0deg)',
          }}
        >
          <p className="font-medium text-gray-900">{front}</p>
        </div>
        
        <div
          className="absolute w-full h-full card p-6 flex flex-col items-center justify-center text-center bg-gray-50"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
          <p className="text-gray-700 mb-4">{back}</p>
          {!isReviewed ? (
            <button
              onClick={(e) => {
                e.stopPropagation()
                handleReviewed()
              }}
              className="btn-secondary text-sm"
            >
              Mark Reviewed
            </button>
          ) : (
            <span className="text-sm text-green-600 font-medium">Reviewed</span>
          )}
        </div>
      </div>
    </div>
  )
}

