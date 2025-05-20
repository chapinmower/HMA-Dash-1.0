import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  List, 
  ListItem, 
  ListItemText, 
  Paper, 
  Tabs, 
  Tab, 
  CircularProgress, 
  Chip, 
  Button, 
  Grid,
  LinearProgress
} from '@mui/material';
import { Link } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import CancelIcon from '@mui/icons-material/Cancel';
import { 
  Timeline as MuiTimeline, 
  TimelineItem, 
  TimelineSeparator, 
  TimelineConnector, 
  TimelineContent, 
  TimelineDot, 
  TimelineOppositeContent 
} from '@mui/lab';
// Using MUI components only for better compatibility
// import Timeline from 'react-vis-timeline';
// import 'vis-timeline/dist/vis-timeline-graph2d.min.css';

// Define the TabPanel helper component (can be reused or defined here)
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`project-timeline-tabpanel-${index}`}
      aria-labelledby={`project-timeline-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

// Helper for accessibility props
function a11yProps(index) {
  return {
    id: `project-timeline-tab-${index}`,
    'aria-controls': `project-timeline-tabpanel-${index}`,
  };
}

function ProjectTimeline() {
  const [tabValue, setTabValue] = useState(0); // State for tabs
  const [ongoingProjects, setOngoingProjects] = useState([]); // State for ongoing projects
  const [pastProjects, setPastProjects] = useState([]); // State for past projects
  const [pipelineProjects, setPipelineProjects] = useState([]); // State for pipeline projects
  const [loading, setLoading] = useState(true); // State for loading indicator
  const [viewMode, setViewMode] = useState('list'); // State for view mode: 'list' or 'timeline'
  const [selectedProject, setSelectedProject] = useState(null); // State for selected project to show timeline

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const toggleViewMode = () => {
    setViewMode(viewMode === 'list' ? 'timeline' : 'list');
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      // Fetch data directly from the public projects.json file using PUBLIC_URL
      const projectsUrl = `${process.env.PUBLIC_URL}/data/projects.json`;
      const response = await fetch(projectsUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json(); // The JSON is a direct array
      const allProjects = data.projects || []; // Access projects array

      // Separate ongoing, pipeline, and past projects
      const ongoing = allProjects.filter(project => !project.completedDate && project.status !== 'Planned');
      const pipeline = allProjects.filter(project => project.status === 'Planned');
      const past = allProjects.filter(project => project.completedDate);

      setOngoingProjects(ongoing);
      setPipelineProjects(pipeline);
      setPastProjects(past);
    } catch (error) {
      console.error('Error fetching projects:', error);
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

  // Render project card with status indicators
  const renderProjectCard = (project) => {
    const completedTasks = project.tasks ? project.tasks.filter(task => task.progress === 100).length : 0;
    const inProgressTasks = project.tasks ? project.tasks.filter(task => task.progress > 0 && task.progress < 100).length : 0;
    const totalTasks = project.tasks ? project.tasks.length : 0;
    
    return (
      <Paper 
        key={project.id}
        sx={{ 
          p: 3, 
          mb: 2, 
          borderLeft: '5px solid', 
          borderColor: project.status === 'In Progress' ? 'orange' : project.status === 'Completed' ? 'green' : 'blue',
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: 6,
            transform: 'translateY(-2px)',
          }
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12} md={8}>
            <Link to={`/timeline/${project.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <Typography variant="h6" component="h2" gutterBottom>{project.name}</Typography>
            </Link>
            <Typography variant="body2" color="text.secondary" paragraph>{project.description}</Typography>
            <Box sx={{ display: 'flex', gap: 1, mt: 1, flexWrap: 'wrap' }}>
              <Chip 
                icon={<CheckCircleIcon />} 
                label={`${completedTasks} Completed`} 
                color="success" 
                size="small" 
                variant="outlined"
              />
              <Chip 
                icon={<HourglassEmptyIcon />} 
                label={`${inProgressTasks} In Progress`} 
                color="warning" 
                size="small" 
                variant="outlined"
              />
              <Chip 
                icon={<CancelIcon />} 
                label={`${totalTasks - completedTasks - inProgressTasks} Not Started`} 
                color="error" 
                size="small" 
                variant="outlined"
              />
            </Box>
          </Grid>
          <Grid item xs={12} md={4} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Chip 
                label={`${project.completionPercentage}% Complete`} 
                color={
                  project.completionPercentage === 100 ? 'success' : 
                  project.completionPercentage > 50 ? 'warning' : 
                  'error'
                }
              />
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
              <Button 
                variant="outlined" 
                size="small" 
                onClick={(e) => {
                  e.preventDefault();
                  setSelectedProject(project);
                  setViewMode('timeline');
                }}
              >
                View Timeline
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    );
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Project Timeline
        </Typography>
        {selectedProject ? (
          <Button 
            variant="outlined" 
            onClick={() => {
              setSelectedProject(null);
              setViewMode('list');
            }}
          >
            <ArrowBackIcon sx={{ mr: 1 }} />
            Back to Projects
          </Button>
        ) : (
          <Button 
            variant="contained" 
            onClick={toggleViewMode}
            disabled={loading}
          >
            {viewMode === 'list' ? 'Timeline View' : 'List View'}
          </Button>
        )}
      </Box>

      {selectedProject ? (
        <Box>
          <Typography variant="h5" component="h2" gutterBottom>
            {selectedProject.name} Timeline
          </Typography>
          <Paper sx={{ p: 2, mb: 3 }}>
            {/* Timeline visualization replaced with MUI components */}
            <Box sx={{ p: 2 }}>
              <MuiTimeline position="alternate">
                {selectedProject.tasks && selectedProject.tasks.map((task, index) => (
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
                      {index < selectedProject.tasks.length - 1 && <TimelineConnector />}
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
          </Paper>
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>Project Details</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="subtitle1">Start Date</Typography>
                  <Typography variant="body1">
                    {selectedProject.startDate ? new Date(selectedProject.startDate).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    }) : 'Not specified'}
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="subtitle1">End Date</Typography>
                  <Typography variant="body1">
                    {selectedProject.endDate ? new Date(selectedProject.endDate).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    }) : 'Not specified'}
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="subtitle1">Completion</Typography>
                  <Box sx={{ 
                    height: 20, 
                    width: '100%', 
                    bgcolor: '#e0e0e0',
                    borderRadius: 1,
                    overflow: 'hidden'
                  }}>
                    <Box 
                      sx={{ 
                        height: '100%', 
                        width: `${selectedProject.completionPercentage}%`, 
                        bgcolor: selectedProject.completionPercentage === 100 ? 'success.main' : selectedProject.completionPercentage > 50 ? 'warning.main' : 'error.main',
                        transition: 'width 1s ease-in-out'
                      }}
                    />
                  </Box>
                  <Typography align="center" variant="body2" sx={{ mt: 1 }}>
                    {selectedProject.completionPercentage}% Complete
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          </Box>
        </Box>
      ) : (
        <>
          <Paper sx={{ mb: 4 }}>
            <Tabs value={tabValue} onChange={handleTabChange} aria-label="project timeline tabs">
              <Tab label="Ongoing/Recurring Projects" {...a11yProps(0)} />
              <Tab label="Pipeline Projects" {...a11yProps(1)} />
              <Tab
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    Past Projects
                    {tabValue === 2 && ( // Show arrow only on Past Projects tab
                      <ArrowBackIcon
                        sx={{ ml: 1, cursor: 'pointer' }}
                        onClick={(event) => {
                          event.stopPropagation(); // Prevent tab change on icon click
                          setTabValue(0); // Switch to Ongoing/Recurring tab
                        }}
                      />
                    )}
                  </Box>
                }
                {...a11yProps(2)}
              />
            </Tabs>

            <TabPanel value={tabValue} index={0}>
              {/* Ongoing/Recurring Projects */}
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                  <CircularProgress />
                </Box>
              ) : (
                <Box>
                  {ongoingProjects.length > 0 ? (
                    viewMode === 'list' ? (
                      // List view
                      ongoingProjects.map(project => renderProjectCard(project))
                    ) : (
                      // Timeline view - show all projects in a single timeline
                      <Box sx={{ mt: 2 }}>
                        {/* Timeline visualization replaced with MUI components */}
                        <Paper sx={{ p: 2, mb: 2 }}>
                          <Typography variant="subtitle1" gutterBottom>
                            Timeline view - using MUI components for compatibility
                          </Typography>
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            {ongoingProjects.map(project => (
                              <Paper key={project.id} sx={{ p: 2, borderLeft: '5px solid', borderColor: 'warning.main' }}>
                                <Typography variant="h6">{project.name}</Typography>
                                <Box sx={{ 
                                  height: 10, 
                                  width: '100%', 
                                  bgcolor: '#e0e0e0',
                                  borderRadius: 1,
                                  overflow: 'hidden',
                                  my: 1
                                }}>
                                  <Box 
                                    sx={{ 
                                      height: '100%', 
                                      width: `${project.completionPercentage}%`, 
                                      bgcolor: project.completionPercentage === 100 ? 'success.main' : project.completionPercentage > 50 ? 'warning.main' : 'error.main'
                                    }}
                                  />
                                </Box>
                                <Typography variant="body2">{project.completionPercentage}% Complete</Typography>
                                {project.tasks && project.tasks.length > 0 && (
                                  <MuiTimeline position="alternate" sx={{ mt: 2 }}>
                                    {project.tasks.map((task, index) => (
                                      <TimelineItem key={task.id}>
                                        <TimelineOppositeContent color="text.secondary">
                                          {new Date(task.due_date || project.startDate).toLocaleDateString('en-US', { 
                                            month: 'short', 
                                            day: 'numeric'
                                          })}
                                        </TimelineOppositeContent>
                                        <TimelineSeparator>
                                          <TimelineDot color={task.progress === 100 ? 'success' : task.progress > 0 ? 'warning' : 'error'} />
                                          {index < project.tasks.length - 1 && <TimelineConnector />}
                                        </TimelineSeparator>
                                        <TimelineContent>
                                          <Typography variant="body2">{task.title}</Typography>
                                        </TimelineContent>
                                      </TimelineItem>
                                    ))}
                                  </MuiTimeline>
                                )}
                              </Paper>
                            ))}
                          </Box>
                        </Paper>
                      </Box>
                    )
                  ) : (
                    <Typography variant="body1">No ongoing projects found.</Typography>
                  )}
                </Box>
              )}
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
              {/* Pipeline Projects */}
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                  <CircularProgress />
                </Box>
              ) : (
                <Box>
                  {pipelineProjects.length > 0 ? (
                    viewMode === 'list' ? (
                      // List view
                      pipelineProjects.map(project => renderProjectCard(project))
                    ) : (
                      // Timeline view
                      <Box sx={{ mt: 2 }}>
                        <Paper sx={{ p: 2, mb: 2 }}>
                          <Typography variant="subtitle1" gutterBottom>
                            Timeline view - Pipeline Projects
                          </Typography>
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            {pipelineProjects.map(project => (
                              <Paper key={project.id} sx={{ p: 2, borderLeft: '5px solid', borderColor: 'info.main' }}>
                                <Typography variant="h6">{project.name}</Typography>
                                <Box sx={{ 
                                  height: 10, 
                                  width: '100%', 
                                  bgcolor: '#e0e0e0',
                                  borderRadius: 1,
                                  overflow: 'hidden',
                                  my: 1
                                }}>
                                  <Box 
                                    sx={{ 
                                      height: '100%', 
                                      width: `${project.completionPercentage}%`, 
                                      bgcolor: 'info.main'
                                    }}
                                  />
                                </Box>
                                <Typography variant="body2">{project.completionPercentage}% Complete</Typography>
                                {project.tasks && project.tasks.length > 0 && (
                                  <MuiTimeline position="alternate" sx={{ mt: 2 }}>
                                    {project.tasks.map((task, index) => (
                                      <TimelineItem key={task.id}>
                                        <TimelineOppositeContent color="text.secondary">
                                          {new Date(task.due_date || project.startDate).toLocaleDateString('en-US', { 
                                            month: 'short', 
                                            day: 'numeric'
                                          })}
                                        </TimelineOppositeContent>
                                        <TimelineSeparator>
                                          <TimelineDot color={task.progress === 100 ? 'success' : task.progress > 0 ? 'warning' : 'info'} />
                                          {index < project.tasks.length - 1 && <TimelineConnector />}
                                        </TimelineSeparator>
                                        <TimelineContent>
                                          <Typography variant="body2">{task.title}</Typography>
                                        </TimelineContent>
                                      </TimelineItem>
                                    ))}
                                  </MuiTimeline>
                                )}
                              </Paper>
                            ))}
                          </Box>
                        </Paper>
                      </Box>
                    )
                  ) : (
                    <Typography variant="body1">No pipeline projects found.</Typography>
                  )}
                </Box>
              )}
            </TabPanel>

            <TabPanel value={tabValue} index={2}>
              {/* Past Projects */}
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                  <CircularProgress />
                </Box>
              ) : (
                <Box>
                  {pastProjects.length > 0 ? (
                    viewMode === 'list' ? (
                      // List view
                      pastProjects.map(project => renderProjectCard(project))
                    ) : (
                      // Timeline view
                      <Box sx={{ mt: 2 }}>
                        {/* Timeline visualization replaced with MUI components */}
                        <Paper sx={{ p: 2, mb: 2 }}>
                          <Typography variant="subtitle1" gutterBottom>
                            Timeline view - using MUI components for compatibility
                          </Typography>
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            {pastProjects.map(project => (
                              <Paper key={project.id} sx={{ p: 2, borderLeft: '5px solid', borderColor: 'success.main' }}>
                                <Typography variant="h6">{project.name}</Typography>
                                <Box sx={{ 
                                  height: 10, 
                                  width: '100%', 
                                  bgcolor: '#e0e0e0',
                                  borderRadius: 1,
                                  overflow: 'hidden',
                                  my: 1
                                }}>
                                  <Box 
                                    sx={{ 
                                      height: '100%', 
                                      width: `${project.completionPercentage}%`, 
                                      bgcolor: 'success.main'
                                    }}
                                  />
                                </Box>
                                <Typography variant="body2">100% Complete</Typography>
                                {project.tasks && project.tasks.length > 0 && (
                                  <MuiTimeline position="alternate" sx={{ mt: 2 }}>
                                    {project.tasks.map((task, index) => (
                                      <TimelineItem key={task.id}>
                                        <TimelineOppositeContent color="text.secondary">
                                          {new Date(task.due_date || project.startDate).toLocaleDateString('en-US', { 
                                            month: 'short', 
                                            day: 'numeric'
                                          })}
                                        </TimelineOppositeContent>
                                        <TimelineSeparator>
                                          <TimelineDot color="success" />
                                          {index < project.tasks.length - 1 && <TimelineConnector />}
                                        </TimelineSeparator>
                                        <TimelineContent>
                                          <Typography variant="body2">{task.title}</Typography>
                                        </TimelineContent>
                                      </TimelineItem>
                                    ))}
                                  </MuiTimeline>
                                )}
                              </Paper>
                            ))}
                          </Box>
                        </Paper>
                      </Box>
                    )
                  ) : (
                    <Typography variant="body1">No past projects found.</Typography>
                  )}
                </Box>
              )}
            </TabPanel>
          </Paper>
        </>
      )}
    </Box>
  );
}

export default ProjectTimeline;