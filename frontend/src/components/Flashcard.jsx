import { useState } from 'react'

export default function Flashcard({ front, back }) {
  const [isFlipped, setIsFlipped] = useState(false)

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
          className="absolute w-full h-full card p-6 flex items-start justify-center text-center overflow-y-auto"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(0deg)',
          }}
        >
          <p className="font-medium text-gray-900 w-full">{front}</p>
        </div>
        
        <div
          className="absolute w-full h-full card p-6 flex items-start justify-center text-center bg-gray-50 overflow-y-auto"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
          <p className="text-gray-700 w-full">{back}</p>
        </div>
      </div>
    </div>
  )
}

