import { useState, useEffect } from 'react'
import { projectsAPI } from '../services/api'
import ProjectDetails from '../components/ProjectDetails'
import NewProjectModal from '../components/NewProjectModal'
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

const navigation = [
  { name: 'My Projects', href: '#', icon: HomeIcon, current: true },
  { name: 'My tasks', href: '#', icon: Bars4Icon, current: false },
  { name: 'Recent', href: '#', icon: ClockIcon, current: false },
]
const teams = [
  { name: 'Engineering', href: '#', bgColorClass: 'bg-indigo-500' },
  { name: 'Human Resources', href: '#', bgColorClass: 'bg-green-500' },
  { name: 'Customer Success', href: '#', bgColorClass: 'bg-yellow-500' },
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
  const [showNewProjectModal, setShowNewProjectModal] = useState(false)

  // Fetch projects on component mount
  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async (search = '') => {
    try {
      setLoading(true)
      const data = await projectsAPI.getAll(search)
      
      // Transform backend data to match frontend format
      const transformedProjects = data.map(project => ({
        id: project.id,
        title: project.name,
        initials: project.name.substring(0, 2).toUpperCase(),
        team: 'Engineering',
        members: [],
        totalMembers: project.member_count || 0,
        lastUpdated: new Date(project.last_updated || project.created_at).toLocaleDateString(),
        pinned: false,
        bgColorClass: getRandomBgColor(),
        description: project.description,
        priority: project.priority,
        task_count: project.task_count || 0
      }))
      
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

  const handleProjectClick = (projectId) => {
    console.log('Project clicked:', projectId)
    setSelectedProjectId(projectId)
  }

  const handleNewProject = () => {
    setShowNewProjectModal(true)
  }

  const handleProjectCreated = () => {
    // Refresh the projects list
    fetchProjects()
  }

  const handleBackToProjects = () => {
    setSelectedProjectId(null)
  }

  const pinnedProjects = projects.filter((project) => project.pinned)

  // Show project details if a project is selected
  if (selectedProjectId) {
    return (
      <ProjectDetails 
        projectId={selectedProjectId} 
        onBack={handleBackToProjects}
      />
    )
  }

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
                <img
                  alt="Your Company"
                  src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=purple&shade=500"
                  className="h-8 w-auto"
                />
              </div>
              <div className="mt-5 h-0 flex-1 overflow-y-auto">
                <nav className="px-2">
                  <div className="space-y-1">
                    {navigation.map((item) => (
                      <a
                        key={item.name}
                        href={item.href}
                        aria-current={item.current ? 'page' : undefined}
                        className={classNames(
                          item.current
                            ? 'bg-gray-100 text-gray-900'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                          'group flex items-center rounded-md px-2 py-2 text-base/5 font-medium',
                        )}
                      >
                        <item.icon
                          aria-hidden="true"
                          className={classNames(
                            item.current ? 'text-gray-500' : 'text-gray-400 group-hover:text-gray-500',
                            'mr-3 size-6 shrink-0',
                          )}
                        />
                        {item.name}
                      </a>
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
            <img
              alt="Your Company"
              src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=purple&shade=500"
              className="h-8 w-auto"
            />
          </div>
          <div className="mt-5 flex h-0 flex-1 flex-col overflow-y-auto pt-1">
            {/* User account dropdown */}
            <Menu as="div" className="relative inline-block px-3 text-left">
              <MenuButton className="group w-full rounded-md bg-gray-100 px-3.5 py-2 text-left text-sm font-medium text-gray-700 hover:bg-gray-200 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-100">
                <span className="flex w-full items-center justify-between">
                  <span className="flex min-w-0 items-center justify-between space-x-3">
                    <img
                      alt=""
                      src="https://images.unsplash.com/photo-1502685104226-ee32379fefbe?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=3&w=256&h=256&q=80"
                      className="size-10 shrink-0 rounded-full bg-gray-300"
                    />
                    <span className="flex min-w-0 flex-1 flex-col">
                      <span className="truncate text-sm font-medium text-gray-900">Jessy Schwarz</span>
                      <span className="truncate text-sm text-gray-500">@jessyschwarz</span>
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
                  <a
                    key={item.name}
                    href={item.href}
                    aria-current={item.current ? 'page' : undefined}
                    className={classNames(
                      item.current ? 'bg-gray-200 text-gray-900' : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900',
                      'group flex items-center rounded-md px-2 py-2 text-sm font-medium',
                    )}
                  >
                    <item.icon
                      aria-hidden="true"
                      className={classNames(
                        item.current ? 'text-gray-500' : 'text-gray-400 group-hover:text-gray-500',
                        'mr-3 size-6 shrink-0',
                      )}
                    />
                    {item.name}
                  </a>
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
                    <img
                      alt=""
                      src="https://images.unsplash.com/photo-1502685104226-ee32379fefbe?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                      className="size-8 rounded-full"
                    />
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
              <div className="min-w-0 flex-1">
                <h1 className="text-lg/6 font-medium text-gray-900 sm:truncate">Projects</h1>
              </div>
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
            </div>
            
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
                        className="hidden border-b border-gray-200 bg-gray-50 px-6 py-3 text-right text-sm font-semibold text-gray-900 md:table-cell"
                      >
                        Last updated
                      </th>
                      <th
                        scope="col"
                        className="border-b border-gray-200 bg-gray-50 py-3 pr-6 text-right text-sm font-semibold text-gray-900"
                      />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 bg-white">
                    {projects.map((project) => (
                      <tr key={project.id}>
                        <td className="w-full max-w-0 px-6 py-3 text-sm font-medium whitespace-nowrap text-gray-900">
                          <div className="flex items-center space-x-3 lg:pl-2">
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
                        <td className="hidden px-6 py-3 text-right text-sm whitespace-nowrap text-gray-500 md:table-cell">
                          {project.lastUpdated}
                        </td>
                        <td className="px-6 py-3 text-right text-sm font-medium whitespace-nowrap">
                          <button onClick={() => handleProjectClick(project.id)} className="text-indigo-600 hover:text-indigo-900">
                            Edit
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* New Project Modal */}
      <NewProjectModal 
        isOpen={showNewProjectModal}
        onClose={() => setShowNewProjectModal(false)}
        onProjectCreated={handleProjectCreated}
      />
    </>
  )
}