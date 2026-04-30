import { useState, type FormEvent } from 'react'
import { useTodos } from '../hooks/useTodos'

export function TodoList() {
  const { todos, addTodo, toggleTodo, deleteTodo, clearCompleted } = useTodos()
  const [draft, setDraft] = useState('')

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    addTodo(draft)
    setDraft('')
  }

  const remaining = todos.filter((t) => !t.done).length

  return (
    <section aria-label="Todo list">
      <form onSubmit={handleSubmit}>
        <label htmlFor="new-todo">New todo</label>
        <input
          id="new-todo"
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="What needs doing?"
          autoComplete="off"
        />
        <button type="submit" disabled={!draft.trim()}>
          Add
        </button>
      </form>

      <ul>
        {todos.map((todo) => (
          <li key={todo.id} data-testid="todo-item">
            <label>
              <input
                type="checkbox"
                checked={todo.done}
                onChange={() => toggleTodo(todo.id)}
                aria-label={`Mark ${todo.text} as ${todo.done ? 'not done' : 'done'}`}
              />
              <span style={{ textDecoration: todo.done ? 'line-through' : 'none' }}>
                {todo.text}
              </span>
            </label>
            <button
              type="button"
              onClick={() => deleteTodo(todo.id)}
              aria-label={`Delete ${todo.text}`}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>

      <footer>
        <span>{remaining} remaining</span>
        <button type="button" onClick={clearCompleted} disabled={remaining === todos.length}>
          Clear completed
        </button>
      </footer>
    </section>
  )
}
