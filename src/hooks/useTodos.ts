import { useCallback, useEffect, useState } from 'react'
import { loadTodos, saveTodos, type Todo } from '../lib/storage'

export type TodoFilter = 'all' | 'active' | 'completed'

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>(() => loadTodos())
  const [filter, setFilter] = useState<TodoFilter>('all')

  useEffect(() => {
    saveTodos(todos)
  }, [todos])

  const addTodo = useCallback((text: string) => {
    const trimmed = text.trim()
    if (!trimmed) return
    setTodos((prev) => [
      ...prev,
      { id: crypto.randomUUID(), text: trimmed, done: false, createdAt: Date.now() },
    ])
  }, [])

  const toggleTodo = useCallback((id: string) => {
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)))
  }, [])

  const deleteTodo = useCallback((id: string) => {
    setTodos((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const clearCompleted = useCallback(() => {
    setTodos((prev) => prev.filter((t) => !t.done))
  }, [])

  const visibleTodos = todos.filter((todo) => {
    if (filter === 'active') return !todo.done
    if (filter === 'completed') return todo.done
    return true
  })

  return {
    todos,
    visibleTodos,
    filter,
    setFilter,
    addTodo,
    toggleTodo,
    deleteTodo,
    clearCompleted,
  }
}
