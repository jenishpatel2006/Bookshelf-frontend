// All backend calls live here so the components don't care where data comes from.
//
// - If VITE_API_URL is set (see .env.example) we talk to the FastAPI backend.
// - If not, we fall back to localStorage so the UI works on its own (Day 3).
//
// Expected FastAPI endpoints:
//   GET    /books          -> [Book]
//   POST   /books          -> Book        body: { title, author, status }
//   PUT    /books/{id}     -> Book        body: { title, author, status }
//   DELETE /books/{id}     -> 204 / {}
//
// Book = { id, title, author, status }   status: "to-read" | "reading" | "finished"

const API_URL = import.meta.env.VITE_API_URL
const LS_KEY = 'bookshelf-books'

export const usingBackend = Boolean(API_URL)

// ---------- real backend ----------

async function request(path, options = {}) {
  const res = await fetch(API_URL + path, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  if (!res.ok) {
    throw new Error(`Request failed (${res.status})`)
  }
  // DELETE might not return a body
  if (res.status === 204) return null
  const text = await res.text()
  return text ? JSON.parse(text) : null
}

// ---------- localStorage fallback ----------

const sampleBooks = [
  { id: 1, title: 'Atomic Habits', author: 'James Clear', status: 'finished' },
  { id: 2, title: 'Clean Code', author: 'Robert C. Martin', status: 'reading' },
  { id: 3, title: 'The Pragmatic Programmer', author: 'Andrew Hunt', status: 'to-read' },
  { id: 4, title: 'Deep Work', author: 'Cal Newport', status: 'finished' },
  { id: 5, title: 'Designing Data-Intensive Applications', author: 'Martin Kleppmann', status: 'to-read' },
  { id: 6, title: 'The Hobbit', author: 'J.R.R. Tolkien', status: 'reading' },
]

function readLocal() {
  try {
    const saved = localStorage.getItem(LS_KEY)
    // first visit: start with a few books so the shelf isn't empty
    if (saved === null) return sampleBooks
    return JSON.parse(saved) || []
  } catch {
    return []
  }
}

function writeLocal(books) {
  localStorage.setItem(LS_KEY, JSON.stringify(books))
}

// ---------- public functions ----------

export async function getBooks() {
  if (usingBackend) return request('/books')
  return readLocal()
}

export async function createBook(data) {
  if (usingBackend) {
    return request('/books', { method: 'POST', body: JSON.stringify(data) })
  }
  const books = readLocal()
  const book = { id: Date.now(), ...data }
  writeLocal([...books, book])
  return book
}

export async function updateBook(id, data) {
  if (usingBackend) {
    return request(`/books/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }
  const books = readLocal().map((b) => (b.id === id ? { ...b, ...data } : b))
  writeLocal(books)
  return books.find((b) => b.id === id)
}

export async function deleteBook(id) {
  if (usingBackend) {
    return request(`/books/${id}`, { method: 'DELETE' })
  }
  writeLocal(readLocal().filter((b) => b.id !== id))
  return null
}
