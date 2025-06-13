import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  LinearProgress,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  PlayArrow as PlayArrowIcon,
  Edit as EditIcon,
  Add as AddIcon,
  Timeline as TimelineIcon,
  Assignment as AssignmentIcon
} from '@mui/icons-material';
import { loadStaticData } from '../apiClient';

const ProjectProgressTracker = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [editDialog, setEditDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setLoading(true);
      
      // First, check if we have projects in localStorage
      const localProjects = localStorage.getItem('hma_projects');
      if (localProjects) {
        const parsedProjects = JSON.parse(localProjects);
        setProjects(parsedProjects);
        console.log('Loaded projects from localStorage:', parsedProjects);
      } else {
        // If no local storage, load from static JSON
        const data = await loadStaticData('projects.json');
        const projectsData = data?.projects || [];
        setProjects(projectsData);
        // Save to localStorage for future use
        localStorage.setItem('hma_projects', JSON.stringify(projectsData));
        console.log('Loaded projects from JSON and saved to localStorage:', projectsData);
      }
      
      // Check last updated timestamp
      const timestamp = await loadStaticData('last_updated.json');
      setLastUpdated(timestamp?.lastUpdated);
      
      setError(null);
    } catch (err) {
      setError('Failed to load project data');
      console.error('Error loading projects:', err);
    } finally {
      setLoading(false);
    }
  };

  // Save projects to localStorage whenever they change
  const saveProjects = (updatedProjects) => {
    setProjects(updatedProjects);
    localStorage.setItem('hma_projects', JSON.stringify(updatedProjects));
    console.log('Saved projects to localStorage:', updatedProjects);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Completed':
        return <CheckCircleIcon color="success" />;
      case 'In Progress':
        return <PlayArrowIcon color="primary" />;
      case 'Planned':
        return <ScheduleIcon color="action" />;
      default:
        return <AssignmentIcon color="action" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return 'success';
      case 'In Progress':
        return 'primary';
      case 'Planned':
        return 'default';
      default:
        return 'default';
    }
  };

  const getDaysRemaining = (endDate) => {
    const today = new Date();
    const end = new Date(endDate);
    const diffTime = end - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getTaskStatusCounts = (tasks) => {
    const counts = {
      total: tasks?.length || 0,
      completed: 0,
      inProgress: 0,
      notStarted: 0
    };

    tasks?.forEach(task => {
      switch (task.status) {
        case 'Completed':
          counts.completed++;
          break;
        case 'In Progress':
          counts.inProgress++;
          break;
        default:
          counts.notStarted++;
      }
    });

    return counts;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString();
  };

  const ProjectCard = ({ project }) => {
    const daysRemaining = getDaysRemaining(project.endDate);
    const taskCounts = getTaskStatusCounts(project.tasks);
    const isOverdue = daysRemaining < 0 && project.status !== 'Completed';
    const isDueSoon = daysRemaining <= 7 && daysRemaining >= 0;

    return (
      <Card 
        sx={{ 
          height: '100%',
          border: isOverdue ? '2px solid #d32f2f' : isDueSoon ? '2px solid #ff9800' : '1px solid #e0e0e0',
          '&:hover': { boxShadow: 6 }
        }}
      >
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
            <Box flex={1}>
              <Typography variant="h6" component="h3" gutterBottom>
                {project.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                {project.description}
              </Typography>
            </Box>
            <Box display="flex" alignItems="center" gap={1}>
              {getStatusIcon(project.status)}
              <Tooltip title="Edit Project">
                <IconButton 
                  size="small" 
                  onClick={() => {
                    setSelectedProject(project);
                    setEditDialog(true);
                  }}
                >
                  <EditIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          <Box mb={2}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
              <Typography variant="body2" color="text.secondary">
                Progress: {project.completionPercentage}%
              </Typography>
              <Chip 
                label={project.status} 
                color={getStatusColor(project.status)}
                size="small"
              />
            </Box>
            <LinearProgress 
              variant="determinate" 
              value={project.completionPercentage} 
              sx={{ height: 8, borderRadius: 4 }}
            />
          </Box>

          <Grid container spacing={2} mb={2}>
            <Grid item xs={6}>
              <Typography variant="caption" color="text.secondary">Start Date</Typography>
              <Typography variant="body2">{formatDate(project.startDate)}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="caption" color="text.secondary">End Date</Typography>
              <Typography variant="body2">{formatDate(project.endDate)}</Typography>
            </Grid>
          </Grid>

          {daysRemaining !== null && (
            <Box mb={2}>
              <Typography 
                variant="body2" 
                color={isOverdue ? 'error' : isDueSoon ? 'warning.main' : 'text.secondary'}
                fontWeight={isOverdue || isDueSoon ? 'bold' : 'normal'}
              >
                {isOverdue ? 
                  `Overdue by ${Math.abs(daysRemaining)} days` :
                  daysRemaining === 0 ?
                  'Due today' :
                  `${daysRemaining} days remaining`
                }
              </Typography>
            </Box>
          )}

          <Divider sx={{ my: 2 }} />

          <Box>
            <Typography variant="subtitle2" gutterBottom>Task Summary</Typography>
            <Grid container spacing={1}>
              <Grid item xs={4}>
                <Box textAlign="center">
                  <Typography variant="h6" color="success.main">
                    {taskCounts.completed}
                  </Typography>
                  <Typography variant="caption">Done</Typography>
                </Box>
              </Grid>
              <Grid item xs={4}>
                <Box textAlign="center">
                  <Typography variant="h6" color="primary.main">
                    {taskCounts.inProgress}
                  </Typography>
                  <Typography variant="caption">In Progress</Typography>
                </Box>
              </Grid>
              <Grid item xs={4}>
                <Box textAlign="center">
                  <Typography variant="h6" color="text.secondary">
                    {taskCounts.notStarted}
                  </Typography>
                  <Typography variant="caption">To Do</Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>

          <Box mt={2}>
            <Button
              startIcon={<TimelineIcon />}
              onClick={() => {
                setSelectedProject(project);
                // Could open detailed view
              }}
              size="small"
            >
              View Details
            </Button>
          </Box>
        </CardContent>
      </Card>
    );
  };

  const TaskItem = ({ task, projectId }) => (
    <ListItem 
      sx={{ 
        border: '1px solid #f0f0f0',
        borderRadius: 1,
        mb: 1,
        bgcolor: task.status === 'Completed' ? 'success.light' : 'background.paper'
      }}
    >
      <ListItemIcon>
        {getStatusIcon(task.status)}
      </ListItemIcon>
      <ListItemText
        primary={task.title}
        secondary={
          <Box>
            <Typography variant="body2" color="text.secondary">
              {task.description}
            </Typography>
            {task.due_date && (
              <Typography variant="caption" color="text.secondary">
                Due: {formatDate(task.due_date)}
              </Typography>
            )}
            <Box mt={1}>
              <LinearProgress 
                variant="determinate" 
                value={task.progress || 0} 
                sx={{ height: 4, borderRadius: 2 }}
              />
              <Typography variant="caption" color="text.secondary">
                {task.progress || 0}% complete
              </Typography>
            </Box>
          </Box>
        }
      />
      <Chip 
        label={task.status} 
        color={getStatusColor(task.status)}
        size="small"
      />
    </ListItem>
  );

  const ProjectDetailDialog = () => (
    <Dialog 
      open={!!selectedProject} 
      onClose={() => setSelectedProject(null)}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        <Box display="flex" alignItems="center" gap={1}>
          {getStatusIcon(selectedProject?.status)}
          {selectedProject?.name}
        </Box>
      </DialogTitle>
      <DialogContent>
        {selectedProject && (
          <Box>
            <Typography variant="body1" paragraph>
              {selectedProject.description}
            </Typography>
            
            <Grid container spacing={2} mb={3}>
              <Grid item xs={6} md={3}>
                <Typography variant="caption" color="text.secondary">Status</Typography>
                <Typography variant="body2">{selectedProject.status}</Typography>
              </Grid>
              <Grid item xs={6} md={3}>
                <Typography variant="caption" color="text.secondary">Progress</Typography>
                <Typography variant="body2">{selectedProject.completionPercentage}%</Typography>
              </Grid>
              <Grid item xs={6} md={3}>
                <Typography variant="caption" color="text.secondary">Start Date</Typography>
                <Typography variant="body2">{formatDate(selectedProject.startDate)}</Typography>
              </Grid>
              <Grid item xs={6} md={3}>
                <Typography variant="caption" color="text.secondary">End Date</Typography>
                <Typography variant="body2">{formatDate(selectedProject.endDate)}</Typography>
              </Grid>
            </Grid>

            <Typography variant="h6" gutterBottom>Tasks</Typography>
            <List>
              {selectedProject.tasks?.map(task => (
                <TaskItem 
                  key={task.id} 
                  task={task} 
                  projectId={selectedProject.id}
                />
              ))}
            </List>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setSelectedProject(null)}>Close</Button>
        <Button 
          variant="contained" 
          onClick={() => {
            setEditDialog(true);
          }}
          startIcon={<EditIcon />}
        >
          Edit Project
        </Button>
      </DialogActions>
    </Dialog>
  );

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Loading project data...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Project Progress Tracker
        </Typography>
        <Box display="flex" gap={2}>
          <Button 
            variant="outlined" 
            onClick={async () => {
              if (window.confirm('This will reload projects from the server. Any local changes not saved to the server will be lost. Continue?')) {
                localStorage.removeItem('hma_projects');
                await loadProjects();
              }
            }}
          >
            Sync from Server
          </Button>
          <Button 
            variant="contained" 
            startIcon={<AddIcon />}
            onClick={() => {
              setSelectedProject(null); // Ensure we're creating a new project
              setEditDialog(true);
            }}
          >
            New Project
          </Button>
        </Box>
      </Box>

      {lastUpdated && (
        <Alert severity="info" sx={{ mb: 3 }}>
          Project data last updated: {new Date(lastUpdated).toLocaleString()}
        </Alert>
      )}

      <Grid container spacing={3}>
        {projects.map(project => (
          <Grid item xs={12} md={6} lg={4} key={project.id}>
            <ProjectCard project={project} />
          </Grid>
        ))}
      </Grid>

      {projects.length === 0 && (
        <Box textAlign="center" py={6}>
          <AssignmentIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            No projects found
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={3}>
            Start by creating your first project to track progress
          </Typography>
          <Button 
            variant="contained" 
            startIcon={<AddIcon />}
            onClick={() => setEditDialog(true)}
          >
            Create Project
          </Button>
        </Box>
      )}

      <ProjectDetailDialog />
      
      {/* Edit/Create Project Dialog */}
      <Dialog 
        open={editDialog} 
        onClose={() => {
          setEditDialog(false);
          setSelectedProject(null);
        }}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {selectedProject ? 'Edit Project' : 'Create New Project'}
        </DialogTitle>
        <DialogContent>
          <ProjectForm 
            project={selectedProject}
            onSave={(projectData) => {
              if (selectedProject) {
                // Edit existing project
                const updatedProjects = projects.map(p => 
                  p.id === selectedProject.id ? { ...p, ...projectData, lastUpdated: new Date().toISOString() } : p
                );
                saveProjects(updatedProjects);
              } else {
                // Create new project
                const newProject = {
                  ...projectData,
                  id: Math.max(...projects.map(p => p.id), 0) + 1,
                  tasks: [],
                  lastUpdated: new Date().toISOString()
                };
                saveProjects([...projects, newProject]);
              }
              setEditDialog(false);
              setSelectedProject(null);
            }}
            onCancel={() => {
              setEditDialog(false);
              setSelectedProject(null);
            }}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

// Project Form Component
const ProjectForm = ({ project, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: project?.name || '',
    description: project?.description || '',
    startDate: project?.startDate || new Date().toISOString().split('T')[0],
    endDate: project?.endDate || '',
    status: project?.status || 'Planned',
    completionPercentage: project?.completionPercentage || 0
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <TextField
        fullWidth
        label="Project Name"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        required
        sx={{ mb: 2 }}
      />
      <TextField
        fullWidth
        label="Description"
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        multiline
        rows={3}
        sx={{ mb: 2 }}
      />
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={6}>
          <TextField
            fullWidth
            label="Start Date"
            type="date"
            value={formData.startDate}
            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
            InputLabelProps={{ shrink: true }}
            required
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            label="End Date"
            type="date"
            value={formData.endDate}
            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
            InputLabelProps={{ shrink: true }}
            required
          />
        </Grid>
      </Grid>
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={6}>
          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              label="Status"
            >
              <MenuItem value="Planned">Planned</MenuItem>
              <MenuItem value="In Progress">In Progress</MenuItem>
              <MenuItem value="Completed">Completed</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            label="Completion %"
            type="number"
            value={formData.completionPercentage}
            onChange={(e) => setFormData({ ...formData, completionPercentage: parseInt(e.target.value) || 0 })}
            InputProps={{ inputProps: { min: 0, max: 100 } }}
          />
        </Grid>
      </Grid>
      <Box display="flex" justifyContent="flex-end" gap={2}>
        <Button onClick={onCancel}>Cancel</Button>
        <Button type="submit" variant="contained">
          {project ? 'Save Changes' : 'Create Project'}
        </Button>
      </Box>
    </Box>
  );
};

export default ProjectProgressTracker;