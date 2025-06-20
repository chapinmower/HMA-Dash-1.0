import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  LinearProgress,
  Chip,
  IconButton,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  Tooltip,
  Fab,
  Alert,
  Snackbar,
  Stack,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Tab,
  Tabs,
  CircularProgress,
  Avatar,
  AvatarGroup
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Check as CheckIcon,
  Schedule as ScheduleIcon,
  CalendarToday as CalendarTodayIcon,
  Flag as FlagIcon,
  Person as PersonIcon,
  Timeline as TimelineIcon,
  Assignment as TaskIcon,
  Message as MessageIcon,
  ExpandMore as ExpandMoreIcon,
  Settings as SettingsIcon,
  TrendingUp as TrendingUpIcon,
  AttachMoney as AttachMoneyIcon,
  CheckCircle as CheckCircleIcon,
  RadioButtonUnchecked as RadioButtonUncheckedIcon
} from '@mui/icons-material';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useProjects } from '../../contexts/ProjectContext';

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`project-tabpanel-${index}`}
      aria-labelledby={`project-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

function ProjectDetailEnhanced() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { 
    projects, 
    tracking, 
    getProjectById, 
    updateProject, 
    updateTracking,
    addMilestone,
    updateMilestone,
    deleteMilestone,
    addProjectUpdate,
    loading 
  } = useProjects();

  // Component state
  const [project, setProject] = useState(null);
  const [projectTracking, setProjectTracking] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  
  // Edit form state
  const [editForm, setEditForm] = useState({});
  
  // Milestone state
  const [milestoneDialog, setMilestoneDialog] = useState({ open: false, milestone: null, isEdit: false });
  const [milestoneForm, setMilestoneForm] = useState({
    name: '',
    dueDate: '',
    status: 'pending'
  });

  // Update dialog state
  const [updateDialog, setUpdateDialog] = useState({ open: false });
  const [updateForm, setUpdateForm] = useState({
    message: '',
    type: 'update'
  });

  // Load project data
  useEffect(() => {
    if (projectId) {
      const projectData = getProjectById(parseInt(projectId));
      const trackingData = tracking.find(t => t.projectId === parseInt(projectId));
      
      setProject(projectData);
      setProjectTracking(trackingData);
      
      if (projectData) {
        setEditForm(projectData);
      }

      // Check if edit mode is requested via URL
      if (searchParams.get('edit') === 'true') {
        setEditMode(true);
      }
    }
  }, [projectId, projects, tracking, getProjectById, searchParams]);

  // Show snackbar
  const showSnackbar = (message, severity = 'info') => {
    setSnackbar({ open: true, message, severity });
  };

  // Handle project save
  const handleSaveProject = () => {
    updateProject(project.id, editForm);
    setProject({ ...project, ...editForm });
    setEditMode(false);
    showSnackbar('Project updated successfully', 'success');
  };

  // Handle milestone management
  const handleMilestoneSubmit = () => {
    if (milestoneDialog.isEdit) {
      updateMilestone(project.id, milestoneDialog.milestone.id, milestoneForm);
      showSnackbar('Milestone updated successfully', 'success');
    } else {
      addMilestone(project.id, milestoneForm);
      showSnackbar('Milestone added successfully', 'success');
    }
    
    setMilestoneDialog({ open: false, milestone: null, isEdit: false });
    setMilestoneForm({ name: '', dueDate: '', status: 'pending' });
    
    // Reload tracking data
    const updatedTracking = tracking.find(t => t.projectId === parseInt(projectId));
    setProjectTracking(updatedTracking);
  };

  const handleDeleteMilestone = (milestoneId) => {
    if (window.confirm('Are you sure you want to delete this milestone?')) {
      deleteMilestone(project.id, milestoneId);
      showSnackbar('Milestone deleted', 'success');
      
      // Reload tracking data
      const updatedTracking = tracking.find(t => t.projectId === parseInt(projectId));
      setProjectTracking(updatedTracking);
    }
  };

  // Handle project update
  const handleAddUpdate = () => {
    addProjectUpdate(project.id, updateForm.message, updateForm.type);
    setUpdateDialog({ open: false });
    setUpdateForm({ message: '', type: 'update' });
    showSnackbar('Update added successfully', 'success');
    
    // Reload tracking data
    const updatedTracking = tracking.find(t => t.projectId === parseInt(projectId));
    setProjectTracking(updatedTracking);
  };

  // Calculate project statistics
  const getProjectStats = () => {
    if (!project || !projectTracking) return {};
    
    const totalMilestones = projectTracking.milestones?.length || 0;
    const completedMilestones = projectTracking.milestones?.filter(m => m.status === 'completed').length || 0;
    const overdueMilestones = projectTracking.milestones?.filter(m => {
      return m.status !== 'completed' && new Date(m.dueDate) < new Date();
    }).length || 0;

    return {
      totalMilestones,
      completedMilestones,
      overdueMilestones,
      progress: totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 0
    };
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'No date';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'success';
      case 'Ongoing': return 'warning';
      case 'Pipeline': return 'info';
      default: return 'default';
    }
  };

  // Get priority color
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'error';
      case 'Medium': return 'warning';
      case 'Low': return 'success';
      default: return 'default';
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!project) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Project Not Found
        </Typography>
        <Typography variant="body1">
          The project with ID {projectId} could not be found.
        </Typography>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/projects')}
          sx={{ mt: 2 }}
        >
          Back to Projects
        </Button>
      </Box>
    );
  }

  const stats = getProjectStats();

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton onClick={() => navigate('/projects')}>
            <ArrowBackIcon />
          </IconButton>
          {editMode ? (
            <TextField
              value={editForm.name || ''}
              onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              variant="outlined"
              size="large"
              sx={{ fontSize: '2rem', fontWeight: 'bold' }}
            />
          ) : (
            <Typography variant="h4" component="h1">
              {project.name}
            </Typography>
          )}
        </Box>
        
        <Box sx={{ display: 'flex', gap: 1 }}>
          {editMode ? (
            <>
              <Button
                variant="contained"
                color="primary"
                startIcon={<SaveIcon />}
                onClick={handleSaveProject}
              >
                Save
              </Button>
              <Button
                variant="outlined"
                startIcon={<CancelIcon />}
                onClick={() => {
                  setEditMode(false);
                  setEditForm(project);
                }}
              >
                Cancel
              </Button>
            </>
          ) : (
            <Button
              variant="outlined"
              startIcon={<EditIcon />}
              onClick={() => setEditMode(true)}
            >
              Edit Project
            </Button>
          )}
        </Box>
      </Box>

      {/* Project Status Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Progress
              </Typography>
              <Typography variant="h4" color="primary">
                {stats.progress}%
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={stats.progress} 
                sx={{ mt: 1, height: 8, borderRadius: 4 }}
              />
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Milestones
              </Typography>
              <Typography variant="h4" color="success.main">
                {stats.completedMilestones}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                of {stats.totalMilestones} completed
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Status
              </Typography>
              <Chip
                label={project.status}
                color={getStatusColor(project.status)}
                size="large"
              />
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Priority
              </Typography>
              <Chip
                label={project.priority}
                color={getPriorityColor(project.priority)}
                size="large"
                icon={<FlagIcon />}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Project Details Tabs */}
      <Paper sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
            <Tab label="Overview" />
            <Tab label="Milestones" />
            <Tab label="Updates" />
            <Tab label="Settings" />
          </Tabs>
        </Box>

        {/* Overview Tab */}
        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Typography variant="h6" gutterBottom>
                Description
              </Typography>
              {editMode ? (
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  value={editForm.description || ''}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  variant="outlined"
                />
              ) : (
                <Typography variant="body1" paragraph>
                  {project.description}
                </Typography>
              )}
              
              <Divider sx={{ my: 3 }} />
              
              <Typography variant="h6" gutterBottom>
                Project Details
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    Category
                  </Typography>
                  <Typography variant="body1">
                    {project.category}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    Assigned To
                  </Typography>
                  <Typography variant="body1">
                    {project.assignedTo}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    Start Date
                  </Typography>
                  <Typography variant="body1">
                    {formatDate(project.startDate)}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    End Date
                  </Typography>
                  <Typography variant="body1">
                    {formatDate(project.endDate)}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Quick Stats
                  </Typography>
                  <Stack spacing={2}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2">Days Remaining</Typography>
                      <Typography variant="body2" fontWeight="bold">
                        {project.endDate ? 
                          Math.max(0, Math.ceil((new Date(project.endDate) - new Date()) / (1000 * 60 * 60 * 24))) 
                          : 'No deadline'
                        }
                      </Typography>
                    </Box>
                    
                    {stats.overdueMilestones > 0 && (
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="error">Overdue Milestones</Typography>
                        <Typography variant="body2" fontWeight="bold" color="error">
                          {stats.overdueMilestones}
                        </Typography>
                      </Box>
                    )}
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2">Created</Typography>
                      <Typography variant="body2">
                        {formatDate(project.createdAt)}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2">Last Updated</Typography>
                      <Typography variant="body2">
                        {formatDate(project.lastUpdated)}
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Milestones Tab */}
        <TabPanel value={tabValue} index={1}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6">
              Project Milestones
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => {
                setMilestoneForm({ name: '', dueDate: '', status: 'pending' });
                setMilestoneDialog({ open: true, milestone: null, isEdit: false });
              }}
            >
              Add Milestone
            </Button>
          </Box>
          
          {projectTracking?.milestones?.length > 0 ? (
            <List>
              {projectTracking.milestones.map((milestone) => (
                <ListItem key={milestone.id} divider>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <IconButton
                          size="small"
                          onClick={() => {
                            const newStatus = milestone.status === 'completed' ? 'pending' : 'completed';
                            updateMilestone(project.id, milestone.id, { 
                              status: newStatus,
                              completedDate: newStatus === 'completed' ? new Date().toISOString() : null
                            });
                            showSnackbar(`Milestone ${newStatus === 'completed' ? 'completed' : 'reopened'}`, 'success');
                          }}
                        >
                          {milestone.status === 'completed' ? 
                            <CheckCircleIcon color="success" /> : 
                            <RadioButtonUncheckedIcon />
                          }
                        </IconButton>
                        <Typography 
                          variant="body1" 
                          sx={{ 
                            textDecoration: milestone.status === 'completed' ? 'line-through' : 'none',
                            opacity: milestone.status === 'completed' ? 0.7 : 1
                          }}
                        >
                          {milestone.name}
                        </Typography>
                      </Box>
                    }
                    secondary={
                      <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                        <Typography variant="caption">
                          Due: {formatDate(milestone.dueDate)}
                        </Typography>
                        {milestone.status === 'completed' && milestone.completedDate && (
                          <Typography variant="caption" color="success.main">
                            Completed: {formatDate(milestone.completedDate)}
                          </Typography>
                        )}
                        {milestone.status !== 'completed' && new Date(milestone.dueDate) < new Date() && (
                          <Typography variant="caption" color="error">
                            Overdue
                          </Typography>
                        )}
                      </Box>
                    }
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      onClick={() => {
                        setMilestoneForm({
                          name: milestone.name,
                          dueDate: milestone.dueDate,
                          status: milestone.status
                        });
                        setMilestoneDialog({ open: true, milestone, isEdit: true });
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDeleteMilestone(milestone.id)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          ) : (
            <Alert severity="info">
              No milestones created yet. Add your first milestone to track project progress.
            </Alert>
          )}
        </TabPanel>

        {/* Updates Tab */}
        <TabPanel value={tabValue} index={2}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6">
              Project Updates
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => {
                setUpdateForm({ message: '', type: 'update' });
                setUpdateDialog({ open: true });
              }}
            >
              Add Update
            </Button>
          </Box>
          
          {projectTracking?.updates?.length > 0 ? (
            <List>
              {projectTracking.updates
                .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
                .map((update, index) => (
                <ListItem key={index} divider>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Chip
                          label={update.type}
                          size="small"
                          color={update.type === 'status_change' ? 'warning' : 'default'}
                        />
                        <Typography variant="caption" color="text.secondary">
                          {new Date(update.timestamp).toLocaleString()}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          by {update.user}
                        </Typography>
                      </Box>
                    }
                    secondary={update.message}
                  />
                </ListItem>
              ))}
            </List>
          ) : (
            <Alert severity="info">
              No updates yet. Add your first update to document project progress.
            </Alert>
          )}
        </TabPanel>

        {/* Settings Tab */}
        <TabPanel value={tabValue} index={3}>
          <Typography variant="h6" gutterBottom>
            Project Settings
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Status</InputLabel>
                <Select
                  value={editForm.status || project.status}
                  onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                  label="Status"
                >
                  <MenuItem value="Pipeline">Pipeline</MenuItem>
                  <MenuItem value="Ongoing">Ongoing</MenuItem>
                  <MenuItem value="Completed">Completed</MenuItem>
                </Select>
              </FormControl>
              
              <FormControl fullWidth margin="normal">
                <InputLabel>Priority</InputLabel>
                <Select
                  value={editForm.priority || project.priority}
                  onChange={(e) => setEditForm({ ...editForm, priority: e.target.value })}
                  label="Priority"
                >
                  <MenuItem value="Low">Low</MenuItem>
                  <MenuItem value="Medium">Medium</MenuItem>
                  <MenuItem value="High">High</MenuItem>
                </Select>
              </FormControl>
              
              <TextField
                fullWidth
                label="Category"
                value={editForm.category || project.category}
                onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                margin="normal"
              />
              
              <TextField
                fullWidth
                label="Assigned To"
                value={editForm.assignedTo || project.assignedTo}
                onChange={(e) => setEditForm({ ...editForm, assignedTo: e.target.value })}
                margin="normal"
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="date"
                label="Start Date"
                value={editForm.startDate || project.startDate}
                onChange={(e) => setEditForm({ ...editForm, startDate: e.target.value })}
                margin="normal"
                InputLabelProps={{ shrink: true }}
              />
              
              <TextField
                fullWidth
                type="date"
                label="End Date"
                value={editForm.endDate || project.endDate}
                onChange={(e) => setEditForm({ ...editForm, endDate: e.target.value })}
                margin="normal"
                InputLabelProps={{ shrink: true }}
              />
              
              <Box sx={{ mt: 3 }}>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<SaveIcon />}
                  onClick={handleSaveProject}
                >
                  Save Changes
                </Button>
              </Box>
            </Grid>
          </Grid>
        </TabPanel>
      </Paper>

      {/* Milestone Dialog */}
      <Dialog open={milestoneDialog.open} maxWidth="sm" fullWidth>
        <DialogTitle>
          {milestoneDialog.isEdit ? 'Edit Milestone' : 'Add New Milestone'}
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Milestone Name"
            value={milestoneForm.name}
            onChange={(e) => setMilestoneForm({ ...milestoneForm, name: e.target.value })}
            margin="normal"
          />
          <TextField
            fullWidth
            type="date"
            label="Due Date"
            value={milestoneForm.dueDate}
            onChange={(e) => setMilestoneForm({ ...milestoneForm, dueDate: e.target.value })}
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Status</InputLabel>
            <Select
              value={milestoneForm.status}
              onChange={(e) => setMilestoneForm({ ...milestoneForm, status: e.target.value })}
              label="Status"
            >
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="in-progress">In Progress</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setMilestoneDialog({ open: false, milestone: null, isEdit: false })}>
            Cancel
          </Button>
          <Button onClick={handleMilestoneSubmit} variant="contained">
            {milestoneDialog.isEdit ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Update Dialog */}
      <Dialog open={updateDialog.open} maxWidth="sm" fullWidth>
        <DialogTitle>Add Project Update</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="normal">
            <InputLabel>Update Type</InputLabel>
            <Select
              value={updateForm.type}
              onChange={(e) => setUpdateForm({ ...updateForm, type: e.target.value })}
              label="Update Type"
            >
              <MenuItem value="update">General Update</MenuItem>
              <MenuItem value="milestone">Milestone Update</MenuItem>
              <MenuItem value="issue">Issue/Blocker</MenuItem>
              <MenuItem value="achievement">Achievement</MenuItem>
            </Select>
          </FormControl>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Update Message"
            value={updateForm.message}
            onChange={(e) => setUpdateForm({ ...updateForm, message: e.target.value })}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUpdateDialog({ open: false })}>
            Cancel
          </Button>
          <Button onClick={handleAddUpdate} variant="contained">
            Add Update
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default ProjectDetailEnhanced;