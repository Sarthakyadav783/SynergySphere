const express = require('express');
const router = express.Router();
const { getMany, executeQuery, insert, update } = require('../config/database');

// Get all tasks for a specific project
router.get('/project/:projectId', async (req, res) => {
  try {
    const { projectId } = req.params;
    
    const tasks = await getMany(`
      SELECT t.*, 
             assignee.first_name as assignee_name,
             assignee.last_name as assignee_last_name,
             creator.first_name as creator_name,
             p.name as project_name
      FROM tasks t 
      LEFT JOIN users assignee ON t.assigned_to = assignee.id
      LEFT JOIN users creator ON t.created_by = creator.id
      LEFT JOIN projects p ON t.project_id = p.id
      WHERE t.project_id = ?
      ORDER BY t.created_at DESC
    `, [projectId]);
    
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user's assigned tasks (for "My Tasks" page)
router.get('/my-tasks/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const tasks = await getMany(`
      SELECT t.*, 
             p.name as project_name,
             creator.first_name as creator_name
      FROM tasks t 
      JOIN projects p ON t.project_id = p.id
      LEFT JOIN users creator ON t.created_by = creator.id
      WHERE t.assigned_to = ?
      ORDER BY t.due_date ASC, t.created_at DESC
    `, [userId]);
    
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get specific task details
router.get('/:taskId', async (req, res) => {
  try {
    const { taskId } = req.params;
    
    const task = await getMany(`
      SELECT t.*, 
             assignee.first_name as assignee_name,
             assignee.last_name as assignee_last_name,
             assignee.email as assignee_email,
             creator.first_name as creator_name,
             creator.last_name as creator_last_name,
             p.name as project_name
      FROM tasks t 
      LEFT JOIN users assignee ON t.assigned_to = assignee.id
      LEFT JOIN users creator ON t.created_by = creator.id
      LEFT JOIN projects p ON t.project_id = p.id
      WHERE t.id = ?
    `, [taskId]);
    
    if (task.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    res.json(task[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new task
router.post('/', async (req, res) => {
  try {
    const { project_id, title, description, assigned_to, due_date, priority, tags, created_by } = req.body;
    
    const taskId = await insert('tasks', {
      project_id,
      title,
      description,
      assigned_to,
      due_date,
      priority: priority || 'medium',
      tags: tags ? JSON.stringify(tags) : null,
      created_by: created_by || 1
    });
    
    res.status(201).json({ id: taskId, message: 'Task created successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update task
router.put('/:taskId', async (req, res) => {
  try {
    const { taskId } = req.params;
    const updateData = req.body;
    
    if (updateData.tags) {
      updateData.tags = JSON.stringify(updateData.tags);
    }
    
    await update('tasks', updateData, 'id = ?', [taskId]);
    res.json({ message: 'Task updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete task
router.delete('/:taskId', async (req, res) => {
  try {
    const { taskId } = req.params;
    await executeQuery('DELETE FROM tasks WHERE id = ?', [taskId]);
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
