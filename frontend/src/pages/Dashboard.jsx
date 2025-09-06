import { useState, useEffect } from 'react'
import { projectsAPI } from '../services/api'
import NewProjectModal from '../components/NewProjectModal'
import NewTaskModal from '../components/NewTaskModal'
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  TransitionChild,
} from '@headlessui/react'
import { Bars3CenterLeftIcon, Bars4Icon, ClockIcon, HomeIcon, XMarkIcon } from '@heroicons/react/24/outline'
import {
  ChevronRightIcon,
  ChevronUpDownIcon,
  EllipsisVerticalIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/20/solid'
import { ArrowLeftIcon, PlusIcon } from '@heroicons/react/24/outline'
import { StarIcon as StarIconOutline } from '@heroicons/react/24/outline'
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid'

const navigation = [
  { name: 'My Projects', href: '#', icon: HomeIcon, current: true, id: 'projects' },
  { name: 'My tasks', href: '#', icon: Bars4Icon, current: false, id: 'tasks' },
  { name: 'Recent', href: '#', icon: ClockIcon, current: false, id: 'recent' },
]
const teams = [
  { name: 'Engineering', href: '#', bgColorClass: 'bg-indigo-500' },
  { name: 'Human Resources', href: '#', bgColorClass: 'bg-green-500' },
  { name: 'Finance', href: '#', bgColorClass: 'bg-yellow-500' },
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [error, setError] = useState(null)
  const [selectedProjectId, setSelectedProjectId] = useState(null)
  const [selectedProject, setSelectedProject] = useState(null)
  const [projectLoading, setProjectLoading] = useState(false)
  const [showNewProjectModal, setShowNewProjectModal] = useState(false)
  const [showNewTaskModal, setShowNewTaskModal] = useState(false)
  const [currentView, setCurrentView] = useState('projects') // 'projects', 'tasks', 'recent'
  const [userTasks, setUserTasks] = useState([])
  const [tasksLoading, setTasksLoading] = useState(false)

  // Fetch projects on component mount
  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async (search = '') => {
    try {
      setLoading(true)
      const data = await projectsAPI.getAll(search)
      
      // Transform backend data to match frontend format
      const transformedProjects = data.map(project => {
        // Determine team based on project tags
        let team = 'Engineering' // default
        if (project.tags) {
          const tags = typeof project.tags === 'string' ? JSON.parse(project.tags) : project.tags
          if (tags.includes('hr') || tags.includes('onboarding')) {
            team = 'Human Resources'
          } else if (tags.includes('finance') || tags.includes('reporting')) {
            team = 'Finance'
          }
        }

        return {
          id: project.id,
          title: project.name,
          initials: project.name.substring(0, 2).toUpperCase(),
          team: team,
          members: [],
          totalMembers: project.member_count || 0,
          lastUpdated: new Date(project.last_updated || project.created_at).toLocaleDateString(),
          pinned: Boolean(project.pinned),
          bgColorClass: getRandomBgColor(),
          description: project.description,
          priority: project.priority,
          status: project.status,
          task_count: project.task_count || 0
        }
      })
      
      setProjects(transformedProjects)
      setError(null)
    } catch (err) {
      setError('Failed to load projects')
      console.error('Error fetching projects:', err)
    } finally {
      setLoading(false)
    }
  }

  // Handle search
  const handleSearch = (e) => {
    const query = e.target.value
    setSearchQuery(query)
    
    // Debounce search after 300ms
    clearTimeout(window.searchTimeout)
    window.searchTimeout = setTimeout(() => {
      fetchProjects(query)
    }, 300)
  }

  // Helper function for random colors
  const getRandomBgColor = () => {
    const colors = [
      'bg-pink-600', 'bg-purple-600', 'bg-yellow-500', 
      'bg-green-500', 'bg-blue-500', 'bg-indigo-500'
    ]
    return colors[Math.floor(Math.random() * colors.length)]
  }

  const handleProjectClick = async (projectId) => {
    console.log('Project clicked:', projectId)
    setSelectedProjectId(projectId)
    setProjectLoading(true)
    
    try {
      const projectDetails = await projectsAPI.getById(projectId)
      setSelectedProject(projectDetails)
    } catch (err) {
      console.error('Error fetching project details:', err)
      setSelectedProject(null)
    } finally {
      setProjectLoading(false)
    }
  }

  const handleNewProject = () => {
    setShowNewProjectModal(true)
  }

  const handleProjectCreated = () => {
    // Refresh the projects list
    fetchProjects()
  }

  const handleTaskCreated = () => {
    // Refresh the selected project details
    if (selectedProjectId) {
      handleProjectClick(selectedProjectId)
    }
  }

  const handleBackToProjects = () => {
    setSelectedProjectId(null)
    setSelectedProject(null)
  }

  const handleNavigation = (viewId) => {
    setCurrentView(viewId)
    setSelectedProjectId(null) // Clear any selected project
    setSelectedProject(null)
    
    // Fetch user's tasks when navigating to tasks view
    if (viewId === 'tasks') {
      fetchUserTasks()
    }
  }

  const fetchUserTasks = async () => {
    try {
      setTasksLoading(true)
      // Hard-coded to fetch tasks for Dipesh Thakran (user_id = 3)
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/tasks/my-tasks/3`)
      const data = await response.json()
      setUserTasks(data)
    } catch (err) {
      console.error('Error fetching user tasks:', err)
      setUserTasks([])
    } finally {
      setTasksLoading(false)
    }
  }

  // Helper functions for project details
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

  const getProjectStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'active':
        return 'bg-blue-100 text-blue-800'
      case 'on_hold':
        return 'bg-yellow-100 text-yellow-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default: // planning
        return 'bg-gray-100 text-gray-800'
    }
  }

  const handleStatusUpdate = async (projectId, newStatus) => {
    try {
      await projectsAPI.updateStatus(projectId, newStatus)
      // Refresh projects list
      fetchProjects()
    } catch (err) {
      console.error('Error updating project status:', err)
    }
  }

  const handleDeleteProject = async (projectId) => {
    if (window.confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      try {
        await projectsAPI.delete(projectId)
        
        // If we're viewing the deleted project, go back to projects list
        if (selectedProjectId === projectId) {
          setSelectedProjectId(null)
          setSelectedProject(null)
        }
        
        // Refresh projects list
        fetchProjects()
      } catch (err) {
        console.error('Error deleting project:', err)
        alert('Failed to delete project. Please try again.')
      }
    }
  }

  const handleTogglePin = async (projectId, currentPinStatus) => {
    try {
      await projectsAPI.togglePin(projectId, !currentPinStatus)
      
      // Refresh projects list to show new pin order
      fetchProjects()
    } catch (err) {
      console.error('Error toggling pin status:', err)
    }
  }

  const pinnedProjects = projects.filter((project) => project.pinned)

  // Show project details inline instead of separate page

  if (loading && projects.length === 0) {
  return (
      <div className="min-h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading projects...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-full flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => fetchProjects()}
            className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="min-h-full">
        <Dialog open={sidebarOpen} onClose={setSidebarOpen} className="relative z-40 lg:hidden">
          <DialogBackdrop
            transition
            className="fixed inset-0 bg-gray-600/75 transition-opacity duration-300 ease-linear data-closed:opacity-0"
          />

          <div className="fixed inset-0 z-40 flex">
            <DialogPanel
              transition
              className="relative flex w-full max-w-xs flex-1 transform flex-col bg-white pt-5 pb-4 transition duration-300 ease-in-out data-closed:-translate-x-full"
            >
              <TransitionChild>
                <div className="absolute top-0 right-0 -mr-12 pt-2 duration-300 ease-in-out data-closed:opacity-0">
                  <button
                    type="button"
                    onClick={() => setSidebarOpen(false)}
                    className="relative ml-1 flex size-10 items-center justify-center rounded-full focus:ring-2 focus:ring-white focus:outline-hidden focus:ring-inset"
                  >
                    <span className="absolute -inset-0.5" />
                    <span className="sr-only">Close sidebar</span>
                    <XMarkIcon aria-hidden="true" className="size-6 text-white" />
                  </button>
                </div>
              </TransitionChild>
              <div className="flex shrink-0 items-center px-4">
                <div className="flex items-center space-x-2">
                  <div className="h-8 w-8 bg-gradient-to-br from-purple-500 to-purple-700 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">SS</span>
                  </div>
                  <span className="text-lg font-semibold text-gray-900">SynergySphere</span>
                </div>
              </div>
              <div className="mt-5 h-0 flex-1 overflow-y-auto">
                <nav className="px-2">
                  <div className="space-y-1">
                    {navigation.map((item) => (
                      <button
                        key={item.name}
                        onClick={() => handleNavigation(item.id)}
                        aria-current={currentView === item.id ? 'page' : undefined}
                        className={classNames(
                          currentView === item.id
                            ? 'bg-gray-100 text-gray-900'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                          'group flex items-center rounded-md px-2 py-2 text-base/5 font-medium w-full text-left',
                        )}
                      >
                        <item.icon
                          aria-hidden="true"
                          className={classNames(
                            currentView === item.id ? 'text-gray-500' : 'text-gray-400 group-hover:text-gray-500',
                            'mr-3 size-6 shrink-0',
                          )}
                        />
                        {item.name}
                      </button>
                    ))}
                  </div>
                  <div className="mt-8">
                    <h3 id="mobile-teams-headline" className="px-3 text-sm font-medium text-gray-500">
                      Teams
                    </h3>
                    <div role="group" aria-labelledby="mobile-teams-headline" className="mt-1 space-y-1">
                      {teams.map((team) => (
                        <a
                          key={team.name}
                          href={team.href}
                          className="group flex items-center rounded-md px-3 py-2 text-base/5 font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                        >
                          <span
                            aria-hidden="true"
                            className={classNames(team.bgColorClass, 'mr-4 size-2.5 rounded-full')}
                          />
                          <span className="truncate">{team.name}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                </nav>
              </div>
            </DialogPanel>
            <div aria-hidden="true" className="w-14 shrink-0">
              {/* Dummy element to force sidebar to shrink to fit close icon */}
            </div>
          </div>
        </Dialog>

        {/* Static sidebar for desktop */}
        <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col lg:border-r lg:border-gray-200 lg:bg-gray-100 lg:pt-5 lg:pb-4">
          <div className="flex shrink-0 items-center px-6">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-gradient-to-br from-purple-500 to-purple-700 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">SS</span>
          </div>
              <span className="text-lg font-semibold text-gray-900">SynergySphere</span>
            </div>
          </div>
          <div className="mt-5 flex h-0 flex-1 flex-col overflow-y-auto pt-1">
            {/* User account dropdown */}
            <Menu as="div" className="relative inline-block px-3 text-left">
              <MenuButton className="group w-full rounded-md bg-gray-100 px-3.5 py-2 text-left text-sm font-medium text-gray-700 hover:bg-gray-200 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-100">
                <span className="flex w-full items-center justify-between">
                  <span className="flex min-w-0 items-center justify-between space-x-3">
                    <div className="size-10 shrink-0 rounded-full bg-purple-600 flex items-center justify-center text-white font-medium text-sm">
                      DT
                    </div>
                    <span className="flex min-w-0 flex-1 flex-col">
                      <span className="truncate text-sm font-medium text-gray-900">Dipesh Thakran</span>
                      <span className="truncate text-sm text-gray-500">@dipeshthakran</span>
                    </span>
                  </span>
                  <ChevronUpDownIcon
                    aria-hidden="true"
                    className="size-5 shrink-0 text-gray-400 group-hover:text-gray-500"
                  />
                </span>
              </MenuButton>

              <MenuItems
                transition
                className="absolute right-0 left-0 z-10 mx-3 mt-1 origin-top divide-y divide-gray-200 rounded-md bg-white shadow-lg ring-1 ring-black/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
              >
                <div className="py-1">
                  <MenuItem>
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden"
                    >
                      View profile
                    </a>
                  </MenuItem>
                  <MenuItem>
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden"
                    >
                      Settings
                    </a>
                  </MenuItem>
                  <MenuItem>
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden"
                    >
                      Notifications
                    </a>
                  </MenuItem>
                </div>
                <div className="py-1">
                  <MenuItem>
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden"
                    >
                      Get desktop app
                    </a>
                  </MenuItem>
                  <MenuItem>
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden"
                    >
                      Support
                    </a>
                  </MenuItem>
                </div>
                <div className="py-1">
                  <MenuItem>
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden"
                    >
                      Logout
                    </a>
                  </MenuItem>
                </div>
              </MenuItems>
            </Menu>
            {/* Navigation */}
            <nav className="mt-6 px-3">
              <div className="space-y-1">
                {navigation.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => handleNavigation(item.id)}
                    aria-current={currentView === item.id ? 'page' : undefined}
                    className={classNames(
                      currentView === item.id ? 'bg-gray-200 text-gray-900' : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900',
                      'group flex items-center rounded-md px-2 py-2 text-sm font-medium w-full text-left',
                    )}
                  >
                    <item.icon
                      aria-hidden="true"
                      className={classNames(
                        currentView === item.id ? 'text-gray-500' : 'text-gray-400 group-hover:text-gray-500',
                        'mr-3 size-6 shrink-0',
                      )}
                    />
                    {item.name}
                  </button>
                ))}
              </div>
              <div className="mt-8">
                <h3 id="desktop-teams-headline" className="px-3 text-sm font-medium text-gray-500">
                  Teams
                </h3>
                <div role="group" aria-labelledby="desktop-teams-headline" className="mt-1 space-y-1">
                  {teams.map((team) => (
                    <a
                      key={team.name}
                      href={team.href}
                      className="group flex items-center rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                    >
                      <span
                        aria-hidden="true"
                        className={classNames(team.bgColorClass, 'mr-4 size-2.5 rounded-full')}
                      />
                      <span className="truncate">{team.name}</span>
                    </a>
                  ))}
                </div>
              </div>
            </nav>
          </div>
        </div>
        
        {/* Main column */}
        <div className="flex flex-col lg:pl-64">
          {/* Search header */}
          <div className="sticky top-0 z-10 flex h-16 shrink-0 border-b border-gray-200 bg-white lg:hidden">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="border-r border-gray-200 px-4 text-gray-500 focus:ring-2 focus:ring-purple-500 focus:outline-hidden focus:ring-inset lg:hidden"
            >
              <span className="sr-only">Open sidebar</span>
              <Bars3CenterLeftIcon aria-hidden="true" className="size-6" />
            </button>
            <div className="flex flex-1 justify-between px-4 sm:px-6 lg:px-8">
              <form action="#" method="GET" className="grid w-full flex-1 grid-cols-1">
                <input
                  name="search"
                  type="search"
                  placeholder="Search"
                  aria-label="Search"
                  className="col-start-1 row-start-1 block size-full rounded-md bg-white py-2 pr-3 pl-8 text-base text-gray-900 outline-hidden placeholder:text-gray-400 sm:text-sm/6"
                />
                <MagnifyingGlassIcon
                  aria-hidden="true"
                  className="pointer-events-none col-start-1 row-start-1 size-5 self-center text-gray-400"
                />
              </form>
              <div className="flex items-center">
                <Menu as="div" className="relative ml-3">
                  <MenuButton className="relative flex max-w-xs items-center rounded-full bg-white text-sm focus:outline-hidden focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2">
                    <span className="absolute -inset-1.5" />
                    <span className="sr-only">Open user menu</span>
                    <div className="size-8 rounded-full bg-purple-600 flex items-center justify-center text-white font-medium text-xs">
                      DT
                    </div>
                  </MenuButton>

                  <MenuItems
                    transition
                    className="absolute right-0 z-10 mt-2 w-48 origin-top-right divide-y divide-gray-200 rounded-md bg-white shadow-lg ring-1 ring-black/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
                  >
                    <div className="py-1">
                      <MenuItem>
                        <a
                          href="#"
                          className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden"
                        >
                          View profile
                        </a>
                      </MenuItem>
                      <MenuItem>
                        <a
                          href="#"
                          className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden"
                        >
                          Settings
                        </a>
                      </MenuItem>
                      <MenuItem>
                        <a
                          href="#"
                          className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden"
                        >
                          Notifications
                        </a>
                      </MenuItem>
                    </div>
                    <div className="py-1">
                      <MenuItem>
                        <a
                          href="#"
                          className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden"
                        >
                          Get desktop app
                        </a>
                      </MenuItem>
                      <MenuItem>
                        <a
                          href="#"
                          className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden"
                        >
                          Support
                        </a>
                      </MenuItem>
                    </div>
                    <div className="py-1">
                      <MenuItem>
                        <a
                          href="#"
                          className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden"
                        >
                          Logout
                        </a>
                      </MenuItem>
                    </div>
                  </MenuItems>
                </Menu>
              </div>
            </div>
          </div>
          
          <main className="flex-1">
            {/* Page title & actions */}
            <div className="border-b border-gray-200 px-4 py-4 sm:flex sm:items-center sm:justify-between sm:px-6 lg:px-8">
              <div className="min-w-0 flex-1 flex items-center justify-center sm:justify-start">
                {selectedProjectId ? (
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={handleBackToProjects}
                      className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                    >
                      <ArrowLeftIcon className="h-4 w-4 mr-2" />
                      Back to Projects
                    </button>
                    <h1 className="text-lg/6 font-medium text-gray-900 sm:truncate">
                      {selectedProject?.name || 'Project Details'}
                    </h1>
                  </div>
                ) : (
                  <h1 className="text-lg/6 font-medium text-gray-900 sm:truncate text-center sm:text-left">
                    {currentView === 'projects' ? 'Projects' : 
                     currentView === 'tasks' ? 'My Tasks' : 
                     'Recent'}
                  </h1>
                )}
              </div>
              {!selectedProjectId && currentView === 'projects' && (
              <div className="mt-4 flex sm:mt-0 sm:ml-4">
              <input
  type="text"
  placeholder="Search projects"
  value={searchQuery}
  onChange={handleSearch}
  className="order-1 ml-3 block rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-xs ring-1 ring-gray-300 ring-inset placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 sm:order-0 sm:ml-0"
/>
                <button
                  type="button"
                    onClick={handleNewProject}
                  className="order-0 inline-flex items-center rounded-md bg-purple-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-purple-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600 sm:order-1 sm:ml-3"
                >
                  New Project
                </button>
              </div>
              )}
            </div>
            
            {/* Conditional content: Project Details or Projects List */}
            {selectedProjectId ? (
              /* Project Details View */
              <div className="px-4 py-6 sm:px-6 lg:px-8">
                {projectLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
                  </div>
                ) : selectedProject ? (
                  <div className="space-y-6">
                    {/* Project Info Card */}
                    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                      <div className="px-4 py-5 sm:px-6">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                          {selectedProject.name}
                        </h3>
                        <p className="mt-1 max-w-2xl text-sm text-gray-500">
                          {selectedProject.description || 'No description provided'}
                        </p>
                        <div className="mt-4 flex items-center space-x-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(selectedProject.priority)}`}>
                            {selectedProject.priority} priority
                          </span>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getProjectStatusColor(selectedProject.status || 'planning')}`}>
                            {(selectedProject.status || 'planning').replace('_', ' ')}
                          </span>
                          <span className="text-sm text-gray-500">
                            Created by {selectedProject.creator_name} {selectedProject.creator_last_name}
                          </span>
                          <span className="text-sm text-gray-500">
                            {selectedProject.members?.length || 0} members
                          </span>
                        </div>
                        
                        {/* Project Actions */}
                        <div className="mt-4 flex items-center space-x-3">
                          <select
                            value={selectedProject.status || 'planning'}
                            onChange={(e) => handleStatusUpdate(selectedProject.id, e.target.value)}
                            className="text-sm border-gray-300 rounded-md"
                          >
                            <option value="planning">Planning</option>
                            <option value="active">In Progress</option>
                            <option value="completed">Completed</option>
                            <option value="on_hold">On Hold</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                          <button 
                            onClick={() => handleDeleteProject(selectedProject.id)}
                            className="inline-flex items-center px-3 py-1 border border-red-300 text-sm leading-4 font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                          >
                            Delete Project
                          </button>
                        </div>
                      </div>

                      {/* Project Members */}
                      {selectedProject.members && selectedProject.members.length > 0 && (
                        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                          <h4 className="text-sm font-medium text-gray-900 mb-3">Team Members</h4>
                          <div className="flex flex-wrap gap-2">
                            {selectedProject.members.map((member) => (
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
                            Tasks ({selectedProject.tasks?.length || 0})
                          </h3>
                          <button
                            onClick={() => setShowNewTaskModal(true)}
                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                          >
                            <PlusIcon className="h-4 w-4 mr-1" />
                            Add Task
                          </button>
                        </div>
                      </div>

                      {/* Tasks List */}
                      <div className="divide-y divide-gray-200">
                        {selectedProject.tasks && selectedProject.tasks.length > 0 ? (
                          selectedProject.tasks.map((task) => (
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
                              onClick={() => setShowNewTaskModal(true)}
                              className="mt-2 text-purple-600 hover:text-purple-500"
                            >
                              Add the first task
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-500">Failed to load project details</p>
                  </div>
                )}
              </div>
            ) : currentView === 'tasks' ? (
              /* My Tasks View */
              <div className="px-4 py-6 sm:px-6 lg:px-8">
                {tasksLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
                  </div>
                ) : userTasks.length > 0 ? (
                  <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                    <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">
                        My Assigned Tasks ({userTasks.length})
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Tasks assigned to you across all projects
                      </p>
                    </div>
                    <div className="divide-y divide-gray-200">
                      {userTasks.map((task) => (
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
                                <span>Project: {task.project_name}</span>
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
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="mx-auto h-12 w-12 text-gray-400">
                      <Bars4Icon className="h-12 w-12" />
                    </div>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No tasks assigned</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Tasks will appear here when you're assigned to them in projects.
                    </p>
                    <div className="mt-6">
                      <button
                        onClick={() => handleNavigation('projects')}
                        className="inline-flex items-center rounded-md bg-purple-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-purple-500"
                      >
                        <PlusIcon className="-ml-0.5 mr-1.5 h-5 w-5" />
                        View Projects
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : currentView === 'recent' ? (
              /* Recent View */
              <div className="px-4 py-6 sm:px-6 lg:px-8">
                <div className="text-center py-12">
                  <div className="mx-auto h-12 w-12 text-gray-400">
                    <ClockIcon className="h-12 w-12" />
                  </div>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No recent activity</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Your recent projects and tasks will appear here.
                  </p>
                </div>
              </div>
            ) : (
              /* Projects List View */
              <>
            {/* Pinned projects */}
            <div className="mt-6 px-4 sm:px-6 lg:px-8">
              <h2 className="text-sm font-medium text-gray-900">Pinned Projects</h2>
              <ul role="list" className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 xl:grid-cols-4">
                {pinnedProjects.map((project) => (
                  <li key={project.id} className="relative col-span-1 flex rounded-md shadow-xs">
                    <div
                      className={classNames(
                        project.bgColorClass,
                        'flex w-16 shrink-0 items-center justify-center rounded-l-md text-sm font-medium text-white',
                      )}
                    >
                      {project.initials}
                    </div>
                    <div className="flex flex-1 items-center justify-between truncate rounded-r-md border-t border-r border-b border-gray-200 bg-white">
                      <div className="flex-1 truncate px-4 py-2 text-sm">
                            <button onClick={() => handleProjectClick(project.id)} className="font-medium text-gray-900 hover:text-gray-600">
                          {project.title}
                            </button>
                        <p className="text-gray-500">{project.totalMembers} Members</p>
                      </div>
                      <Menu as="div" className="shrink-0 pr-2">
                        <MenuButton className="inline-flex size-8 items-center justify-center rounded-full bg-white text-gray-400 hover:text-gray-500 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2">
                          <span className="sr-only">Open options</span>
                          <EllipsisVerticalIcon aria-hidden="true" className="size-5" />
                        </MenuButton>
                        <MenuItems
                          transition
                          className="absolute top-3 right-10 z-10 mx-3 mt-1 w-48 origin-top-right divide-y divide-gray-200 rounded-md bg-white shadow-lg ring-1 ring-black/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
                        >
                          <div className="py-1">
                            <MenuItem>
                                  <button
                                    onClick={() => handleProjectClick(project.id)}
                                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden"
                              >
                                View
                                  </button>
                            </MenuItem>
                          </div>
                          <div className="py-1">
                            <MenuItem>
                              <a
                                href="#"
                                className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden"
                              >
                                Removed from pinned
                              </a>
                            </MenuItem>
                            <MenuItem>
                              <a
                                href="#"
                                className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden"
                              >
                                Share
                              </a>
                            </MenuItem>
                          </div>
                        </MenuItems>
                      </Menu>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Projects table (small breakpoint and up) */}
            <div className="mt-8 hidden sm:block">
              <div className="inline-block min-w-full border-b border-gray-200 align-middle">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-t border-gray-200">
                      <th
                        scope="col"
                        className="border-b border-gray-200 bg-gray-50 px-6 py-3 text-left text-sm font-semibold text-gray-900"
                      >
                        <span className="lg:pl-2">Project</span>
                      </th>
                      <th
                        scope="col"
                        className="border-b border-gray-200 bg-gray-50 px-6 py-3 text-left text-sm font-semibold text-gray-900"
                      >
                        Members
                      </th>
                      <th
                        scope="col"
                        className="hidden border-b border-gray-200 bg-gray-50 px-6 py-3 text-center text-sm font-semibold text-gray-900 md:table-cell"
                      >
                        Status
                      </th>
                      <th
                        scope="col"
                        className="hidden border-b border-gray-200 bg-gray-50 px-6 py-3 text-right text-sm font-semibold text-gray-900 md:table-cell"
                      >
                        Last updated
                      </th>
                      <th
                        scope="col"
                        className="border-b border-gray-200 bg-gray-50 py-3 pr-6 text-right text-sm font-semibold text-gray-900"
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 bg-white">
                    {projects.map((project) => (
                      <tr key={project.id}>
                        <td className="w-full max-w-0 px-6 py-3 text-sm font-medium whitespace-nowrap text-gray-900">
                          <div className="flex items-center space-x-3 lg:pl-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleTogglePin(project.id, project.pinned)
                              }}
                              className="text-gray-400 hover:text-yellow-500"
                            >
                              {project.pinned ? (
                                <StarIconSolid className="h-4 w-4 text-yellow-500" />
                              ) : (
                                <StarIconOutline className="h-4 w-4" />
                              )}
                            </button>
                            <div
                              aria-hidden="true"
                              className={classNames(project.bgColorClass, 'size-2.5 shrink-0 rounded-full')}
                            />
                            <button onClick={() => handleProjectClick(project.id)} className="truncate hover:text-gray-600">
                              <span>
                                {project.title} <span className="font-normal text-gray-500">in {project.team}</span>
                              </span>
                            </button>
                          </div>
                        </td>
                        <td className="px-6 py-3 text-sm font-medium text-gray-500">
                              <span>+{project.totalMembers}</span>
                        </td>
                        <td className="hidden px-6 py-3 text-center text-sm whitespace-nowrap text-gray-500 md:table-cell">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getProjectStatusColor(project.status || 'planning')}`}>
                            {(project.status || 'planning').replace('_', ' ')}
                              </span>
                        </td>
                        <td className="hidden px-6 py-3 text-right text-sm whitespace-nowrap text-gray-500 md:table-cell">
                          {project.lastUpdated}
                        </td>
                        <td className="px-6 py-3 text-right text-sm font-medium whitespace-nowrap">
                          <select
                            value={project.status || 'planning'}
                            onChange={(e) => handleStatusUpdate(project.id, e.target.value)}
                            className="text-xs border-gray-300 rounded-md"
                          >
                            <option value="planning">Planning</option>
                            <option value="active">In Progress</option>
                            <option value="completed">Completed</option>
                            <option value="on_hold">On Hold</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
              </>
            )}
          </main>
        </div>
      </div>

      {/* New Project Modal */}
      <NewProjectModal 
        isOpen={showNewProjectModal}
        onClose={() => setShowNewProjectModal(false)}
        onProjectCreated={handleProjectCreated}
      />

      {/* New Task Modal */}
      <NewTaskModal 
        isOpen={showNewTaskModal}
        onClose={() => setShowNewTaskModal(false)}
        onTaskCreated={handleTaskCreated}
        projectId={selectedProjectId}
      />
    </>
  )
}