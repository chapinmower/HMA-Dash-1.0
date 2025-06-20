import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProjects } from '../../contexts/ProjectContext';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Chip,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  IconButton,
  Tooltip,
  LinearProgress,
  ToggleButton,
  ToggleButtonGroup,
  InputAdornment,
  Avatar,
  AvatarGroup,
  Menu,
  Checkbox,
  ListItemText,
  Divider,
  Fade
} from '@mui/material';
import {
  Search as SearchIcon,
  ViewList as ViewListIcon,
  ViewModule as ViewModuleIcon,
  FilterList as FilterListIcon,
  Sort as SortIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  MoreVert as MoreVertIcon,
  CalendarToday as CalendarTodayIcon,
  PriorityHigh as PriorityHighIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  PlayArrow as PlayArrowIcon,
  Pause as PauseIcon,
  Flag as FlagIcon
} from '@mui/icons-material';

function ProjectList() {
  const navigate = useNavigate();
  const { projects, tracking, updateProjectStatus, deleteProject, loading } = useProjects();
  
  // View and filter state
  const [viewMode, setViewMode] = useState('cards');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('lastUpdated');
  const [sortOrder, setSortOrder] = useState('desc');
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);

  // Get unique categories from projects
  const categories = useMemo(() => {
    const cats = new Set(projects.map(p => p.category));
    return Array.from(cats);
  }, [projects]);

  // Filter and sort projects
  const filteredProjects = useMemo(() => {
    let filtered = projects;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(project =>
        project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(project => project.status === statusFilter);
    }

    // Priority filter
    if (priorityFilter !== 'all') {
      filtered = filtered.filter(project => project.priority === priorityFilter);
    }

    // Category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(project => project.category === categoryFilter);
    }

    // Sort
    filtered.sort((a, b) => {
      let compareValue = 0;
      
      switch (sortBy) {
        case 'name':
          compareValue = a.name.localeCompare(b.name);
          break;
        case 'startDate':
          compareValue = new Date(a.startDate) - new Date(b.startDate);
          break;
        case 'endDate':
          compareValue = new Date(a.endDate || '9999-12-31') - new Date(b.endDate || '9999-12-31');
          break;
        case 'priority':
          const priorityOrder = { 'High': 3, 'Medium': 2, 'Low': 1 };
          compareValue = priorityOrder[b.priority] - priorityOrder[a.priority];
          break;
        case 'progress':
          compareValue = b.completionPercentage - a.completionPercentage;
          break;
        case 'lastUpdated':
        default:
          compareValue = new Date(b.lastUpdated) - new Date(a.lastUpdated);
          break;
      }
      
      return sortOrder === 'asc' ? compareValue : -compareValue;
    });

    return filtered;
  }, [projects, searchTerm, statusFilter, priorityFilter, categoryFilter, sortBy, sortOrder]);

  // Get project tracking data
  const getProjectTracking = (projectId) => {
    return tracking.find(t => t.projectId === projectId) || {};
  };

  // Handle project menu
  const handleProjectMenu = (event, project) => {
    setAnchorEl(event.currentTarget);
    setSelectedProject(project);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setSelectedProject(null);
  };

  // Handle project actions
  const handleViewProject = (projectId) => {
    navigate(`/projects/${projectId}`);
  };

  const handleEditProject = (projectId) => {
    navigate(`/projects/${projectId}?edit=true`);
  };

  const handleDeleteProject = (projectId) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      deleteProject(projectId);
      handleCloseMenu();
    }
  };

  const handleQuickStatusChange = (projectId, newStatus) => {
    updateProjectStatus(projectId, newStatus);
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

  // Get days until due
  const getDaysUntilDue = (endDate) => {
    if (!endDate) return null;
    const today = new Date();
    const due = new Date(endDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'No date';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Render project card
  const renderProjectCard = (project) => {
    const projectTracking = getProjectTracking(project.id);
    const daysUntilDue = getDaysUntilDue(project.endDate);
    
    return (
      <Grid item xs={12} sm={6} md={4} key={project.id}>
        <Card 
          sx={{ 
            height: '100%',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: 3
            }
          }}
          onClick={() => handleViewProject(project.id)}
        >
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
              <Typography variant="h6" component="div" sx={{ flex: 1 }}>
                {project.name}
              </Typography>
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  handleProjectMenu(e, project);
                }}
              >
                <MoreVertIcon />
              </IconButton>
            </Box>

            <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
              <Chip
                label={project.status}
                size="small"
                color={getStatusColor(project.status)}
                icon={project.status === 'Completed' ? <CheckCircleIcon /> : <ScheduleIcon />}
              />
              <Chip
                label={project.priority}
                size="small"
                color={getPriorityColor(project.priority)}
                icon={<FlagIcon />}
              />
              <Chip
                label={project.category}
                size="small"
                variant="outlined"
              />
            </Box>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 2, height: '40px', overflow: 'hidden' }}>
              {project.description}
            </Typography>

            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Progress
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {project.completionPercentage}%
                </Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={project.completionPercentage} 
                sx={{ height: 8, borderRadius: 4 }}
              />
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CalendarTodayIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                <Typography variant="caption" color="text.secondary">
                  {formatDate(project.endDate)}
                </Typography>
              </Box>
              
              {daysUntilDue !== null && (
                <Chip
                  label={daysUntilDue < 0 ? `${Math.abs(daysUntilDue)}d overdue` : `${daysUntilDue}d left`}
                  size="small"
                  color={daysUntilDue < 0 ? 'error' : daysUntilDue <= 7 ? 'warning' : 'default'}
                />
              )}
            </Box>

            {projectTracking.milestones && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="caption" color="text.secondary">
                  Milestones: {projectTracking.milestones.filter(m => m.status === 'completed').length}/{projectTracking.milestones.length}
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>
      </Grid>
    );
  };

  // Render project list item
  const renderProjectListItem = (project) => {
    const projectTracking = getProjectTracking(project.id);
    const daysUntilDue = getDaysUntilDue(project.endDate);
    
    return (
      <Card key={project.id} sx={{ mb: 2 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <Typography 
                variant="h6" 
                sx={{ cursor: 'pointer', '&:hover': { color: 'primary.main' } }}
                onClick={() => handleViewProject(project.id)}
              >
                {project.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {project.description}
              </Typography>
            </Grid>
            
            <Grid item xs={12} md={2}>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Chip
                  label={project.status}
                  size="small"
                  color={getStatusColor(project.status)}
                />
                <Chip
                  label={project.priority}
                  size="small"
                  color={getPriorityColor(project.priority)}
                />
              </Box>
            </Grid>
            
            <Grid item xs={12} md={2}>
              <Box sx={{ width: '100%' }}>
                <Typography variant="caption" color="text.secondary">
                  Progress: {project.completionPercentage}%
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={project.completionPercentage} 
                  sx={{ height: 6, borderRadius: 3 }}
                />
              </Box>
            </Grid>
            
            <Grid item xs={12} md={2}>
              <Typography variant="body2">
                <CalendarTodayIcon sx={{ fontSize: 16, verticalAlign: 'middle', mr: 1 }} />
                {formatDate(project.endDate)}
              </Typography>
              {daysUntilDue !== null && (
                <Typography 
                  variant="caption" 
                  color={daysUntilDue < 0 ? 'error' : daysUntilDue <= 7 ? 'warning.main' : 'text.secondary'}
                >
                  {daysUntilDue < 0 ? `${Math.abs(daysUntilDue)}d overdue` : `${daysUntilDue}d left`}
                </Typography>
              )}
            </Grid>
            
            <Grid item xs={12} md={2}>
              <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                <Tooltip title="View Details">
                  <IconButton
                    size="small"
                    onClick={() => handleViewProject(project.id)}
                  >
                    <ScheduleIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Edit">
                  <IconButton
                    size="small"
                    onClick={() => handleEditProject(project.id)}
                  >
                    <EditIcon />
                  </IconButton>
                </Tooltip>
                <IconButton
                  size="small"
                  onClick={(e) => handleProjectMenu(e, project)}
                >
                  <MoreVertIcon />
                </IconButton>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    );
  };

  return (
    <Box>
      {/* Header and Filters */}
      <Box sx={{ mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              placeholder="Search projects..."
              variant="outlined"
              size="small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          
          <Grid item xs={6} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                label="Status"
              >
                <MenuItem value="all">All Status</MenuItem>
                <MenuItem value="Pipeline">Pipeline</MenuItem>
                <MenuItem value="Ongoing">Ongoing</MenuItem>
                <MenuItem value="Completed">Completed</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={6} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Priority</InputLabel>
              <Select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                label="Priority"
              >
                <MenuItem value="all">All Priority</MenuItem>
                <MenuItem value="High">High</MenuItem>
                <MenuItem value="Medium">Medium</MenuItem>
                <MenuItem value="Low">Low</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={6} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Category</InputLabel>
              <Select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                label="Category"
              >
                <MenuItem value="all">All Categories</MenuItem>
                {categories.map(cat => (
                  <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={6} md={2}>
            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Sort By</InputLabel>
                <Select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  label="Sort By"
                >
                  <MenuItem value="lastUpdated">Last Updated</MenuItem>
                  <MenuItem value="name">Name</MenuItem>
                  <MenuItem value="startDate">Start Date</MenuItem>
                  <MenuItem value="endDate">End Date</MenuItem>
                  <MenuItem value="priority">Priority</MenuItem>
                  <MenuItem value="progress">Progress</MenuItem>
                </Select>
              </FormControl>
              
              <ToggleButtonGroup
                value={viewMode}
                exclusive
                onChange={(e, newMode) => newMode && setViewMode(newMode)}
                size="small"
              >
                <ToggleButton value="cards">
                  <ViewModuleIcon />
                </ToggleButton>
                <ToggleButton value="list">
                  <ViewListIcon />
                </ToggleButton>
              </ToggleButtonGroup>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Project Count */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Showing {filteredProjects.length} of {projects.length} projects
        </Typography>
      </Box>

      {/* Projects Display */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <Typography>Loading projects...</Typography>
        </Box>
      ) : filteredProjects.length === 0 ? (
        <Box sx={{ textAlign: 'center', p: 3 }}>
          <Typography variant="h6" color="text.secondary">
            No projects found
          </Typography>
        </Box>
      ) : viewMode === 'cards' ? (
        <Grid container spacing={3}>
          {filteredProjects.map(project => renderProjectCard(project))}
        </Grid>
      ) : (
        <Box>
          {filteredProjects.map(project => renderProjectListItem(project))}
        </Box>
      )}

      {/* Project Actions Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
      >
        <MenuItem onClick={() => {
          handleViewProject(selectedProject?.id);
          handleCloseMenu();
        }}>
          View Details
        </MenuItem>
        <MenuItem onClick={() => {
          handleEditProject(selectedProject?.id);
          handleCloseMenu();
        }}>
          Edit Project
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => {
          handleQuickStatusChange(selectedProject?.id, 'Ongoing');
          handleCloseMenu();
        }}>
          Mark as Ongoing
        </MenuItem>
        <MenuItem onClick={() => {
          handleQuickStatusChange(selectedProject?.id, 'Completed');
          handleCloseMenu();
        }}>
          Mark as Completed
        </MenuItem>
        <Divider />
        <MenuItem 
          onClick={() => handleDeleteProject(selectedProject?.id)}
          sx={{ color: 'error.main' }}
        >
          Delete Project
        </MenuItem>
      </Menu>
    </Box>
  );
}

export default ProjectList;