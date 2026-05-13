import { useState, useEffect } from 'react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

function CheckIcon() {
  return (
    <svg viewBox="0 0 12 10">
      <polyline points="1,5 4.5,9 11,1" />
    </svg>
  )
}

function TrashIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14H6L5 6" />
      <path d="M10 11v6M14 11v6" />
      <path d="M9 6V4h6v2" />
    </svg>
  )
}

export default function App() {
  const [tasks, setTasks] = useState([])
  const [newTitle, setNewTitle] = useState('')
  const [filter, setFilter] = useState('all') // all | pending | done
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchTasks()
  }, [])

  async function fetchTasks() {
    try {
      setLoading(true)
      const res = await fetch(`${API_URL}/tasks`)
      if (!res.ok) throw new Error('Erro ao buscar tarefas')
      setTasks(await res.json())
      setError('')
    } catch (e) {
      setError('Não foi possível conectar à API. Verifique se o back-end está rodando.')
    } finally {
      setLoading(false)
    }
  }

  async function addTask(e) {
    e.preventDefault()
    if (!newTitle.trim()) return
    try {
      const res = await fetch(`${API_URL}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTitle.trim() }),
      })
      if (!res.ok) throw new Error()
      const task = await res.json()
      setTasks(prev => [...prev, task])
      setNewTitle('')
    } catch {
      setError('Erro ao adicionar tarefa.')
    }
  }

  async function toggleTask(id, done) {
    try {
      const res = await fetch(`${API_URL}/tasks/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ done: !done }),
      })
      if (!res.ok) throw new Error()
      const updated = await res.json()
      setTasks(prev => prev.map(t => t.id === id ? updated : t))
    } catch {
      setError('Erro ao atualizar tarefa.')
    }
  }

  async function deleteTask(id) {
    try {
      await fetch(`${API_URL}/tasks/${id}`, { method: 'DELETE' })
      setTasks(prev => prev.filter(t => t.id !== id))
    } catch {
      setError('Erro ao remover tarefa.')
    }
  }

  const filtered = tasks.filter(t => {
    if (filter === 'pending') return !t.done
    if (filter === 'done') return t.done
    return true
  })

  const doneCount = tasks.filter(t => t.done).length

  return (
    <>
      <div className="header">
        <h1>Minhas<br /><span>Tarefas.</span></h1>
        <p>Organize o que precisa ser feito hoje.</p>
      </div>

      <div className="stats">
        <div className="stat-badge">
          <strong>{tasks.length}</strong> total
        </div>
        <div className="stat-badge done">
          <strong>{doneCount}</strong> concluídas
        </div>
        <div className="stat-badge">
          <strong>{tasks.length - doneCount}</strong> pendentes
        </div>
      </div>

      {error && <div className="error-msg">{error}</div>}

      <form className="input-row" onSubmit={addTask}>
        <input
          type="text"
          placeholder="Adicionar nova tarefa..."
          value={newTitle}
          onChange={e => setNewTitle(e.target.value)}
        />
        <button type="submit" className="btn-add">Adicionar</button>
      </form>

      <div className="filters">
        {[['all', 'Todas'], ['pending', 'Pendentes'], ['done', 'Concluídas']].map(([val, label]) => (
          <button
            key={val}
            className={`filter-btn${filter === val ? ' active' : ''}`}
            onClick={() => setFilter(val)}
          >
            {label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="status-msg">Carregando tarefas...</div>
      ) : filtered.length === 0 ? (
        <div className="empty">
          <div className="empty-icon">✦</div>
          <p>Nenhuma tarefa aqui.</p>
        </div>
      ) : (
        <div className="task-list">
          {filtered.map(task => (
            <div key={task.id} className={`task-item${task.done ? ' done' : ''}`}>
              <div
                className={`checkbox${task.done ? ' checked' : ''}`}
                onClick={() => toggleTask(task.id, task.done)}
              >
                {task.done && <CheckIcon />}
              </div>
              <span className="task-title">{task.title}</span>
              <button className="btn-delete" onClick={() => deleteTask(task.id)}>
                <TrashIcon />
              </button>
            </div>
          ))}
        </div>
      )}
    </>
  )
}
