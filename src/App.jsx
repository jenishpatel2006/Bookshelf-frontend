import { useEffect, useState } from 'react'
import BookForm from './components/BookForm.jsx'
import BookItem from './components/BookItem.jsx'
import {
  getBooks,
  createBook,
  updateBook,
  deleteBook,
  usingBackend,
} from './api.js'

const filters = [
  { value: 'all', label: 'All' },
  { value: 'to-read', label: 'To read' },
  { value: 'reading', label: 'Reading' },
  { value: 'finished', label: 'Finished' },
]

// to-read -> reading -> finished -> back to to-read
const nextStatus = {
  'to-read': 'reading',
  reading: 'finished',
  finished: 'to-read',
}

function App() {
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('all')
  const [editing, setEditing] = useState(null)

  // load books once when the page opens
  useEffect(() => {
    getBooks()
      .then(setBooks)
      .catch(() => setError('Could not load books. Is the backend running?'))
      .finally(() => setLoading(false))
  }, [])

  const handleSave = async (data) => {
    setError('')
    try {
      if (editing) {
        const updated = await updateBook(editing.id, data)
        setBooks(books.map((b) => (b.id === editing.id ? updated : b)))
        setEditing(null)
      } else {
        const created = await createBook(data)
        setBooks([...books, created])
      }
    } catch {
      setError('Could not save the book.')
    }
  }

  const handleStep = async (book) => {
    setError('')
    try {
      const updated = await updateBook(book.id, {
        title: book.title,
        author: book.author,
        status: nextStatus[book.status],
      })
      setBooks(books.map((b) => (b.id === book.id ? updated : b)))
    } catch {
      setError('Could not update the book.')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this book?')) return
    setError('')
    try {
      await deleteBook(id)
      setBooks(books.filter((b) => b.id !== id))
      if (editing && editing.id === id) setEditing(null)
    } catch {
      setError('Could not delete the book.')
    }
  }

  const handleEdit = (book) => {
    setEditing(book)
    // on phones the form is at the top of the page
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const countOf = (status) => books.filter((b) => b.status === status).length
  const finished = countOf('finished')
  const reading = countOf('reading')

  const visibleBooks =
    filter === 'all' ? books : books.filter((b) => b.status === filter)

  const percent = (n) => (books.length ? (n / books.length) * 100 : 0) + '%'

  return (
    <>
      <header className="hero">
        <div className="hero-inner">
          <div>
            <h1>BookShelf</h1>
            <p className="sub">
              Your reading list: what's next, what you're on, what's done.
            </p>
          </div>

          <div className="progress">
            <p className="progress-text">
              {books.length === 0
                ? 'Your shelf is empty.'
                : `You've finished ${finished} of ${books.length} books.`}
            </p>
            <div className="stack">
              <span className="finished" style={{ width: percent(finished) }} />
              <span className="reading" style={{ width: percent(reading) }} />
            </div>
            <div className="legend">
              <span className="finished"><i />Finished</span>
              <span className="reading"><i />Reading</span>
              <span className="to-read"><i />To read</span>
            </div>
          </div>
        </div>
      </header>

      <div className="layout">
        <BookForm
          editing={editing}
          onSave={handleSave}
          onCancel={() => setEditing(null)}
        />

        <main>
          {error && <div className="error">{error}</div>}

          <div className="filters">
            {filters.map((f) => (
              <button
                key={f.value}
                className={filter === f.value ? 'active' : ''}
                onClick={() => setFilter(f.value)}
              >
                {f.label}
                <span className="n">
                  {f.value === 'all' ? books.length : countOf(f.value)}
                </span>
              </button>
            ))}
          </div>

          {loading ? (
            <p className="empty">Loading your books...</p>
          ) : visibleBooks.length === 0 ? (
            <div className="empty">
              <strong>Nothing on this shelf yet</strong>
              Add a book with the form to get started.
            </div>
          ) : (
            <ul className="book-list">
              {visibleBooks.map((book) => (
                <BookItem
                  key={book.id}
                  book={book}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onStep={handleStep}
                />
              ))}
            </ul>
          )}
        </main>

        <footer>
          {usingBackend
            ? 'Connected to the API'
            : 'Demo mode: books are saved in this browser only'}
        </footer>
      </div>
    </>
  )
}

export default App
