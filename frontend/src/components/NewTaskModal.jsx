import { useState, useEffect } from 'react'
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { tasksAPI, usersAPI } from '../services/api'

export default function NewTaskModal({ isOpen, onClose, onTaskCreated, projectId }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assigned_to: '3', // Default to Dipesh Thakran
    due_date: '',
    priority: 'medium'
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [users, setUsers] = useState([])
  const [usersLoading, setUsersLoading] = useState(false)

  // Fetch users when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchUsers()
    }
  }, [isOpen])

  const fetchUsers = async () => {
    try {
      setUsersLoading(true)
      const data = await usersAPI.getAll()
      setUsers(data)
    } catch (err) {
      console.error('Error fetching users:', err)
      setUsers([])
    } finally {
      setUsersLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.title.trim()) {
      setError('Task title is required')
      return
    }

    try {
      setLoading(true)
      setError(null)

      const taskData = {
        project_id: projectId,
        title: formData.title.trim(),
        description: formData.description.trim(),
        assigned_to: parseInt(formData.assigned_to),
        due_date: formData.due_date || null,
        priority: formData.priority,
        created_by: 3 // Hard-coded to Dipesh Thakran for demo
      }

      const result = await tasksAPI.create(taskData)
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        assigned_to: '3',
        due_date: '',
        priority: 'medium'
      })
      
      // Notify parent component
      onTaskCreated && onTaskCreated()
      
      // Close modal
      onClose()
      
      console.log('Task created successfully:', result)
    } catch (err) {
      setError('Failed to create task. Please try again.')
      console.error('Error creating task:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleClose = () => {
    if (!loading) {
      setFormData({
        title: '',
        description: '',
        assigned_to: '3',
        due_date: '',
        priority: 'medium'
      })
      setError(null)
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onClose={handleClose} className="relative z-50">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
      />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel
            transition
            className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-lg sm:p-6 data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
          >
            <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
              <button
                type="button"
                onClick={handleClose}
                disabled={loading}
                className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
              >
                <span className="sr-only">Close</span>
                <XMarkIcon aria-hidden="true" className="h-6 w-6" />
              </button>
            </div>
            
            <div className="sm:flex sm:items-start">
              <div className="w-full mt-3 text-center sm:ml-0 sm:mt-0 sm:text-left">
                <DialogTitle as="h3" className="text-base font-semibold leading-6 text-gray-900">
                  Add New Task
                </DialogTitle>
                
                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                  {error && (
                    <div className="rounded-md bg-red-50 p-4">
                      <div className="text-sm text-red-700">{error}</div>
                    </div>
                  )}

                  {/* Task Title */}
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium leading-6 text-gray-900">
                      Task Title *
                    </label>
                    <input
                      type="text"
                      name="title"
                      id="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      disabled={loading}
                      className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-purple-600 sm:text-sm sm:leading-6"
                      placeholder="Enter task title"
                      required
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium leading-6 text-gray-900">
                      Description
                    </label>
                    <textarea
                      name="description"
                      id="description"
                      rows={3}
                      value={formData.description}
                      onChange={handleInputChange}
                      disabled={loading}
                      className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-purple-600 sm:text-sm sm:leading-6"
                      placeholder="Describe the task"
                    />
                  </div>

                  {/* Assigned To */}
                  <div>
                    <label htmlFor="assigned_to" className="block text-sm font-medium leading-6 text-gray-900">
                      Assign To
                    </label>
                    <select
                      name="assigned_to"
                      id="assigned_to"
                      value={formData.assigned_to}
                      onChange={handleInputChange}
                      disabled={loading || usersLoading}
                      className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-purple-600 sm:text-sm sm:leading-6"
                    >
                      {usersLoading ? (
                        <option>Loading users...</option>
                      ) : (
                        users.map((user) => (
                          <option key={user.id} value={user.id}>
                            {user.first_name} {user.last_name}
                          </option>
                        ))
                      )}
                    </select>
                  </div>

                  {/* Due Date */}
                  <div>
                    <label htmlFor="due_date" className="block text-sm font-medium leading-6 text-gray-900">
                      Due Date
                    </label>
                    <input
                      type="date"
                      name="due_date"
                      id="due_date"
                      value={formData.due_date}
                      onChange={handleInputChange}
                      disabled={loading}
                      className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-purple-600 sm:text-sm sm:leading-6"
                    />
                  </div>

                  {/* Priority */}
                  <div>
                    <label htmlFor="priority" className="block text-sm font-medium leading-6 text-gray-900">
                      Priority
                    </label>
                    <div className="mt-2 flex space-x-4">
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          name="priority"
                          value="low"
                          checked={formData.priority === 'low'}
                          onChange={handleInputChange}
                          disabled={loading}
                          className="form-radio h-4 w-4 text-purple-600 transition duration-150 ease-in-out"
                        />
                        <span className="ml-2 text-sm text-gray-700">Low</span>
                      </label>
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          name="priority"
                          value="medium"
                          checked={formData.priority === 'medium'}
                          onChange={handleInputChange}
                          disabled={loading}
                          className="form-radio h-4 w-4 text-purple-600 transition duration-150 ease-in-out"
                        />
                        <span className="ml-2 text-sm text-gray-700">Medium</span>
                      </label>
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          name="priority"
                          value="high"
                          checked={formData.priority === 'high'}
                          onChange={handleInputChange}
                          disabled={loading}
                          className="form-radio h-4 w-4 text-purple-600 transition duration-150 ease-in-out"
                        />
                        <span className="ml-2 text-sm text-gray-700">High</span>
                      </label>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={handleClose}
                      disabled={loading}
                      className="inline-flex justify-center rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading || !formData.title.trim()}
                      className="inline-flex justify-center rounded-md bg-purple-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600 disabled:opacity-50"
                    >
                      {loading ? 'Creating...' : 'Create Task'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  )
}
