import { useState } from 'react'
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from '@headlessui/react'
import { 
  EllipsisVerticalIcon,
  FlagIcon,
  DocumentTextIcon,
  UserIcon
} from '@heroicons/react/24/outline'
import { StarIcon as StarIconOutline } from '@heroicons/react/24/outline'
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function ProjectCard({ 
  project, 
  onProjectClick, 
  onTogglePin, 
  onStatusUpdate, 
  onDeleteProject,
  getProjectStatusColor,
  getPriorityColor 
}) {
  const [imageError, setImageError] = useState(false)

  // Generate project image URL from Vercel public folder
  const getProjectImageUrl = () => {
    if (imageError) return null
    
    // Map project titles to image filenames
    const imageMap = {
      'RD Services': 'rd_serivces.png',
      'Marketing Automation': 'marketautomation.png',
      'E-commerce Platform': 'e commerce.png',
      'Data Analytics Dashboard': 'data_analytics_dashboard.png',
      'Website Optimization': 'website_optimization.png',
      'Security Audit System': 'security_audit_system.png',
      'Financial Reporting Dashboard': 'financial_reporting_dashboard.png'
    }
    
    const imageName = imageMap[project.title] || `project-${project.id}.jpg`
    return `/images/${imageName}`
  }

  // Generate tags from project data
  const getProjectTags = () => {
    const tags = []
    if (project.team) {
      tags.push({ name: project.team, color: 'bg-blue-100 text-blue-800' })
    }
    if (project.priority) {
      const priorityColor = project.priority === 'high' ? 'bg-red-100 text-red-800' : 
                           project.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' : 
                           'bg-green-100 text-green-800'
      tags.push({ name: project.priority, color: priorityColor })
    }
    return tags
  }

  // Calculate days remaining (mock for now)
  const getDaysRemaining = () => {
    // This would be calculated from actual due date
    // For now, return a consistent number based on project ID for demo purposes
    return (project.id % 30) + 1
  }

  const tags = getProjectTags()
  const daysRemaining = getDaysRemaining()

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
      {/* Card Header with Tags and Menu */}
      <div className="p-4 pb-2">
        <div className="flex items-start justify-between">
          <div className="flex flex-wrap gap-2">
            {tags.map((tag, index) => (
              <span
                key={index}
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${tag.color}`}
              >
                {tag.name}
              </span>
            ))}
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={(e) => {
                e.stopPropagation()
                onTogglePin(project.id, project.pinned)
              }}
              className="text-gray-400 hover:text-yellow-500 transition-colors"
            >
              {project.pinned ? (
                <StarIconSolid className="h-4 w-4 text-yellow-500" />
              ) : (
                <StarIconOutline className="h-4 w-4" />
              )}
            </button>
            
            <Menu as="div" className="relative">
              <MenuButton className="inline-flex items-center justify-center rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2">
                <span className="sr-only">Open options</span>
                <EllipsisVerticalIcon className="h-5 w-5" />
              </MenuButton>
              <MenuItems className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className="py-1">
                  <MenuItem>
                    <button
                      onClick={() => onProjectClick(project.id)}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      View Details
                    </button>
                  </MenuItem>
                  <MenuItem>
                    <button
                      onClick={() => onDeleteProject(project.id)}
                      className="block w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-red-50"
                    >
                      Delete Project
                    </button>
                  </MenuItem>
                </div>
              </MenuItems>
            </Menu>
          </div>
        </div>
        
        {/* Project Title */}
        <h3 
          className="mt-3 text-lg font-semibold text-gray-900 cursor-pointer hover:text-purple-600 transition-colors"
          onClick={() => onProjectClick(project.id)}
        >
          {project.title}
        </h3>
      </div>

      {/* Project Image/Preview */}
      <div className="px-4 pb-2">
        <div className="relative h-32 bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg overflow-hidden">
          {getProjectImageUrl() && !imageError ? (
            <img
              src={getProjectImageUrl()}
              alt={project.title}
              className="w-full h-full object-cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-4xl font-bold text-purple-300">
                {project.initials}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Card Footer */}
      <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
        <div className="flex items-center justify-between">
          {/* Left side - Date and Members */}
          <div className="flex items-center space-x-2">
            <div className="flex items-center text-xs text-gray-500">
              <FlagIcon className="h-3 w-3 mr-1" />
              <span>{project.lastUpdated}</span>
            </div>
            <div className="flex items-center text-xs text-gray-500">
              <UserIcon className="h-3 w-3 mr-1" />
              <span>+{project.totalMembers}</span>
            </div>
          </div>

          {/* Center - Days Remaining */}
          <div className="text-xs font-medium text-gray-700">
            D-{daysRemaining}
          </div>

          {/* Right side - Tasks and Status */}
          <div className="flex items-center space-x-2">
            <div className="flex items-center text-xs text-gray-500">
              <DocumentTextIcon className="h-3 w-3 mr-1" />
              <span>{project.task_count || 0}</span>
            </div>
            
            <select
              value={project.status || 'planning'}
              onChange={(e) => onStatusUpdate(project.id, e.target.value)}
              onClick={(e) => e.stopPropagation()}
              className={`text-xs rounded-full px-2 py-1 border-0 font-medium min-w-0 ${getProjectStatusColor(project.status || 'planning')}`}
            >
              <option value="planning">Planning</option>
              <option value="active">Active</option>
              <option value="completed">Done</option>
              <option value="on_hold">Hold</option>
              <option value="cancelled">Cancel</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  )
}
