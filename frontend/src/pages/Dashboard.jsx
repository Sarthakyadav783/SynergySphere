import { useState } from 'react'
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
import Mytasks from '../components/Mytasks' // <-- Import Mytasks

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
const projects = [
  {
    id: 1,
    title: 'GraphQL API',
    initials: 'GA',
    team: 'Engineering',
    members: [
      {
        name: 'Dries Vincent',
        handle: 'driesvincent',
        imageUrl:
          'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      },
      {
        name: 'Lindsay Walton',
        handle: 'lindsaywalton',
        imageUrl:
          'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      },
      {
        name: 'Courtney Henry',
        handle: 'courtneyhenry',
        imageUrl:
          'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      },
      {
        name: 'Tom Cook',
        handle: 'tomcook',
        imageUrl:
          'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      },
    ],
    totalMembers: 12,
    lastUpdated: 'March 17, 2020',
    pinned: true,
    bgColorClass: 'bg-pink-600',
  },
  {
    id: 2,
    title: 'New Benefits Plan',
    initials: 'NB',
    team: 'Human Resources',
    members: [
      {
        name: 'Leonard Krasner',
        handle: 'leonardkrasner',
        imageUrl:
          'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      },
      {
        name: 'Floyd Miles',
        handle: 'floydmiles',
        imageUrl:
          'https://images.unsplash.com/photo-1463453091185-61582044d556?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      },
      {
        name: 'Emily Selman',
        handle: 'emilyselman',
        imageUrl:
          'https://images.unsplash.com/photo-1502685104226-ee32379fefbe?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      },
      {
        name: 'Kristin Watson',
        handle: 'kristinwatson',
        imageUrl:
          'https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      },
    ],
    totalMembers: 8,
    lastUpdated: 'April 4, 2020',
    pinned: true,
    bgColorClass: 'bg-purple-600',
  },
  {
    id: 3,
    title: 'Onboarding Emails',
    initials: 'OE',
    team: 'Customer Success',
    members: [
      {
        name: 'Emily Selman',
        handle: 'emilyselman',
        imageUrl:
          'https://images.unsplash.com/photo-1502685104226-ee32379fefbe?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      },
      {
        name: 'Kristin Watson',
        handle: 'kristinwatson',
        imageUrl:
          'https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      },
      {
        name: 'Emma Dorsey',
        handle: 'emmadorsey',
        imageUrl:
          'https://images.unsplash.com/photo-1505840717430-882ce147ef2d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      },
      {
        name: 'Alicia Bell',
        handle: 'aliciabell',
        imageUrl:
          'https://images.unsplash.com/photo-1509783236416-c9ad59bae472?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      },
    ],
    totalMembers: 14,
    lastUpdated: 'March 30, 2020',
    pinned: true,
    bgColorClass: 'bg-yellow-500',
  },
  {
    id: 4,
    title: 'iOS App',
    initials: 'IA',
    team: 'Engineering',
    members: [
      {
        name: 'Leslie Alexander',
        handle: 'lesliealexander',
        imageUrl:
          'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      },
      {
        name: 'Michael Foster',
        handle: 'michaelfoster',
        imageUrl:
          'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      },
    ],
    totalMembers: 2,
    lastUpdated: 'March 30, 2020',
    pinned: true,
    bgColorClass: 'bg-green-500',
  },
  {
    id: 5,
    title: 'Marketing Site Redesign',
    initials: 'MS',
    team: 'Engineering',
    members: [
      {
        name: 'Courtney Henry',
        handle: 'courtneyhenry',
        imageUrl:
          'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      },
      {
        name: 'Tom Cook',
        handle: 'tomcook',
        imageUrl:
          'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      },
      {
        name: 'Whitney Francis',
        handle: 'whitneyfrancis',
        imageUrl:
          'https://images.unsplash.com/photo-1517365830460-955ce3ccd263?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      },
      {
        name: 'Leonard Krasner',
        handle: 'leonardkrasner',
        imageUrl:
          'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      },
    ],
    totalMembers: 7,
    lastUpdated: 'June 17, 2020',
    pinned: false,
    bgColorClass: 'bg-pink-600',
  },
  {
    id: 6,
    title: 'Hire CFO',
    initials: 'HC',
    team: 'Human Resources',
    members: [
      {
        name: 'Alicia Bell',
        handle: 'aliciabell',
        imageUrl:
          'https://images.unsplash.com/photo-1509783236416-c9ad59bae472?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      },
      {
        name: 'Jenny Wilson',
        handle: 'jennywilson',
        imageUrl:
          'https://images.unsplash.com/photo-1507101105822-7472b28e22ac?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      },
      {
        name: 'Anna Roberts',
        handle: 'annaroberts',
        imageUrl:
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      },
      {
        name: 'Benjamin Russel',
        handle: 'benjaminrussel',
        imageUrl:
          'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      },
    ],
    totalMembers: 8,
    lastUpdated: 'July 11, 2020',
    pinned: false,
    bgColorClass: 'bg-purple-600',
  },
  {
    id: 7,
    title: 'Android App',
    initials: 'AA',
    team: 'Engineering',
    members: [
      {
        name: 'Benjamin Russel',
        handle: 'benjaminrussel',
        imageUrl:
          'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      },
      {
        name: 'Jeffrey Webb',
        handle: 'jeffreywebb',
        imageUrl:
          'https://images.unsplash.com/photo-1517070208541-6ddc4d3efbcb?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      },
      {
        name: 'Kathryn Murphy',
        handle: 'kathrynmurphy',
        imageUrl:
          'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      },
      {
        name: 'Lawrence Hunter',
        handle: 'lawrencehunter',
        imageUrl:
          'https://images.unsplash.com/photo-1513910367299-bce8d8a0ebf6?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      },
    ],
    totalMembers: 12,
    lastUpdated: 'July 17, 2020',
    pinned: false,
    bgColorClass: 'bg-yellow-500',
  },
  {
    id: 8,
    title: 'New Customer Portal',
    initials: 'NC',
    team: 'Engineering',
    members: [
      {
        name: 'Yvette Armstrong',
        handle: 'yvettearmstrong',
        imageUrl:
          'https://images.unsplash.com/photo-1506980595904-70325b7fdd90?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      },
      {
        name: 'Angela Fisher',
        handle: 'angelafisher',
        imageUrl:
          'https://images.unsplash.com/photo-1501031170107-cfd33f0cbdcc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      },
      {
        name: 'Blake Reid',
        handle: 'blakereid',
        imageUrl:
          'https://images.unsplash.com/photo-1520785643438-5bf77931f493?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      },
      {
        name: 'Hector Gibbons',
        handle: 'hectorgibbons',
        imageUrl:
          'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      },
    ],
    totalMembers: 4,
    lastUpdated: 'July 29, 2020',
    pinned: false,
    bgColorClass: 'bg-green-500',
  },
  {
    id: 9,
    title: 'Co-op Program',
    initials: 'CP',
    team: 'Human Resources',
    members: [
      {
        name: 'Hector Gibbons',
        handle: 'hectorgibbons',
        imageUrl:
          'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      },
      {
        name: 'Fabricio Mendes',
        handle: 'fabriciomendes',
        imageUrl:
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      },
      {
        name: 'Jillian Steward',
        handle: 'jilliansteward',
        imageUrl:
          'https://images.unsplash.com/photo-1504703395950-b89145a5425b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      },
      {
        name: 'Chelsea Hagon',
        handle: 'chelseahagon',
        imageUrl:
          'https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      },
    ],
    totalMembers: 12,
    lastUpdated: 'August 3, 2020',
    pinned: false,
    bgColorClass: 'bg-pink-600',
  },
  {
    id: 10,
    title: 'Implement NPS',
    initials: 'IN',
    team: 'Customer Success',
    members: [
      {
        name: 'Jenny Wilson',
        handle: 'jennywilson',
        imageUrl:
          'https://images.unsplash.com/photo-1507101105822-7472b28e22ac?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      },
      {
        name: 'Anna Roberts',
        handle: 'annaroberts',
        imageUrl:
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      },
      {
        name: 'Benjamin Russel',
        handle: 'benjaminrussel',
        imageUrl:
          'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      },
      {
        name: 'Jeffrey Webb',
        handle: 'jeffreywebb',
        imageUrl:
          'https://images.unsplash.com/photo-1517070208541-6ddc4d3efbcb?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      },
    ],
    totalMembers: 8,
    lastUpdated: 'August 8, 2020',
    pinned: false,
    bgColorClass: 'bg-purple-600',
  },
  {
    id: 11,
    title: 'Employee Recognition Program',
    initials: 'ER',
    team: 'Human Resources',
    members: [
      {
        name: 'Leslie Alexander',
        handle: 'lesliealexander',
        imageUrl:
          'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      },
      {
        name: 'Michael Foster',
        handle: 'michaelfoster',
        imageUrl:
          'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      },
      {
        name: 'Dries Vincent',
        handle: 'driesvincent',
        imageUrl:
          'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      },
      {
        name: 'Lindsay Walton',
        handle: 'lindsaywalton',
        imageUrl:
          'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      },
    ],
    totalMembers: 12,
    lastUpdated: 'August 14, 2020',
    pinned: false,
    bgColorClass: 'bg-yellow-500',
  },
  {
    id: 12,
    title: 'Open Source Web Client',
    initials: 'OS',
    team: 'Engineering',
    members: [
      {
        name: 'Kathryn Murphy',
        handle: 'kathrynmurphy',
        imageUrl:
          'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      },
      {
        name: 'Lawrence Hunter',
        handle: 'lawrencehunter',
        imageUrl:
          'https://images.unsplash.com/photo-1513910367299-bce8d8a0ebf6?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      },
      {
        name: 'Yvette Armstrong',
        handle: 'yvettearmstrong',
        imageUrl:
          'https://images.unsplash.com/photo-1506980595904-70325b7fdd90?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      },
      {
        name: 'Angela Fisher',
        handle: 'angelafisher',
        imageUrl:
          'https://images.unsplash.com/photo-1501031170107-cfd33f0cbdcc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      },
    ],
    totalMembers: 12,
    lastUpdated: 'September 21, 2020',
    pinned: false,
    bgColorClass: 'bg-green-500',
  },
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showTasks, setShowTasks] = useState(false) // State to toggle Mytasks
  const [navState, setNavState] = useState(navigation) // Track current selection
  const [search, setSearch] = useState('') // Add search state
  const [projectList, setProjectList] = useState(projects) // <-- Use state for projects

  // Function to handle navigation click
  function handleNavClick(item) {
    setShowTasks(item.name === 'My tasks')
    // Update navigation current state
    setNavState(navState =>
      navState.map(nav =>
        nav.name === item.name
          ? { ...nav, current: true }
          : { ...nav, current: false }
      )
    )
  }

  // Pin/unpin handler
  function handlePinToggle(id) {
    setProjectList(list =>
      list.map(project =>
        project.id === id ? { ...project, pinned: !project.pinned } : project
      )
    )
  }

  // Filter projects based on search
  const filteredProjects = projectList.filter(project =>
    project.title.toLowerCase().includes(search.toLowerCase())
  )
  const filteredPinnedProjects = filteredProjects.filter(project => project.pinned)

  return (
    <>
      {/*
        This example requires updating your template:

        ```
        <html class="h-full bg-white">
        <body class="h-full">
        ```
      */}
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
                    {navState.map((item) => (
                      <a
                        key={item.name}
                        href={item.href}
                        aria-current={item.current ? 'page' : undefined}
                        onClick={() => handleNavClick(item)}
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
          {/* Sidebar component, swap this element with another sidebar if you like */}
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
                {navState.map((item) => (
                  <a
                    key={item.name}
                    href="#"
                    aria-current={item.current ? 'page' : undefined}
                    onClick={() => handleNavClick(item)}
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
                {/* Secondary navigation */}
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
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
                <MagnifyingGlassIcon
                  aria-hidden="true"
                  className="pointer-events-none col-start-1 row-start-1 size-5 self-center text-gray-400"
                />
              </form>
              <div className="flex items-center">
                {/* Profile dropdown */}
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
            {/* Render Mytasks if showTasks is true, else show the dashboard */}
            {showTasks ? (
              <Mytasks />
            ) : (
              <>
                {/* Page title & actions */}
                <div className="border-b border-gray-200 px-4 py-4 sm:flex sm:items-center sm:justify-between sm:px-6 lg:px-8">
                  <div className="min-w-0 flex-1">
                    <h1 className="text-lg/6 font-medium text-gray-900 sm:truncate">Projects</h1>
                  </div>
                  <div className="mt-4 flex sm:mt-0 sm:ml-4">
                    <input
                      type="text"
                      placeholder="Search projects"
                      className="order-1 ml-3 block rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-xs ring-1 ring-gray-300 ring-inset placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 sm:order-0 sm:ml-0"
                      value={search}
                      onChange={e => setSearch(e.target.value)}
                    />
                    <button
                      type="button"
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
                    {filteredPinnedProjects.map((project) => (
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
                            <a href="#" className="font-medium text-gray-900 hover:text-gray-600">
                              {project.title}
                            </a>
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
                                    onClick={() => handlePinToggle(project.id)}
                                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden"
                                  >
                                    {project.pinned ? 'Unpin from pinned' : 'Pin to pinned'}
                                  </button>
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

                {/* Projects list (only on smallest breakpoint) */}
                <div className="mt-10 sm:hidden">
                  <div className="px-4 sm:px-6">
                    <h2 className="text-sm font-medium text-gray-900">Projects</h2>
                  </div>
                  <ul role="list" className="mt-3 divide-y divide-gray-100 border-t border-gray-200">
                    {filteredProjects.map((project) => (
                      <li key={project.id}>
                        <a href="#" className="group flex items-center justify-between px-4 py-4 hover:bg-gray-50 sm:px-6">
                          <span className="flex items-center space-x-3 truncate">
                            <span
                              aria-hidden="true"
                              className={classNames(project.bgColorClass, 'size-2.5 shrink-0 rounded-full')}
                            />
                            <span className="truncate text-sm/6 font-medium">
                              {project.title} <span className="truncate font-normal text-gray-500">in {project.team}</span>
                            </span>
                          </span>
                          <ChevronRightIcon
                            aria-hidden="true"
                            className="ml-4 size-5 text-gray-400 group-hover:text-gray-500"
                          />
                        </a>
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
                        {filteredProjects.map((project) => (
                          <tr key={project.id}>
                            <td className="w-full max-w-0 px-6 py-3 text-sm font-medium whitespace-nowrap text-gray-900">
                              <div className="flex items-center space-x-3 lg:pl-2">
                                <div
                                  aria-hidden="true"
                                  className={classNames(project.bgColorClass, 'size-2.5 shrink-0 rounded-full')}
                                />
                                <a href="#" className="truncate hover:text-gray-600">
                                  <span>
                                    {project.title} <span className="font-normal text-gray-500">in {project.team}</span>
                                  </span>
                                </a>
                              </div>
                            </td>
                            <td className="px-6 py-3 text-sm font-medium text-gray-500">
                              <div className="flex items-center space-x-2">
                                <div className="flex shrink-0 -space-x-1">
                                  {project.members.map((member) => (
                                    <img
                                      key={member.handle}
                                      alt={member.name}
                                      src={member.imageUrl}
                                      className="size-6 max-w-none rounded-full ring-2 ring-white"
                                    />
                                  ))}
                                </div>
                                {project.totalMembers > project.members.length ? (
                                  <span className="shrink-0 text-xs/5 font-medium">
                                    +{project.totalMembers - project.members.length}
                                  </span>
                                ) : null}
                              </div>
                            </td>
                            <td className="hidden px-6 py-3 text-right text-sm whitespace-nowrap text-gray-500 md:table-cell">
                              {project.lastUpdated}
                            </td>
                            <td className="px-6 py-3 text-right text-sm font-medium whitespace-nowrap">
                              <Menu as="div" className="relative inline-block text-left">
                                <MenuButton className="inline-flex items-center rounded-full bg-white text-gray-400 hover:text-gray-500 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2">
                                  <EllipsisVerticalIcon aria-hidden="true" className="size-5" />
                                </MenuButton>
                                <MenuItems
                                  transition
                                  className="absolute right-0 z-10 mt-2 w-40 origin-top-right divide-y divide-gray-200 rounded-md bg-white shadow-lg ring-1 ring-black/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
                                >
                                  <div className="py-1">
                                    <MenuItem>
                                      <button
                                        onClick={() => handlePinToggle(project.id)}
                                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden"
                                      >
                                        {project.pinned ? 'Unpin from pinned' : 'Pin to pinned'}
                                      </button>
                                    </MenuItem>
                                    <MenuItem>
                                      <a
                                        href="#"
                                        className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden"
                                      >
                                        Edit
                                      </a>
                                    </MenuItem>
                                  </div>
                                </MenuItems>
                              </Menu>
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
    </>
  )
}
