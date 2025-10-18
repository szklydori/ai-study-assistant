import { useEffect, useState } from 'react'
import './App.css'
// App.jsx edited - reload triggered
import { BrowserRouter, Routes, Route, Link, useNavigate, useParams } from 'react-router-dom'
import { listNotes, createNote, getNote, summarize, generateQuiz, generateFlashcards, submitQuiz, flashcardReviewed } from './api'

function Flashcard({ front, back, onReviewed }) {
  const [isFlipped, setIsFlipped] = useState(false)
  const [isReviewed, setIsReviewed] = useState(false)

  const handleFlip = () => {
    setIsFlipped(!isFlipped)
  }

  const handleReviewed = async () => {
    if (!isReviewed) {
      await onReviewed()
      setIsReviewed(true)
    }
  }

  return (
    <div style={{
      width: '300px',
      height: '200px',
      margin: '15px',
      display: 'inline-block',
      flex: '0 0 auto',
      boxSizing: 'border-box'
    }}>
      <div
        style={{
          width: '100%',
          height: '100%',
          position: 'relative',
          cursor: 'pointer',
          transition: 'all 0.3s ease'
        }}
        onClick={handleFlip}
      >
        {/* Front of card */}
        <div style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          backgroundColor: '#ffffff',
          border: '3px solid #e0e0e0',
          borderRadius: '15px',
          padding: '25px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
          background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
          opacity: isFlipped ? 0 : 1,
          transform: isFlipped ? 'scale(0.8)' : 'scale(1)',
          transition: 'all 0.3s ease',
          zIndex: isFlipped ? 1 : 2
        }}>
          <div style={{ 
            fontSize: '18px', 
            fontWeight: '600',
            color: '#2c3e50',
            lineHeight: '1.4',
            maxWidth: '100%',
            wordWrap: 'break-word'
          }}>
            {front}
          </div>
        </div>

        {/* Back of card */}
        <div style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          backgroundColor: '#ffffff',
          border: '3px solid #3498db',
          borderRadius: '15px',
          padding: '25px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          opacity: isFlipped ? 1 : 0,
          transform: isFlipped ? 'scale(1)' : 'scale(0.8)',
          transition: 'all 0.3s ease',
          zIndex: isFlipped ? 2 : 1
        }}>
          <div style={{ 
            fontSize: '16px', 
            marginBottom: '15px',
            color: '#ffffff',
            lineHeight: '1.4',
            maxWidth: '100%',
            wordWrap: 'break-word'
          }}>
            {back}
          </div>
          {!isReviewed && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                handleReviewed()
              }}
              style={{
                padding: '10px 20px',
                backgroundColor: '#27ae60',
                color: 'white',
                border: 'none',
                borderRadius: '25px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                boxShadow: '0 4px 15px rgba(39, 174, 96, 0.3)',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#229954'
                e.target.style.transform = 'translateY(-2px)'
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#27ae60'
                e.target.style.transform = 'translateY(0px)'
              }}
            >
              ✓ Reviewed
            </button>
          )}
          {isReviewed && (
            <div style={{ 
              color: '#2ecc71', 
              fontWeight: 'bold',
              fontSize: '16px',
              backgroundColor: 'rgba(255,255,255,0.2)',
              padding: '8px 16px',
              borderRadius: '20px'
            }}>
              ✓ Reviewed
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function NotesList() {
  const [items, setItems] = useState([])
  const [title, setTitle] = useState('')
  const [text, setText] = useState('')
  const nav = useNavigate()

  useEffect(() => {
    listNotes().then(setItems)
  }, [])

  async function onCreate(e) {
    e.preventDefault()
    try {
      const created = await createNote({ title, original_text: text })
      setTitle('')
      setText('')
      nav(`/notes/${created.id}`)
    } catch (err) {
      alert('Hiba jegyzet létrehozásakor: ' + (err?.response?.data ? JSON.stringify(err.response.data) : err.message))
    }
  }

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f8f9fa',
      minHeight: '100vh'
    }}>
      <div style={{
        backgroundColor: '#ffffff',
        padding: '40px',
        borderRadius: '15px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        marginBottom: '30px'
      }}>
        <h1 style={{
          color: '#2c3e50',
          marginBottom: '30px',
          fontSize: '32px',
          fontWeight: '700',
          textAlign: 'center'
        }}>🤖 AI Study Assistant</h1>
        
        <form onSubmit={onCreate} style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          maxWidth: '600px',
          margin: '0 auto'
        }}>
          <input 
            placeholder="Note title..." 
            value={title} 
            onChange={e=>setTitle(e.target.value)} 
            required 
            style={{
              padding: '15px',
              fontSize: '16px',
              border: '2px solid #e9ecef',
              borderRadius: '10px',
              outline: 'none',
              transition: 'border-color 0.3s ease'
            }}
            onFocus={(e) => e.target.style.borderColor = '#007bff'}
            onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
          />
          <textarea 
            placeholder="Note content..." 
            rows={6} 
            value={text} 
            onChange={e=>setText(e.target.value)} 
            style={{
              padding: '15px',
              fontSize: '16px',
              border: '2px solid #e9ecef',
              borderRadius: '10px',
              outline: 'none',
              resize: 'vertical',
              transition: 'border-color 0.3s ease'
            }}
            onFocus={(e) => e.target.style.borderColor = '#007bff'}
            onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
          />
          <button 
            type="submit"
            style={{
              padding: '15px 30px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '25px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: '600',
              boxShadow: '0 4px 15px rgba(0, 123, 255, 0.3)',
              transition: 'all 0.3s ease'
            }}
          >
            ➕ Create Note
          </button>
        </form>
      </div>

      <div style={{
        backgroundColor: '#ffffff',
        padding: '30px',
        borderRadius: '15px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{
          color: '#2c3e50',
          marginBottom: '20px',
          fontSize: '24px',
          fontWeight: '600'
        }}>📋 Notes List</h2>
        
        {items.length > 0 ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '20px'
          }}>
            {items.map(n => (
              <Link 
                key={n.id} 
                to={`/notes/${n.id}`}
                style={{
                  textDecoration: 'none',
                  color: 'inherit'
                }}
              >
                <div style={{
                  backgroundColor: '#f8f9fa',
                  padding: '20px',
                  borderRadius: '10px',
                  border: '2px solid #e9ecef',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.target.style.borderColor = '#007bff'
                  e.target.style.transform = 'translateY(-2px)'
                  e.target.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)'
                }}
                onMouseLeave={(e) => {
                  e.target.style.borderColor = '#e9ecef'
                  e.target.style.transform = 'translateY(0px)'
                  e.target.style.boxShadow = 'none'
                }}
                >
                  <h3 style={{
                    color: '#2c3e50',
                    marginBottom: '10px',
                    fontSize: '18px',
                    fontWeight: '600'
                  }}>
                    {n.title}
                  </h3>
                  <p style={{
                    color: '#6c757d',
                    fontSize: '14px',
                    lineHeight: '1.4',
                    margin: 0
                  }}>
                    {n.original_text?.substring(0, 100)}...
                  </p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div style={{
            textAlign: 'center',
            padding: '40px',
            color: '#6c757d',
            fontSize: '16px'
          }}>
            No notes yet. Create a new one!
          </div>
        )}
      </div>
    </div>
  )
}

function NoteDetail() {
  const { id } = useParams()
  const [note, setNote] = useState(null)
  const [answers, setAnswers] = useState({})
  const [quizResult, setQuizResult] = useState(null)

  useEffect(() => {
    getNote(id).then(setNote)
  }, [id])

  if (!note) return <div>Betöltés…</div>

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#ffffff',
      minHeight: '100vh'
    }}>
      <div style={{
        marginBottom: '30px',
        padding: '15px',
        backgroundColor: '#f8f9fa',
        borderRadius: '10px',
        border: '1px solid #e9ecef'
      }}>
        <Link to="/" style={{
          color: '#007bff',
          textDecoration: 'none',
          fontSize: '16px',
          fontWeight: '500'
        }}>
          ← Back to Notes
        </Link>
      </div>
      
      <div style={{
        backgroundColor: '#ffffff',
        padding: '30px',
        borderRadius: '15px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        marginBottom: '30px'
      }}>
        <h1 style={{
          color: '#2c3e50',
          marginBottom: '20px',
          fontSize: '28px',
          fontWeight: '700'
        }}>{note.title}</h1>
        
        <div style={{
          backgroundColor: '#f8f9fa',
          padding: '20px',
          borderRadius: '10px',
          border: '1px solid #e9ecef',
          whiteSpace: 'pre-wrap',
          lineHeight: '1.6',
          fontSize: '16px',
          color: '#495057'
        }}>
          {note.original_text}
        </div>
      </div>

      <div style={{
        display: 'flex',
        gap: '15px',
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginBottom: '40px'
      }}>
        <button 
          onClick={async()=>{ await summarize(id); setNote(await getNote(id)) }}
          style={{
            padding: '12px 24px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '25px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: '600',
            boxShadow: '0 4px 15px rgba(40, 167, 69, 0.3)',
            transition: 'all 0.3s ease'
          }}
        >
          📝 Summarize
        </button>
        <button 
          onClick={async()=>{ await generateQuiz(id); setNote(await getNote(id)) }}
          style={{
            padding: '12px 24px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '25px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: '600',
            boxShadow: '0 4px 15px rgba(0, 123, 255, 0.3)',
            transition: 'all 0.3s ease'
          }}
        >
          🧠 Generate Quiz
        </button>
        <button 
          onClick={async()=>{ await generateFlashcards(id); setNote(await getNote(id)) }}
          style={{
            padding: '12px 24px',
            backgroundColor: '#6f42c1',
            color: 'white',
            border: 'none',
            borderRadius: '25px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: '600',
            boxShadow: '0 4px 15px rgba(111, 66, 193, 0.3)',
            transition: 'all 0.3s ease'
          }}
        >
          🃏 Generate Flashcards
        </button>
      </div>

      <div style={{
        backgroundColor: '#ffffff',
        padding: '30px',
        borderRadius: '15px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        marginBottom: '30px'
      }}>
        <h2 style={{
          color: '#2c3e50',
          marginBottom: '20px',
          fontSize: '24px',
          fontWeight: '600',
          borderBottom: '3px solid #28a745',
          paddingBottom: '10px'
        }}>📝 Summary</h2>
        <div style={{
          backgroundColor: '#f8f9fa',
          padding: '20px',
          borderRadius: '10px',
          border: '1px solid #e9ecef',
          whiteSpace: 'pre-wrap',
          lineHeight: '1.6',
          fontSize: '16px',
          color: '#495057',
          minHeight: '50px'
        }}>
          {note.summary?.content || 'No summary yet'}
        </div>
      </div>

      <div style={{
        backgroundColor: '#ffffff',
        padding: '30px',
        borderRadius: '15px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        marginBottom: '30px'
      }}>
        <h2 style={{
          color: '#2c3e50',
          marginBottom: '20px',
          fontSize: '24px',
          fontWeight: '600',
          borderBottom: '3px solid #007bff',
          paddingBottom: '10px'
        }}>🧠 Quiz</h2>
      {note.quiz_questions?.length ? note.quiz_questions.map(q => (
        <div key={q.id} style={{marginBottom:20, padding:15, border:'1px solid #ddd', borderRadius:8}}>
          <div style={{fontWeight:'bold', marginBottom:10}}>{q.question}</div>
          {['A','B','C','D'].map(k => (
            <label key={k} style={{display:'block', marginBottom:5, cursor:'pointer'}}>
              <input type="radio" name={`q_${q.id}`} value={k} onChange={()=>setAnswers(a=>({...a,[q.id]:k}))} style={{marginRight:8}} />
              {k}) {q[`option_${k.toLowerCase()}`] || `Answer option ${k}`}
            </label>
          ))}
        </div>
      )) : 'No quiz yet'}
      {!!note.quiz_questions?.length && !quizResult && (
        <button onClick={async()=>{ 
          const result = await submitQuiz(id, answers); 
          setQuizResult(result);
          setAnswers({});
        }} style={{padding:'10px 20px', fontSize:16, backgroundColor:'#007bff', color:'white', border:'none', borderRadius:5, cursor:'pointer'}}>
          Submit Quiz
        </button>
      )}
      
      {quizResult && (
        <div style={{marginTop:20, padding:15, backgroundColor:'#f8f9fa', border:'1px solid #dee2e6', borderRadius:8}}>
          <h3>Quiz Result</h3>
          <p>Correct answers: {quizResult.correct}/{quizResult.total}</p>
          <p>Score: {Math.round((quizResult.correct / quizResult.total) * 100)}%</p>
          <button onClick={() => {setQuizResult(null); setAnswers({})}} style={{marginTop:10, padding:'8px 16px', backgroundColor:'#28a745', color:'white', border:'none', borderRadius:5, cursor:'pointer'}}>
            Try Again
          </button>
        </div>
      )}

        </div>

      <div style={{
        backgroundColor: '#ffffff',
        padding: '30px',
        borderRadius: '15px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        marginBottom: '30px'
      }}>
        <h2 style={{
          color: '#2c3e50',
          marginBottom: '20px',
          fontSize: '24px',
          fontWeight: '600',
          borderBottom: '3px solid #6f42c1',
          paddingBottom: '10px'
        }}>🃏 Flashcards</h2>
        {note.flashcards?.length ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(330px, 1fr))',
            gap: '30px',
            padding: '20px 0',
            justifyContent: 'center',
            alignItems: 'start',
            placeItems: 'center'
          }}>
            {note.flashcards.map((c, idx) => (
              <Flashcard key={idx} front={c.front} back={c.back} onReviewed={() => flashcardReviewed(id)} />
            ))}
          </div>
        ) : (
          <div style={{
            textAlign: 'center',
            padding: '40px',
            color: '#6c757d',
            fontSize: '16px',
            backgroundColor: '#f8f9fa',
            borderRadius: '10px'
          }}>
            No flashcards yet
          </div>
        )}
      </div>

      <div style={{
        backgroundColor: '#ffffff',
        padding: '30px',
        borderRadius: '15px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        marginBottom: '30px'
      }}>
        <h2 style={{
          color: '#2c3e50',
          marginBottom: '20px',
          fontSize: '24px',
          fontWeight: '600',
          borderBottom: '3px solid #17a2b8',
          paddingBottom: '10px'
        }}>📊 Progress</h2>
        {note.progress_entries?.length ? note.progress_entries.map(p => (
          <div key={p.id} style={{
            backgroundColor: '#f8f9fa',
            padding: '20px',
            borderRadius: '10px',
            border: '1px solid #e9ecef',
            fontSize: '16px',
            color: '#495057'
          }}>
            <div style={{ marginBottom: '10px' }}>
              <strong>Quiz result:</strong> {p.correct_quiz_answers}/{p.completed_quiz_questions} correct answers
            </div>
            <div>
              <strong>Reviewed flashcards:</strong> {p.flashcards_reviewed}
            </div>
          </div>
        )) : (
          <div style={{
            textAlign: 'center',
            padding: '40px',
            color: '#6c757d',
            fontSize: '16px',
            backgroundColor: '#f8f9fa',
            borderRadius: '10px'
          }}>
            No progress yet
          </div>
        )}
      </div>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<NotesList />} />
        <Route path="/notes/:id" element={<NoteDetail />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
