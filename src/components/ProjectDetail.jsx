import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  List, 
  ListItem, 
  ListItemText, 
  IconButton, 
  Link as MuiLink, 
  CircularProgress, 
  Chip,
  Grid,
  Divider,
  Card,
  CardContent,
  LinearProgress,
  Stack
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import CancelIcon from '@mui/icons-material/Cancel';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import BarChartIcon from '@mui/icons-material/BarChart';
import PeopleIcon from '@mui/icons-material/People';
import AttachFileIcon from '@mui/icons-material/AttachFile';
// Using MUI Timeline component only for better compatibility
// import Timeline from 'react-vis-timeline';
import { Timeline as MuiTimeline, TimelineItem, TimelineSeparator, TimelineConnector, TimelineContent, TimelineDot, TimelineOppositeContent } from '@mui/lab';
// import 'vis-timeline/dist/vis-timeline-graph2d.min.css';

function ProjectDetail() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [projectData, setProjectData] = useState(null); // State for project data
  const [loading, setLoading] = useState(true); // State for loading indicator
  const [viewMode, setViewMode] = useState('timeline'); // State for view mode: 'timeline' or 'list'

  const handleBackClick = () => {
    navigate('/timeline'); // Navigate back to the Project Timeline tab
  };

  const toggleViewMode = () => {
    setViewMode(viewMode === 'timeline' ? 'list' : 'timeline');
  };

  useEffect(() => {
    fetchProjectDetail(projectId);
  }, [projectId]); // Re-run effect if projectId changes

  const fetchProjectDetail = async (id) => {
    setLoading(true);
    try {
      // Fetch data directly from the public projects.json file
      const projectsUrl = `${process.env.PUBLIC_URL}/data/projects.json`;
      const response = await fetch(projectsUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      const allProjects = data.projects || []; // Assuming the JSON file has an 'projects' array

      // Find the specific project by ID
      const foundProject = allProjects.find(project => project.id.toString() === id);

      setProjectData(foundProject);
    } catch (error) {
      console.error(`Error fetching project details for ID ${id}:`, error);
      setProjectData(null); // Set projectData to null on error
      // Handle error, maybe set an error state
    } finally {
      setLoading(false);
    }
  };

  // Helper function to format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'No date';
    try {
      return new Date(dateString).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: 'numeric'
      });
    } catch (e) {
      console.error('Date formatting error:', e);
      return dateString;
    }
  };

  if (loading) {
    return (
      <Box sx={{ p: 3, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!projectData) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Project Not Found
        </Typography>
        <Typography variant="body1">
          The project with ID {projectId} could not be found.
        </Typography>
      </Box>
    );
  }

  // Calculate task statistics
  const totalTasks = projectData.tasks ? projectData.tasks.length : 0;
  const completedTasks = projectData.tasks ? projectData.tasks.filter(task => task.progress === 100).length : 0;
  const inProgressTasks = projectData.tasks ? projectData.tasks.filter(task => task.progress > 0 && task.progress < 100).length : 0;
  const notStartedTasks = totalTasks - completedTasks - inProgressTasks;

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <IconButton onClick={handleBackClick} sx={{ mr: 1 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 0 }}>
          {projectData.name}
        </Typography>
      </Box>
      
      <Grid container spacing={3}>
        {/* Project Summary Card */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3, mb: 3, borderRadius: 2, boxShadow: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={8}>
                <Typography variant="h6" gutterBottom>Project Overview</Typography>
                <Typography variant="body1" paragraph>
                  {projectData.description}
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
                  <Chip 
                    icon={<CalendarMonthIcon />} 
                    label={`Start: ${new Date(projectData.startDate + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`} 
                    variant="outlined" 
                  />
                  <Chip 
                    icon={<CalendarMonthIcon />} 
                    label={`End: ${new Date(projectData.endDate + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`} 
                    variant="outlined" 
                  />
                  <Chip 
                    icon={<BarChartIcon />} 
                    label={`Status: ${projectData.status}`}
                    color={
                      projectData.status === 'Completed' ? 'success' : 
                      projectData.status === 'In Progress' ? 'warning' : 
                      'primary'
                    }
                  />
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="h6" gutterBottom>Completion</Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    {projectData.completionPercentage}% Complete
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={projectData.completionPercentage} 
                    sx={{ 
                      height: 10, 
                      borderRadius: 5,
                      mb: 2,
                      bgcolor: '#e0e0e0',
                      '& .MuiLinearProgress-bar': {
                        bgcolor: projectData.completionPercentage === 100 ? 'success.main' : 
                                projectData.completionPercentage > 50 ? 'warning.main' : 
                                'error.main',
                      }
                    }} 
                  />
                </Box>
                <Typography variant="h6" gutterBottom>Task Status</Typography>
                <Stack direction="column" spacing={1}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <CheckCircleIcon color="success" sx={{ mr: 1 }} />
                      <Typography variant="body2">Completed</Typography>
                    </Box>
                    <Typography variant="body2">{completedTasks} / {totalTasks}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <HourglassEmptyIcon color="warning" sx={{ mr: 1 }} />
                      <Typography variant="body2">In Progress</Typography>
                    </Box>
                    <Typography variant="body2">{inProgressTasks} / {totalTasks}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <CancelIcon color="error" sx={{ mr: 1 }} />
                      <Typography variant="body2">Not Started</Typography>
                    </Box>
                    <Typography variant="body2">{notStartedTasks} / {totalTasks}</Typography>
                  </Box>
                </Stack>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Timeline Visualization */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3, mb: 3, borderRadius: 2, boxShadow: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" gutterBottom>
                Project Timeline
              </Typography>
              <Chip 
                label={viewMode === 'timeline' ? 'Interactive Timeline' : 'Task List'} 
                onClick={toggleViewMode} 
                clickable 
                color="primary"
              />
            </Box>
            
            {viewMode === 'timeline' ? (
              <Box sx={{ position: 'relative' }}>
                {/* Timeline visualization replaced with MUI components */}
                <Box sx={{ p: 2 }}>
                  <MuiTimeline position="alternate">
                    {projectData.tasks && projectData.tasks.map((task, index) => (
                      <TimelineItem key={task.id}>
                        <TimelineOppositeContent color="text.secondary">
                          {task.due_date ? new Date(task.due_date).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric',
                            year: 'numeric'
                          }) : 'No date specified'}
                        </TimelineOppositeContent>
                        <TimelineSeparator>
                          <TimelineDot 
                            color={
                              task.progress === 100 ? 'success' : 
                              task.progress > 0 ? 'warning' : 
                              'error'
                            }
                          >
                            {task.progress === 100 ? 
                              <CheckCircleIcon /> : 
                              task.progress > 0 ? 
                              <HourglassEmptyIcon /> : 
                              <CancelIcon />
                            }
                          </TimelineDot>
                          {index < projectData.tasks.length - 1 && <TimelineConnector />}
                        </TimelineSeparator>
                        <TimelineContent>
                          <Paper elevation={3} sx={{ p: 2, borderRadius: 2 }}>
                            <Typography variant="h6" component="h3">
                              {task.title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {task.description}
                            </Typography>
                            {task.progress > 0 && (
                              <LinearProgress 
                                variant="determinate" 
                                value={task.progress} 
                                sx={{ 
                                  mt: 1,
                                  height: 6, 
                                  borderRadius: 3
                                }}
                              />
                            )}
                          </Paper>
                        </TimelineContent>
                      </TimelineItem>
                    ))}
                  </MuiTimeline>
                </Box>
              </Box>
            ) : (
              <MuiTimeline position="alternate">
                {projectData.tasks && projectData.tasks.map((task, index) => (
                  <TimelineItem key={task.id}>
                    <TimelineOppositeContent color="text.secondary">
                      {task.due_date ? new Date(task.due_date + 'T00:00:00').toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric',
                        year: 'numeric'
                      }) : 'No date specified'}
                    </TimelineOppositeContent>
                    <TimelineSeparator>
                      <TimelineDot 
                        color={
                          task.progress === 100 ? 'success' : 
                          task.progress > 0 ? 'warning' : 
                          'error'
                        }
                      >
                        {task.progress === 100 ? 
                          <CheckCircleIcon /> : 
                          task.progress > 0 ? 
                          <HourglassEmptyIcon /> : 
                          <CancelIcon />
                        }
                      </TimelineDot>
                      {index < projectData.tasks.length - 1 && <TimelineConnector />}
                    </TimelineSeparator>
                    <TimelineContent>
                      <Paper elevation={3} sx={{ p: 2, borderRadius: 2 }}>
                        <Typography variant="h6" component="h3">
                          {task.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {task.description}
                        </Typography>
                        {task.progress > 0 && (
                          <LinearProgress 
                            variant="determinate" 
                            value={task.progress} 
                            sx={{ 
                              mt: 1,
                              height: 6, 
                              borderRadius: 3
                            }}
                          />
                        )}
                      </Paper>
                    </TimelineContent>
                  </TimelineItem>
                ))}
              </MuiTimeline>
            )}
          </Paper>
        </Grid>

        {/* Conditional Budget/Cost section for Swag Order and Prospect/Happy Hour Event projects */}
        {(projectId === '10' || projectId === '11') && (projectData.budget || projectData.cost) && (
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 3, height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                Budget
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Typography variant="body1" sx={{ mb: 1 }}>
                Budget: ${projectData.budget ? projectData.budget.toLocaleString() : 'Not specified'}
              </Typography>
              {projectData.cost && (
                <Typography variant="body1">
                  Cost: ${projectData.cost.toLocaleString()}
                </Typography>
              )}
            </Paper>
          </Grid>
        )}

        {/* Conditional Suggestions section for Prospect/Happy Hour Event project */}
        {projectId === '11' && projectData.suggestions && projectData.suggestions.length > 0 && (
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 3, height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                Suggestions
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <List>
                {projectData.suggestions.map((suggestion) => (
                  <ListItem key={suggestion.id}>
                    <ListItemText primary={suggestion.text} />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>
        )}

        {/* Conditional To-Do section for Website Re-Vamp and Swag Order projects */}
        {(projectId === '7' || projectId === '10') && projectData.todo && projectData.todo.length > 0 && (
          <Grid item xs={12}>
            <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 3 }}>
              <Typography variant="h6" gutterBottom>
                To-Do List
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <List>
                {projectData.todo.map((item) => (
                  <ListItem key={item.id}>
                    <ListItemText primary={item.name} />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>
        )}

        {/* Conditional Linked Resources section */}
        {projectData.resources && projectData.resources.length > 0 && (
          <Grid item xs={12}>
            <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AttachFileIcon sx={{ mr: 1 }} />
                <Typography variant="h6" gutterBottom sx={{ mb: 0 }}>
                  Linked Resources
                </Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />
              <Grid container spacing={2}>
                {projectData.resources.map((resource) => (
                  <Grid item xs={12} md={6} lg={4} key={resource.id}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="h6" component="h3">
                          <MuiLink href={resource.path} target="_blank" rel="noopener noreferrer">
                            {resource.name}
                          </MuiLink>
                        </Typography>
                        {resource.description && (
                          <Typography variant="body2" color="text.secondary">
                            {resource.description}
                          </Typography>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </Grid>
        )}
      </Grid>
    </Box>
  );
}

export default ProjectDetail;