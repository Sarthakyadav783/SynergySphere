import { useState, useEffect } from 'react'
import { projectsAPI, tasksAPI } from '../services/api'
import { ArrowLeftIcon, PlusIcon } from '@heroicons/react/24/outline'

export default function ProjectDetails({ projectId, onBack }) {
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (projectId) {
      fetchProjectDetails()
    }
  }, [projectId])

  const fetchProjectDetails = async () => {
    try {
      setLoading(true)
      const data = await projectsAPI.getById(projectId)
      setProject(data)
      setError(null)
    } catch (err) {
      setError('Failed to load project details')
      console.error('Error fetching project:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading project...</p>
        </div>
      </div>
    )
  }

  if (error || !project) {
    return (
      <div className="min-h-full flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={onBack}
            className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700"
          >
            Back to Projects
          </button>
        </div>
      </div>
    )
  }

  const getTaskStatusColor = (status) => {
    switch (status) {
      case 'done':
        return 'bg-green-100 text-green-800'
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-green-100 text-green-800'
    }
  }

  return (
    <div className="min-h-full">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="px-4 py-6 sm:px-0">
          <div className="flex items-center space-x-4 mb-6">
            <button
              onClick={onBack}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              <ArrowLeftIcon className="h-4 w-4 mr-2" />
              Back to Projects
            </button>
          </div>

          {/* Project Info */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                {project.name}
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                {project.description || 'No description provided'}
              </p>
              <div className="mt-4 flex items-center space-x-4">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(project.priority)}`}>
                  {project.priority} priority
                </span>
                <span className="text-sm text-gray-500">
                  Created by {project.creator_name} {project.creator_last_name}
                </span>
                <span className="text-sm text-gray-500">
                  {project.members?.length || 0} members
                </span>
              </div>
            </div>

            {/* Project Members */}
            {project.members && project.members.length > 0 && (
              <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                <h4 className="text-sm font-medium text-gray-900 mb-3">Team Members</h4>
                <div className="flex flex-wrap gap-2">
                  {project.members.map((member) => (
                    <div
                      key={member.id}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-800"
                    >
                      {member.first_name} {member.last_name}
                      <span className="ml-1 text-xs text-gray-500">({member.role})</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Tasks Section */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Tasks ({project.tasks?.length || 0})
                </h3>
                <button
                  onClick={() => console.log('Add new task')}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                >
                  <PlusIcon className="h-4 w-4 mr-1" />
                  Add Task
                </button>
              </div>
            </div>

            {/* Tasks List */}
            <div className="divide-y divide-gray-200">
              {project.tasks && project.tasks.length > 0 ? (
                project.tasks.map((task) => (
                  <div key={task.id} className="px-4 py-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-gray-900">
                          {task.title}
                        </h4>
                        {task.description && (
                          <p className="mt-1 text-sm text-gray-500">
                            {task.description}
                          </p>
                        )}
                        <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                          {task.assignee_name && (
                            <span>Assigned to: {task.assignee_name} {task.assignee_last_name}</span>
                          )}
                          {task.due_date && (
                            <span>Due: {new Date(task.due_date).toLocaleDateString()}</span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTaskStatusColor(task.status)}`}>
                          {task.status.replace('_', ' ')}
                        </span>
                        {task.priority && (
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                            {task.priority}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="px-4 py-8 text-center text-gray-500">
                  <p>No tasks found for this project.</p>
                  <button
                    onClick={() => console.log('Add first task')}
                    className="mt-2 text-purple-600 hover:text-purple-500"
                  >
                    Add the first task
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
