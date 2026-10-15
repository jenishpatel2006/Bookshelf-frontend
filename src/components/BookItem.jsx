const statusLabels = {
  'to-read': 'To read',
  reading: 'Reading',
  finished: 'Finished',
}

// what the main button does for each status
const stepLabels = {
  'to-read': 'Start reading',
  reading: 'Mark as finished',
  finished: 'Read again',
}

// jacket colours, picked from the title so a book always gets the same one
const jackets = ['#8c2f39', '#23395b', '#c98a12', '#2a7f7a', '#5b3a6e', '#c4562a', '#3f5d36']

function jacketFor(title) {
  let hash = 0
  for (const ch of title) {
    hash = (hash * 31 + ch.charCodeAt(0)) >>> 0
  }
  return jackets[hash % jackets.length]
}

function BookItem({ book, onEdit, onDelete, onStep }) {
  return (
    <li className="book">
      <div
        className="cover"
        style={{ '--jacket': jacketFor(book.title) }}
        title={`${book.title} by ${book.author}`}
      >
        <span className={'ribbon ' + book.status}>
          {statusLabels[book.status]}
        </span>

        <div className="cover-label">
          <div className="cover-title">{book.title}</div>
        </div>
        <div className="cover-author">{book.author}</div>
      </div>

      <div className="book-actions">
        <button className="step" onClick={() => onStep(book)}>
          {stepLabels[book.status]}
        </button>
        <button onClick={() => onEdit(book)}>Edit</button>
        <button className="danger" onClick={() => onDelete(book.id)}>
          Delete
        </button>
      </div>
    </li>
  )
}

export default BookItem
