const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5001';
const API_BASE_URL = `${BACKEND_URL}/api`;
   // Temporary fix for mixed content
   if (window.location.protocol === 'https:') {
    window.location.href = window.location.href.replace('https:', 'http:');
  }
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
  },

  // Update project status
  updateStatus: async (id, status) => {
    const response = await fetch(`${API_BASE_URL}/projects/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    if (!response.ok) throw new Error('Failed to update project status');
    return response.json();
  },

  // Toggle project pin status
  togglePin: async (id, pinned) => {
    const response = await fetch(`${API_BASE_URL}/projects/${id}/pin`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pinned })
    });
    if (!response.ok) throw new Error('Failed to update pin status');
    return response.json();
  },

  // Delete project
  delete: async (id) => {
    const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Failed to delete project');
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
  },

  // Create new task
  create: async (taskData) => {
    const response = await fetch(`${API_BASE_URL}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(taskData)
    });
    if (!response.ok) throw new Error('Failed to create task');
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