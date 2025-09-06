-- Add project_manager column to existing projects table
ALTER TABLE projects ADD COLUMN project_manager INT DEFAULT NULL;
ALTER TABLE projects ADD FOREIGN KEY (project_manager) REFERENCES users(id) ON DELETE SET NULL;
ALTER TABLE projects ADD INDEX idx_project_manager (project_manager);
