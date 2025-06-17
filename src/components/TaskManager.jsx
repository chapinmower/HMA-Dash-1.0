import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Card,
  CardContent,
  CardActions,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Checkbox,
  LinearProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Alert,
  Snackbar,
  Divider,
  Autocomplete,
  FormControlLabel,
  Switch
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  ExpandMore as ExpandMoreIcon,
  PlayArrow as PlayArrowIcon,
  Pause as PauseIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  Link as LinkIcon,
  DragIndicator as DragIndicatorIcon,
  Timeline as TimelineIcon,
  Assignment as AssignmentIcon,
  AccountTree as DependencyIcon
} from '@mui/icons-material';

import TaskDependencyView from './TaskDependencyView';

const TaskManager = () => {
  const [projects, setProjects] = useState([]);
  const [activeTab, setActiveTab] = useState(0); // 0=Pipeline, 1=Ongoing, 2=Completed, 3=Dependencies
  const [editingProject, setEditingProject] = useState(null);
  const [editingTask, setEditingTask] = useState(null);
  const [newProjectDialog, setNewProjectDialog] = useState(false);
  const [newTaskDialog, setNewTaskDialog] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Project form state
  const [projectForm, setProjectForm] = useState({
    name: '',
    description: '',
    status: 'Pipeline',
    priority: 'Medium',
    startDate: '',
    endDate: '',
    assignedTo: '',
    category: 'Marketing'
  });

  // Task form state
  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    status: 'Not Started',
    priority: 'Medium',
    dueDate: '',
    estimatedHours: '',
    assignedTo: '',
    dependencies: [],
    tags: []
  });

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      // Load from localStorage first, then fallback to JSON
      const localData = localStorage.getItem('hma_projects');
      if (localData) {
        setProjects(JSON.parse(localData));
      } else {
        // Try enhanced projects first, fallback to regular projects
        try {
          const response = await fetch('/data/enhanced_projects.json');
          const data = await response.json();
          setProjects(data.projects || []);
        } catch {
          const response = await fetch('/data/projects.json');
          const data = await response.json();
          setProjects(data.projects || []);
        }
      }
    } catch (error) {
      console.error('Error loading projects:', error);
      setSnackbar({ open: true, message: 'Error loading projects', severity: 'error' });
    }
  };

  const saveProjects = (updatedProjects) => {
    setProjects(updatedProjects);
    localStorage.setItem('hma_projects', JSON.stringify(updatedProjects));
  };

  const handleCreateProject = () => {
    const newProject = {
      id: Date.now(),
      ...projectForm,
      tasks: [],
      completionPercentage: 0,
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString()
    };

    const updatedProjects = [...projects, newProject];
    saveProjects(updatedProjects);
    setNewProjectDialog(false);
    setProjectForm({
      name: '',
      description: '',
      status: 'Pipeline',
      priority: 'Medium',
      startDate: '',
      endDate: '',
      assignedTo: '',
      category: 'Marketing'
    });
    setSnackbar({ open: true, message: 'Project created successfully!', severity: 'success' });
  };

  const handleUpdateProject = (projectId, updates) => {
    const updatedProjects = projects.map(project => 
      project.id === projectId 
        ? { ...project, ...updates, lastUpdated: new Date().toISOString() }
        : project
    );
    saveProjects(updatedProjects);
    setEditingProject(null);
    setSnackbar({ open: true, message: 'Project updated successfully!', severity: 'success' });
  };

  const handleCreateTask = () => {
    const newTask = {
      id: Date.now(),
      ...taskForm,
      projectId: selectedProjectId,
      progress: 0,
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString()
    };

    const updatedProjects = projects.map(project => {
      if (project.id === selectedProjectId) {
        const updatedTasks = [...(project.tasks || []), newTask];
        const completionPercentage = calculateProjectCompletion(updatedTasks);
        return {
          ...project,
          tasks: updatedTasks,
          completionPercentage,
          lastUpdated: new Date().toISOString()
        };
      }
      return project;
    });

    saveProjects(updatedProjects);
    setNewTaskDialog(false);
    setSelectedProjectId(null);
    setTaskForm({
      title: '',
      description: '',
      status: 'Not Started',
      priority: 'Medium',
      dueDate: '',
      estimatedHours: '',
      assignedTo: '',
      dependencies: [],
      tags: []
    });
    setSnackbar({ open: true, message: 'Task created successfully!', severity: 'success' });
  };

  const handleUpdateTask = (projectId, taskId, updates) => {
    const updatedProjects = projects.map(project => {
      if (project.id === projectId) {
        const updatedTasks = project.tasks.map(task =>
          task.id === taskId 
            ? { ...task, ...updates, lastUpdated: new Date().toISOString() }
            : task
        );
        const completionPercentage = calculateProjectCompletion(updatedTasks);
        return {
          ...project,
          tasks: updatedTasks,
          completionPercentage,
          lastUpdated: new Date().toISOString()
        };
      }
      return project;
    });

    saveProjects(updatedProjects);
    setEditingTask(null);
    setSnackbar({ open: true, message: 'Task updated successfully!', severity: 'success' });
  };

  const handleStatusChange = (projectId, newStatus) => {
    handleUpdateProject(projectId, { status: newStatus });
  };

  const handleTaskStatusChange = (projectId, taskId, newStatus) => {
    const progress = newStatus === 'Completed' ? 100 : newStatus === 'In Progress' ? 50 : 0;
    handleUpdateTask(projectId, taskId, { status: newStatus, progress });
  };

  const calculateProjectCompletion = (tasks) => {
    if (!tasks || tasks.length === 0) return 0;
    const totalProgress = tasks.reduce((sum, task) => sum + (task.progress || 0), 0);
    return Math.round(totalProgress / tasks.length);
  };

  const getProjectsByStatus = (status) => {
    return projects.filter(project => project.status === status);
  };

  const canStartTask = (task, allTasks) => {
    if (!task.dependencies || task.dependencies.length === 0) return true;
    
    return task.dependencies.every(depId => {
      const depTask = allTasks.find(t => t.id === depId);
      return depTask && depTask.status === 'Completed';
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pipeline': return 'info';
      case 'Ongoing': case 'In Progress': return 'warning';
      case 'Completed': return 'success';
      case 'On Hold': return 'error';
      default: return 'default';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'error';
      case 'Medium': return 'warning';
      case 'Low': return 'info';
      default: return 'default';
    }
  };

  const ProjectCard = ({ project }) => (
    <Card sx={{ mb: 2, border: '1px solid #e0e0e0' }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
          <Typography variant="h6" component="h3">
            {project.name}
          </Typography>
          <Box display="flex" gap={1}>
            <Chip 
              label={project.status} 
              color={getStatusColor(project.status)}
              size="small"
            />
            <Chip 
              label={project.priority} 
              color={getPriorityColor(project.priority)}
              variant="outlined"
              size="small"
            />
          </Box>
        </Box>

        <Typography variant="body2" color="text.secondary" mb={2}>
          {project.description}
        </Typography>

        <Box mb={2}>
          <Box display="flex" justifyContent="space-between" mb={1}>
            <Typography variant="body2">Progress</Typography>
            <Typography variant="body2">{project.completionPercentage || 0}%</Typography>
          </Box>
          <LinearProgress 
            variant="determinate" 
            value={project.completionPercentage || 0}
            sx={{ height: 8, borderRadius: 4 }}
          />
        </Box>

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="subtitle2">
              Tasks ({project.tasks?.length || 0})
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <List dense>
              {project.tasks?.map((task) => (
                <ListItem key={task.id} sx={{ px: 0 }}>
                  <ListItemIcon>
                    <Checkbox
                      checked={task.status === 'Completed'}
                      onChange={(e) => handleTaskStatusChange(
                        project.id, 
                        task.id, 
                        e.target.checked ? 'Completed' : 'Not Started'
                      )}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary={task.title || task.description}
                    secondary={
                      <Box>
                        <Chip 
                          label={task.status} 
                          size="small" 
                          color={getStatusColor(task.status)}
                          sx={{ mr: 1 }}
                        />
                        {task.dueDate && (
                          <Typography variant="caption" color="text.secondary">
                            Due: {new Date(task.dueDate).toLocaleDateString()}
                          </Typography>
                        )}
                        {!canStartTask(task, project.tasks) && (
                          <Chip 
                            label="Waiting for dependencies" 
                            size="small" 
                            color="warning"
                            variant="outlined"
                            sx={{ ml: 1 }}
                          />
                        )}
                      </Box>
                    }
                  />
                  <IconButton
                    size="small"
                    onClick={() => setEditingTask({ projectId: project.id, task })}
                  >
                    <EditIcon />
                  </IconButton>
                </ListItem>
              ))}
            </List>
            <Button
              startIcon={<AddIcon />}
              onClick={() => {
                setSelectedProjectId(project.id);
                setNewTaskDialog(true);
              }}
              size="small"
              sx={{ mt: 1 }}
            >
              Add Task
            </Button>
          </AccordionDetails>
        </Accordion>
      </CardContent>

      <CardActions>
        <Button
          size="small"
          startIcon={<EditIcon />}
          onClick={() => setEditingProject(project)}
        >
          Edit
        </Button>
        
        {project.status === 'Pipeline' && (
          <Button
            size="small"
            startIcon={<PlayArrowIcon />}
            onClick={() => handleStatusChange(project.id, 'Ongoing')}
          >
            Start
          </Button>
        )}
        
        {project.status === 'Ongoing' && (
          <Button
            size="small"
            startIcon={<CheckCircleIcon />}
            onClick={() => handleStatusChange(project.id, 'Completed')}
          >
            Complete
          </Button>
        )}
      </CardActions>
    </Card>
  );

  return (
    <Box sx={{ p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Task Manager
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setNewProjectDialog(true)}
        >
          New Project
        </Button>
      </Box>

      <Paper sx={{ mb: 3 }}>
        <Tabs 
          value={activeTab} 
          onChange={(e, newValue) => setActiveTab(newValue)}
          variant="fullWidth"
        >
          <Tab 
            label={`Pipeline (${getProjectsByStatus('Pipeline').length})`} 
            icon={<ScheduleIcon />}
          />
          <Tab 
            label={`Ongoing (${getProjectsByStatus('Ongoing').length + getProjectsByStatus('In Progress').length})`} 
            icon={<PlayArrowIcon />}
          />
          <Tab 
            label={`Completed (${getProjectsByStatus('Completed').length})`} 
            icon={<CheckCircleIcon />}
          />
          <Tab 
            label="Dependencies" 
            icon={<DependencyIcon />}
          />
        </Tabs>
      </Paper>

      <Box>
        {activeTab === 0 && (
          <Box>
            <Typography variant="h6" gutterBottom>Pipeline Projects</Typography>
            {getProjectsByStatus('Pipeline').map(project => (
              <ProjectCard key={project.id} project={project} />
            ))}
            {getProjectsByStatus('Pipeline').length === 0 && (
              <Alert severity="info">No projects in pipeline. Create a new project to get started!</Alert>
            )}
          </Box>
        )}

        {activeTab === 1 && (
          <Box>
            <Typography variant="h6" gutterBottom>Ongoing Projects</Typography>
            {[...getProjectsByStatus('Ongoing'), ...getProjectsByStatus('In Progress')].map(project => (
              <ProjectCard key={project.id} project={project} />
            ))}
            {getProjectsByStatus('Ongoing').length + getProjectsByStatus('In Progress').length === 0 && (
              <Alert severity="info">No ongoing projects. Move projects from pipeline to start working!</Alert>
            )}
          </Box>
        )}

        {activeTab === 2 && (
          <Box>
            <Typography variant="h6" gutterBottom>Completed Projects</Typography>
            {getProjectsByStatus('Completed').map(project => (
              <ProjectCard key={project.id} project={project} />
            ))}
            {getProjectsByStatus('Completed').length === 0 && (
              <Alert severity="info">No completed projects yet. Complete some ongoing projects!</Alert>
            )}
          </Box>
        )}

        {activeTab === 3 && (
          <TaskDependencyView 
            projects={projects} 
            onTaskUpdate={handleUpdateTask}
          />
        )}
      </Box>

      {/* New Project Dialog */}
      <Dialog open={newProjectDialog} onClose={() => setNewProjectDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Create New Project</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Project Name"
                value={projectForm.name}
                onChange={(e) => setProjectForm({...projectForm, name: e.target.value})}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Description"
                value={projectForm.description}
                onChange={(e) => setProjectForm({...projectForm, description: e.target.value})}
              />
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={projectForm.status}
                  onChange={(e) => setProjectForm({...projectForm, status: e.target.value})}
                  label="Status"
                >
                  <MenuItem value="Pipeline">Pipeline</MenuItem>
                  <MenuItem value="Ongoing">Ongoing</MenuItem>
                  <MenuItem value="Completed">Completed</MenuItem>
                  <MenuItem value="On Hold">On Hold</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Priority</InputLabel>
                <Select
                  value={projectForm.priority}
                  onChange={(e) => setProjectForm({...projectForm, priority: e.target.value})}
                  label="Priority"
                >
                  <MenuItem value="High">High</MenuItem>
                  <MenuItem value="Medium">Medium</MenuItem>
                  <MenuItem value="Low">Low</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                type="date"
                label="Start Date"
                value={projectForm.startDate}
                onChange={(e) => setProjectForm({...projectForm, startDate: e.target.value})}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                type="date"
                label="End Date"
                value={projectForm.endDate}
                onChange={(e) => setProjectForm({...projectForm, endDate: e.target.value})}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Assigned To"
                value={projectForm.assignedTo}
                onChange={(e) => setProjectForm({...projectForm, assignedTo: e.target.value})}
              />
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={projectForm.category}
                  onChange={(e) => setProjectForm({...projectForm, category: e.target.value})}
                  label="Category"
                >
                  <MenuItem value="Marketing">Marketing</MenuItem>
                  <MenuItem value="Development">Development</MenuItem>
                  <MenuItem value="Design">Design</MenuItem>
                  <MenuItem value="Strategy">Strategy</MenuItem>
                  <MenuItem value="Operations">Operations</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNewProjectDialog(false)}>Cancel</Button>
          <Button onClick={handleCreateProject} variant="contained">Create Project</Button>
        </DialogActions>
      </Dialog>

      {/* New Task Dialog */}
      <Dialog open={newTaskDialog} onClose={() => setNewTaskDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Create New Task</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Task Title"
                value={taskForm.title}
                onChange={(e) => setTaskForm({...taskForm, title: e.target.value})}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={2}
                label="Description"
                value={taskForm.description}
                onChange={(e) => setTaskForm({...taskForm, description: e.target.value})}
              />
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={taskForm.status}
                  onChange={(e) => setTaskForm({...taskForm, status: e.target.value})}
                  label="Status"
                >
                  <MenuItem value="Not Started">Not Started</MenuItem>
                  <MenuItem value="In Progress">In Progress</MenuItem>
                  <MenuItem value="Completed">Completed</MenuItem>
                  <MenuItem value="Blocked">Blocked</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Priority</InputLabel>
                <Select
                  value={taskForm.priority}
                  onChange={(e) => setTaskForm({...taskForm, priority: e.target.value})}
                  label="Priority"
                >
                  <MenuItem value="High">High</MenuItem>
                  <MenuItem value="Medium">Medium</MenuItem>
                  <MenuItem value="Low">Low</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                type="date"
                label="Due Date"
                value={taskForm.dueDate}
                onChange={(e) => setTaskForm({...taskForm, dueDate: e.target.value})}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                type="number"
                label="Estimated Hours"
                value={taskForm.estimatedHours}
                onChange={(e) => setTaskForm({...taskForm, estimatedHours: e.target.value})}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Assigned To"
                value={taskForm.assignedTo}
                onChange={(e) => setTaskForm({...taskForm, assignedTo: e.target.value})}
              />
            </Grid>
            <Grid item xs={12}>
              <Autocomplete
                multiple
                options={selectedProjectId ? 
                  (projects.find(p => p.id === selectedProjectId)?.tasks || []).map(t => ({
                    id: t.id,
                    label: t.title || t.description,
                    status: t.status
                  })) : []
                }
                value={taskForm.dependencies.map(depId => {
                  const project = projects.find(p => p.id === selectedProjectId);
                  const task = project?.tasks?.find(t => t.id === depId);
                  return task ? { id: task.id, label: task.title || task.description, status: task.status } : null;
                }).filter(Boolean)}
                onChange={(event, newValue) => {
                  setTaskForm({...taskForm, dependencies: newValue.map(item => item.id)});
                }}
                getOptionLabel={(option) => option.label}
                renderOption={(props, option) => (
                  <Box component="li" {...props}>
                    <Chip 
                      label={option.status} 
                      color={getStatusColor(option.status)}
                      size="small"
                      sx={{ mr: 1 }}
                    />
                    {option.label}
                  </Box>
                )}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      variant="outlined"
                      label={option.label}
                      size="small"
                      {...getTagProps({ index })}
                    />
                  ))
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Task Dependencies"
                    placeholder="Select tasks that must be completed first"
                  />
                )}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNewTaskDialog(false)}>Cancel</Button>
          <Button onClick={handleCreateTask} variant="contained">Create Task</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({...snackbar, open: false})}
      >
        <Alert 
          onClose={() => setSnackbar({...snackbar, open: false})} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default TaskManager;