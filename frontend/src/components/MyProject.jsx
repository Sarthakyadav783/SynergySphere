import React, { useState } from 'react'

const statusStyles = {
  'Pending': 'bg-gray-100 text-gray-700',
  'In Progress': 'bg-yellow-100 text-yellow-700',
  'Completed': 'bg-green-100 text-green-700',
}

export default function MyProject({ project }) {
  const [openDropdown, setOpenDropdown] = useState(null)
  const [showNewTask, setShowNewTask] = useState(false)
  const [tasks, setTasks] = useState(project.tasks || [
    { id: 1, title: 'Kickoff meeting', status: 'Completed', due: '2025-09-01', assignee: 'Alice', description: 'Initial project kickoff with all stakeholders.' },
    { id: 2, title: 'Design wireframes', status: 'In Progress', due: '2025-09-10', assignee: 'Bob', description: 'Create wireframes for all main screens.' },
    { id: 3, title: 'API integration', status: 'Pending', due: '2025-09-20', assignee: 'Charlie', description: 'Integrate backend APIs with frontend.' },
  ])

  const [newTask, setNewTask] = useState({
    title: '',
    status: 'Pending',
    due: '',
    assignee: '',
    description: '',
  })

  const handleTaskClick = (id) => {
    setOpenDropdown(openDropdown === id ? null : id)
  }

  const handleNewTaskChange = (e) => {
    const { name, value } = e.target
    setNewTask(prev => ({ ...prev, [name]: value }))
  }

  const handleNewTaskSubmit = (e) => {
    e.preventDefault()
    if (!newTask.title || !newTask.due || !newTask.assignee) return
    setTasks(prev => [
      ...prev,
      {
        ...newTask,
        id: prev.length ? prev[prev.length - 1].id + 1 : 1,
      },
    ])
    setNewTask({
      title: '',
      status: 'Pending',
      due: '',
      assignee: '',
      description: '',
    })
    setShowNewTask(false)
  }

  return (
    <div className="p-4 sm:p-8 w-full max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <div className="flex items-center">
          <div className={`rounded-full h-12 w-12 flex items-center justify-center text-white text-xl font-bold ${project.bgColorClass} mr-4`}>
            {project.initials}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{project.title}</h2>
            <div className="text-sm text-gray-500">{project.team}</div>
          </div>
        </div>
        <button
          className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-md font-semibold shadow transition whitespace-nowrap"
          onClick={() => setShowNewTask(true)}
        >
          New Task
        </button>
      </div>

      {showNewTask && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-30">
          <form
            onSubmit={handleNewTaskSubmit}
            className="w-full max-w-lg mx-auto bg-white rounded-xl shadow-lg border border-gray-200 p-8 relative"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-purple-700">Assign New Task</h3>
              <button
                type="button"
                className="text-gray-400 hover:text-gray-600 text-xl font-bold"
                onClick={() => setShowNewTask(false)}
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <div className="grid grid-cols-1 gap-4">
              <input
                name="title"
                value={newTask.title}
                onChange={handleNewTaskChange}
                placeholder="Task Title"
                className="border rounded px-3 py-2"
                required
              />
              <input
                name="assignee"
                value={newTask.assignee}
                onChange={handleNewTaskChange}
                placeholder="Assignee Name"
                className="border rounded px-3 py-2"
                required
              />
              <input
                name="due"
                type="date"
                value={newTask.due}
                onChange={handleNewTaskChange}
                className="border rounded px-3 py-2"
                required
              />
              <select
                name="status"
                value={newTask.status}
                onChange={handleNewTaskChange}
                className="border rounded px-3 py-2"
              >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
              <textarea
                name="description"
                value={newTask.description}
                onChange={handleNewTaskChange}
                placeholder="Description"
                className="border rounded px-3 py-2"
                rows={2}
              />
            </div>
            <button
              type="submit"
              className="mt-4 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded font-semibold w-full"
            >
              Add Task
            </button>
          </form>
        </div>
      )}

      <h3 className="text-lg font-semibold mb-4 text-purple-700">Tasks Assigned</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tasks.map(task => (
          <div
            key={task.id}
            className={`bg-white rounded-xl shadow border border-gray-200 p-5 cursor-pointer transition hover:shadow-lg ${openDropdown === task.id ? 'ring-2 ring-purple-400' : ''}`}
            onClick={() => handleTaskClick(task.id)}
          >
            <div className="flex justify-between items-center">
              <div>
                <div className="font-medium text-gray-900">{task.title}</div>
                <div className="text-xs text-gray-500 mt-1">Due: {task.due}</div>
                <div className="text-xs text-gray-400">
                  Assigned to: <span className="font-semibold text-gray-700">{task.assignee}</span>
                </div>
              </div>
              <span className={`px-3 py-1 rounded text-xs font-semibold ${statusStyles[task.status]}`}>
                {task.status}
              </span>
            </div>
            {openDropdown === task.id && (
              <div className="mt-4 p-4 bg-gray-50 rounded border border-gray-100 animate-fade-in-down">
                <div className="text-sm text-gray-700 space-y-1">
                  <div><span className="font-semibold text-gray-900">Title:</span> {task.title}</div>
                  <div><span className="font-semibold text-gray-900">Status:</span> {task.status}</div>
                  <div><span className="font-semibold text-gray-900">Due Date:</span> {task.due}</div>
                  <div><span className="font-semibold text-gray-900">Assigned to:</span> {task.assignee}</div>
                  <div><span className="font-semibold text-gray-900">Description:</span> {task.description || 'No description provided.'}</div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}