const express = require('express');
const router = express.Router();
const { getMany, executeQuery, insert, update } = require('../config/database');

// Get all projects with search functionality
router.get('/', async (req, res) => {
  try {
    const { search } = req.query;
    
    let sql = `
      SELECT p.*, 
             u.first_name as creator_name,
             u.last_name as creator_last_name,
             COUNT(DISTINCT pm.user_id) as member_count,
             COUNT(DISTINCT t.id) as task_count,
             p.updated_at as last_updated
      FROM projects p 
      JOIN users u ON p.created_by = u.id
      LEFT JOIN project_members pm ON p.id = pm.project_id
      LEFT JOIN tasks t ON p.id = t.project_id
    `;
    
    let params = [];
    
    if (search) {
      sql += ` WHERE p.name LIKE ? OR p.id = ?`;
      params = [`%${search}%`, search];
    }
    
    sql += ` GROUP BY p.id ORDER BY p.updated_at DESC`;
    
    const projects = await getMany(sql, params);
    
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get specific project with full details
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get project details
    const project = await getMany(`
      SELECT p.*, 
             u.first_name as creator_name,
             u.last_name as creator_last_name
      FROM projects p 
      JOIN users u ON p.created_by = u.id
      WHERE p.id = ?
    `, [id]);
    
    if (project.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    // Get project members
    const members = await getMany(`
      SELECT u.id, u.first_name, u.last_name, u.email, pm.role
      FROM project_members pm
      JOIN users u ON pm.user_id = u.id
      WHERE pm.project_id = ?
    `, [id]);
    
    // Get project tasks with assignee info
    const tasks = await getMany(`
      SELECT t.*, 
             assignee.first_name as assignee_name,
             assignee.last_name as assignee_last_name,
             creator.first_name as creator_name
      FROM tasks t 
      LEFT JOIN users assignee ON t.assigned_to = assignee.id
      LEFT JOIN users creator ON t.created_by = creator.id
      WHERE t.project_id = ?
      ORDER BY t.created_at DESC
    `, [id]);
    
    res.json({ 
      ...project[0], 
      members, 
      tasks,
      task_count: tasks.length
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new project
router.post('/', async (req, res) => {
  try {
    const { name, description, tags, priority, deadline, project_manager, image, created_by } = req.body;
    
    const projectId = await insert('projects', {
      name,
      description,
      tags: tags ? JSON.stringify(tags) : null,
      priority: priority || 'medium',
      deadline,
      image_url: image,
      project_manager,
      created_by: created_by || 1
    });
    
    // Add creator as project member
    await insert('project_members', {
      project_id: projectId,
      user_id: created_by || 1,
      role: 'owner'
    });
    
    // Add project manager as member if different from creator
    if (project_manager && project_manager !== (created_by || 1)) {
      await insert('project_members', {
        project_id: projectId,
        user_id: project_manager,
        role: 'manager'
      });
    }
    
    res.status(201).json({ id: projectId, message: 'Project created successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update project
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    if (updateData.tags) {
      updateData.tags = JSON.stringify(updateData.tags);
    }
    
    await update('projects', updateData, 'id = ?', [id]);
    res.json({ message: 'Project updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete project
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await executeQuery('DELETE FROM projects WHERE id = ?', [id]);
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;