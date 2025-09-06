import React, { useState } from 'react'

const initialTasks = [
  { id: 1, title: 'Design login page', status: 'In Progress', due: '2025-09-10', description: 'Create a responsive login page for the app.' },
  { id: 2, title: 'Fix dashboard bug', status: 'Pending', due: '2025-09-12', description: 'Resolve the issue with dashboard loading.' },
  { id: 3, title: 'Update documentation', status: 'Completed', due: '2025-09-05', description: 'Add new API endpoints to the docs.' },
]

const statusStyles = {
  'Pending': 'bg-gray-100 text-gray-700',
  'In Progress': 'bg-yellow-100 text-yellow-700',
  'Completed': 'bg-green-100 text-green-700',
}

export default function Mytasks() {
  const [tasks, setTasks] = useState(initialTasks)
  const [openDropdown, setOpenDropdown] = useState(null)

  const handleStatusChange = (id, newStatus) => {
    setTasks(tasks =>
      tasks.map(task =>
        task.id === id ? { ...task, status: newStatus } : task
      )
    )
  }

  const handleTaskClick = (id, e) => {
    if (e.target.tagName.toLowerCase() === 'select') return
    setOpenDropdown(openDropdown === id ? null : id)
  }

  return (
    <div className="p-6 w-full max-w-none">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">My Tasks</h2>
      <ul className="space-y-4 w-full">
        {tasks.map(task => (
          <li
            key={task.id}
            className={`w-full rounded-lg shadow transition border border-gray-200 bg-white hover:shadow-lg cursor-pointer ${openDropdown === task.id ? 'ring-2 ring-purple-400' : ''}`}
            onClick={e => handleTaskClick(task.id, e)}
          >
            <div className="flex justify-between items-center px-8 py-4 w-full">
              <div>
                <div className="font-semibold text-lg text-gray-900">{task.title}</div>
                <div className="text-xs text-gray-500 mt-1">Due: {task.due}</div>
              </div>
              <div className="flex items-center space-x-3">
                <select
                  value={task.status}
                  onChange={e => handleStatusChange(task.id, e.target.value)}
                  className={`rounded-md border border-gray-300 text-sm px-3 py-1 focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition ${statusStyles[task.status]}`}
                  onClick={e => e.stopPropagation()}
                >
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
            </div>
            {openDropdown === task.id && (
              <div className="px-8 pb-5 pt-1 animate-fade-in-down w-full">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-6 text-sm text-gray-700">
                  <div>
                    <span className="font-semibold text-gray-900">Title:</span> {task.title}
                  </div>
                  <div>
                    <span className="font-semibold text-gray-900">Status:</span>{' '}
                    <span className={`inline-block px-2 py-0.5 rounded ${statusStyles[task.status]}`}>
                      {task.status}
                    </span>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-900">Due Date:</span> {task.due}
                  </div>
                  <div className="sm:col-span-2">
                    <span className="font-semibold text-gray-900">Description:</span> {task.description}
                  </div>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

// Add this to your global CSS for a smooth dropdown animation:
// .animate-fade-in-down {
//   animation: fadeInDown 0.25s ease;
// }
// @keyframes fadeInDown {
//   from { opacity: 0; transform: translateY(-10px); }
//   to { opacity: 1; transform: translateY(0); }
// }