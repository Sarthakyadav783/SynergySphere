const express = require('express');
const cors = require('cors');
const { testConnection, getMany } = require('./config/database');

// Import routes
const projectRoutes = require('./routes/projects');
const taskRoutes = require('./routes/tasks');
const userRoutes = require('./routes/users');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors({
  origin: ['https://synergysphere.vercel.app', 'https://*.vercel.app', 'http://localhost:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Test routes
app.get('/api/health', (req, res) => {
  res.json({ message: 'SynergySphere Backend is running!' });
});

app.get('/api/db-test', async (req, res) => {
  try {
    const users = await getMany('SELECT * FROM users');
    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API Routes (no auth for now)
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/users', userRoutes);

// Test database connection on startup
testConnection();

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});
