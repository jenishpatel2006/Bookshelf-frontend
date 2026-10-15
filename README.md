# BookShelf

Mini-project for the 5-day learning plan (FastAPI + PostgreSQL + React).
A small reading tracker: add books, mark them as to-read / reading / finished,
edit and delete them.

This repo is the **frontend** (React + Vite). Without a backend it runs in demo
mode and stores books in the browser's localStorage, so it works right away.

## Run it

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Connect to the FastAPI backend

1. Copy `.env.example` to `.env`
2. Set `VITE_API_URL` to where the backend runs (default `http://localhost:8000`)
3. Restart `npm run dev`

The backend needs to allow CORS from `http://localhost:5173`.

### API the frontend expects

| Method | Path          | Body                          | Returns |
| ------ | ------------- | ----------------------------- | ------- |
| GET    | `/books`      | -                             | list of books |
| POST   | `/books`      | `{ title, author, status }`   | the new book |
| PUT    | `/books/{id}` | `{ title, author, status }`   | the updated book |
| DELETE | `/books/{id}` | -                             | 204 / empty |

A book is `{ id, title, author, status }` where `status` is one of
`to-read`, `reading`, `finished`.

Suggested table:

```sql
CREATE TABLE books (
  id SERIAL PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  author VARCHAR(200) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'to-read'
);
```

## Structure

- `src/api.js` - all API calls (backend or localStorage fallback)
- `src/App.jsx` - main page, state, filters
- `src/components/BookForm.jsx` - add / edit form
- `src/components/BookItem.jsx` - one row in the list
- `src/App.css` - styles

## Todo

- [ ] build the FastAPI backend + PostgreSQL (Day 1-2)
- [ ] switch to the real API (Day 4)
- [ ] search box
- [ ] loading state on buttons
