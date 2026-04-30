import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { useTodos } from './useTodos'

describe('useTodos', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  afterEach(() => {
    localStorage.clear()
  })

  it('starts empty when storage is empty', () => {
    const { result } = renderHook(() => useTodos())
    expect(result.current.todos).toEqual([])
  })

  it('adds a todo with trimmed text', () => {
    const { result } = renderHook(() => useTodos())
    act(() => result.current.addTodo('  buy milk  '))
    expect(result.current.todos).toHaveLength(1)
    expect(result.current.todos[0].text).toBe('buy milk')
    expect(result.current.todos[0].done).toBe(false)
  })

  it('ignores empty or whitespace-only input', () => {
    const { result } = renderHook(() => useTodos())
    act(() => result.current.addTodo('   '))
    act(() => result.current.addTodo(''))
    expect(result.current.todos).toEqual([])
  })

  it('toggles a todo', () => {
    const { result } = renderHook(() => useTodos())
    act(() => result.current.addTodo('walk dog'))
    const id = result.current.todos[0].id
    act(() => result.current.toggleTodo(id))
    expect(result.current.todos[0].done).toBe(true)
    act(() => result.current.toggleTodo(id))
    expect(result.current.todos[0].done).toBe(false)
  })

  it('deletes a todo', () => {
    const { result } = renderHook(() => useTodos())
    act(() => result.current.addTodo('a'))
    act(() => result.current.addTodo('b'))
    const idA = result.current.todos[0].id
    act(() => result.current.deleteTodo(idA))
    expect(result.current.todos).toHaveLength(1)
    expect(result.current.todos[0].text).toBe('b')
  })

  it('clears completed todos only', () => {
    const { result } = renderHook(() => useTodos())
    act(() => result.current.addTodo('a'))
    act(() => result.current.addTodo('b'))
    const idA = result.current.todos[0].id
    act(() => result.current.toggleTodo(idA))
    act(() => result.current.clearCompleted())
    expect(result.current.todos).toHaveLength(1)
    expect(result.current.todos[0].text).toBe('b')
  })

  it('persists to localStorage', () => {
    const { result, rerender } = renderHook(() => useTodos())
    act(() => result.current.addTodo('persist me'))
    rerender()
    const reloaded = renderHook(() => useTodos())
    expect(reloaded.result.current.todos).toHaveLength(1)
    expect(reloaded.result.current.todos[0].text).toBe('persist me')
  })
})
