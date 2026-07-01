import { useState, useEffect } from 'react'
import './TaskManager.css'

// Sabse important concept — useState se tasks store karte hain
// LocalStorage se data save rehta hai refresh ke baad bhi

function TaskManager() {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('tasks')
    return saved ? JSON.parse(saved) : []
  })
  const [input, setInput] = useState('')
  const [priority, setPriority] = useState('medium')
  const [filter, setFilter] = useState('all')

  // Jab bhi tasks change ho, LocalStorage update ho
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks))
  }, [tasks])

  const addTask = () => {
    if (!input.trim()) return
    const newTask = {
      id: Date.now(),
      text: input.trim(),
      completed: false,
      priority,
      date: new Date().toLocaleDateString()
    }
    setTasks([newTask, ...tasks])
    setInput('')
  }

  const toggleTask = (id) => {
    setTasks(tasks.map(t =>
      t.id === id ? { ...t, completed: !t.completed } : t
    ))
  }

  const deleteTask = (id) => {
    setTasks(tasks.filter(t => t.id !== id))
  }

  const filteredTasks = tasks.filter(t => {
    if (filter === 'active') return !t.completed
    if (filter === 'completed') return t.completed
    return true
  })

  return (
    <div className="tm">
      <div className="tm__container">

        {/* Header */}
        <div className="tm__header">
          <h1>Task Manager</h1>
          <p>{tasks.filter(t => !t.completed).length} tasks remaining</p>
        </div>

        {/* Input */}
        <div className="tm__input-row">
          <input
            className="tm__input"
            type="text"
            placeholder="Add a new task..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addTask()}
          />
          <select
            className="tm__select"
            value={priority}
            onChange={e => setPriority(e.target.value)}
          >
            <option value="high">🔴 High</option>
            <option value="medium">🟡 Medium</option>
            <option value="low">🟢 Low</option>
          </select>
          <button className="tm__add-btn" onClick={addTask}>Add</button>
        </div>

        {/* Filter */}
        <div className="tm__filters">
          {['all', 'active', 'completed'].map(f => (
            <button
              key={f}
              className={`tm__filter-btn ${filter === f ? 'active' : ''}`}
              onClick={() => setFilter(f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {/* Tasks List */}
        <div className="tm__list">
          {filteredTasks.length === 0 && (
            <p className="tm__empty">No tasks here! Add one above ☝️</p>
          )}
          {filteredTasks.map(task => (
            <div
              key={task.id}
              className={`tm__task ${task.completed ? 'done' : ''} priority-${task.priority}`}
            >
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleTask(task.id)}
                className="tm__checkbox"
              />
              <div className="tm__task-info">
                <span className="tm__task-text">{task.text}</span>
                <span className="tm__task-meta">{task.date} · {task.priority}</span>
              </div>
              <button
                className="tm__delete"
                onClick={() => deleteTask(task.id)}
              >✕</button>
            </div>
          ))}
        </div>

        {/* Footer */}
        {tasks.length > 0 && (
          <div className="tm__footer">
            <span>{tasks.filter(t => t.completed).length} completed</span>
            <button
              className="tm__clear"
              onClick={() => setTasks(tasks.filter(t => !t.completed))}
            >
              Clear Completed
            </button>
          </div>
        )}

      </div>
    </div>
  )
}

export default TaskManager