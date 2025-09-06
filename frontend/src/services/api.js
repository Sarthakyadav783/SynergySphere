const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5001';
const API_BASE_URL = `${BACKEND_URL}/api`;

export const projectsAPI = {
  // Get all projects
  getAll: async (search = '') => {
    const url = search ? `${API_BASE_URL}/projects?search=${search}` : `${API_BASE_URL}/projects`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch projects');
    return response.json();
  },

  // Get specific project
  getById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/projects/${id}`);
    if (!response.ok) throw new Error('Failed to fetch project');
    return response.json();
  },

  // Create new project
  create: async (projectData) => {
    const response = await fetch(`${API_BASE_URL}/projects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(projectData)
    });
    if (!response.ok) throw new Error('Failed to create project');
    return response.json();
  }
};

export const tasksAPI = {
  // Get tasks for project
  getByProject: async (projectId) => {
    const response = await fetch(`${API_BASE_URL}/tasks/project/${projectId}`);
    if (!response.ok) throw new Error('Failed to fetch tasks');
    return response.json();
  },

  // Get user's tasks
  getMyTasks: async (userId) => {
    const response = await fetch(`${API_BASE_URL}/tasks/my-tasks/${userId}`);
    if (!response.ok) throw new Error('Failed to fetch user tasks');
    return response.json();
  }
};

export const usersAPI = {
  // Get all users
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/users`);
    if (!response.ok) throw new Error('Failed to fetch users');
    return response.json();
  },

  // Get specific user
  getById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/users/${id}`);
    if (!response.ok) throw new Error('Failed to fetch user');
    return response.json();
  }
};