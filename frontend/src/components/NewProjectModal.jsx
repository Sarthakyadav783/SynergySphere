import { useState } from 'react'
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { projectsAPI } from '../services/api'

export default function NewProjectModal({ isOpen, onClose, onProjectCreated }) {
  const [formData, setFormData] = useState({
    name: '',
    tags: '',
    projectManager: '',
    deadline: '',
    priority: 'medium',
    image: '',
    description: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.name.trim()) {
      setError('Project name is required')
      return
    }

    try {
      setLoading(true)
      setError(null)

      const projectData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        priority: formData.priority,
        deadline: formData.deadline || null,
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : [],
        project_manager: formData.projectManager.trim() || null,
        image: formData.image.trim() || null,
        created_by: 1 // TODO: Replace with actual user ID when auth is implemented
      }

      const result = await projectsAPI.create(projectData)
      
      // Reset form
      setFormData({
        name: '',
        tags: '',
        projectManager: '',
        deadline: '',
        priority: 'medium',
        image: '',
        description: ''
      })
      
      // Notify parent component
      onProjectCreated && onProjectCreated()
      
      // Close modal
      onClose()
      
      console.log('Project created successfully:', result)
    } catch (err) {
      setError('Failed to create project. Please try again.')
      console.error('Error creating project:', err)
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
        name: '',
        tags: '',
        projectManager: '',
        deadline: '',
        priority: 'medium',
        image: '',
        description: ''
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
                  Create New Project
                </DialogTitle>
                
                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                  {error && (
                    <div className="rounded-md bg-red-50 p-4">
                      <div className="text-sm text-red-700">{error}</div>
                    </div>
                  )}

                  {/* Name Field */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
                      Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      disabled={loading}
                      className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-purple-600 sm:text-sm sm:leading-6"
                      placeholder="Enter project name"
                      required
                    />
                  </div>

                  {/* Tags Field */}
                  <div>
                    <label htmlFor="tags" className="block text-sm font-medium leading-6 text-gray-900">
                      Tags
                    </label>
                    <input
                      type="text"
                      name="tags"
                      id="tags"
                      value={formData.tags}
                      onChange={handleInputChange}
                      disabled={loading}
                      className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-purple-600 sm:text-sm sm:leading-6"
                      placeholder="Auto Selection Dropdown"
                    />
                  </div>

                  {/* Project Manager Field */}
                  <div>
                    <label htmlFor="projectManager" className="block text-sm font-medium leading-6 text-gray-900">
                      Project Manager
                    </label>
                    <input
                      type="text"
                      name="projectManager"
                      id="projectManager"
                      value={formData.projectManager}
                      onChange={handleInputChange}
                      disabled={loading}
                      className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-purple-600 sm:text-sm sm:leading-6"
                      placeholder="Single Selection Dropdown"
                    />
                  </div>

                  {/* Deadline Field */}
                  <div>
                    <label htmlFor="deadline" className="block text-sm font-medium leading-6 text-gray-900">
                      Deadline
                    </label>
                    <input
                      type="date"
                      name="deadline"
                      id="deadline"
                      value={formData.deadline}
                      onChange={handleInputChange}
                      disabled={loading}
                      className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-purple-600 sm:text-sm sm:leading-6"
                    />
                  </div>

                  {/* Priority Field */}
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

                  {/* Image Field */}
                  <div>
                    <label htmlFor="image" className="block text-sm font-medium leading-6 text-gray-900">
                      Image
                    </label>
                    <div className="mt-2 flex items-center space-x-3">
                      <input
                        type="text"
                        name="image"
                        id="image"
                        value={formData.image}
                        onChange={handleInputChange}
                        disabled={loading}
                        className="flex-1 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-purple-600 sm:text-sm sm:leading-6"
                        placeholder="Image URL or path"
                      />
                      <button
                        type="button"
                        className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                        disabled={loading}
                      >
                        Upload Image
                      </button>
                    </div>
                  </div>

                  {/* Description Field */}
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium leading-6 text-gray-900">
                      Description
                    </label>
                    <textarea
                      name="description"
                      id="description"
                      rows={4}
                      value={formData.description}
                      onChange={handleInputChange}
                      disabled={loading}
                      className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-purple-600 sm:text-sm sm:leading-6"
                      placeholder="Stylish Jackal"
                    />
                  </div>

                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={handleClose}
                      disabled={loading}
                      className="inline-flex justify-center rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:opacity-50"
                    >
                      Discard
                    </button>
                    <button
                      type="submit"
                      disabled={loading || !formData.name.trim()}
                      className="inline-flex justify-center rounded-md bg-purple-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600 disabled:opacity-50"
                    >
                      {loading ? 'Saving...' : 'Save'}
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
