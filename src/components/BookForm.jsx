import { useEffect, useState } from 'react'

const emptyForm = { title: '', author: '', status: 'to-read' }

// Used for both adding and editing.
// `editing` is the book being edited, or null when adding a new one.
function BookForm({ editing, onSave, onCancel }) {
  const [form, setForm] = useState(emptyForm)

  useEffect(() => {
    if (editing) {
      setForm({
        title: editing.title,
        author: editing.author,
        status: editing.status,
      })
    } else {
      setForm(emptyForm)
    }
  }, [editing])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.title.trim() || !form.author.trim()) return
    onSave({
      title: form.title.trim(),
      author: form.author.trim(),
      status: form.status,
    })
    if (!editing) setForm(emptyForm)
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      <h2>{editing ? 'Edit book' : 'Add a book'}</h2>

      <label className="field">
        Title
        <input
          name="title"
          placeholder="e.g. Atomic Habits"
          value={form.title}
          onChange={handleChange}
        />
      </label>

      <label className="field">
        Author
        <input
          name="author"
          placeholder="e.g. James Clear"
          value={form.author}
          onChange={handleChange}
        />
      </label>

      <label className="field">
        Status
        <select name="status" value={form.status} onChange={handleChange}>
          <option value="to-read">To read</option>
          <option value="reading">Reading</option>
          <option value="finished">Finished</option>
        </select>
      </label>

      <div className="form-buttons">
        <button type="submit" className="primary">
          {editing ? 'Save changes' : 'Add book'}
        </button>
        {editing && (
          <button type="button" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  )
}

export default BookForm
