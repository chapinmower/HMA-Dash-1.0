import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, List, ListItem, ListItemText, IconButton, Link as MuiLink, CircularProgress } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import CancelIcon from '@mui/icons-material/Cancel';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

function ProjectDetail() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [projectData, setProjectData] = useState(null); // State for project data
  const [loading, setLoading] = useState(true); // State for loading indicator

  const handleBackClick = () => {
    navigate('/timeline'); // Navigate back to the Project Timeline tab
  };

  useEffect(() => {
    fetchProjectDetail(projectId);
  }, [projectId]); // Re-run effect if projectId changes

  const fetchProjectDetail = async (id) => {
    setLoading(true);
    try {
      // Fetch data directly from the public projects.json file
      const projectsUrl = `${process.env.PUBLIC_URL}/projects.json`;
      const response = await fetch(projectsUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      const allProjects = data.items || []; // Assuming the JSON file has an 'items' array

      // Find the specific project by ID
      const foundProject = allProjects.find(project => project.id === id);

      setProjectData(foundProject);
    } catch (error) {
      console.error(`Error fetching project details for ID ${id}:`, error);
      setProjectData(null); // Set projectData to null on error
      // Handle error, maybe set an error state
    } finally {
      setLoading(false);
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

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <IconButton onClick={handleBackClick} sx={{ mr: 1 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 0 }}>
          Project Detail: {projectData.name}
        </Typography>
      </Box>
      <Typography variant="body1" color="text.secondary" gutterBottom>
        {projectData.description}
      </Typography>

      {/* Conditional Budget/Cost section for Swag Order and Prospect/Happy Hour Event projects */}
      {(projectId === '10' || projectId === '11') && (projectData.budget || projectData.cost) && (
        <Paper sx={{ mt: 3, p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Budget
          </Typography>
          <Typography variant="body1">
            Budget: ${projectData.budget ? projectData.budget.toLocaleString() : 'Not specified'}
          </Typography>
          {projectData.cost && (
            <Typography variant="body1">
              Cost: ${projectData.cost.toLocaleString()}
            </Typography>
          )}
        </Paper>
      )}

      {/* Conditional Suggestions section for Prospect/Happy Hour Event project */}
      {projectId === '11' && projectData.suggestions && projectData.suggestions.length > 0 && (
        <Paper sx={{ mt: 3, p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Suggestions
          </Typography>
          <List>
            {projectData.suggestions.map((suggestion) => (
              <ListItem key={suggestion.id}>
                <ListItemText primary={suggestion.text} />
              </ListItem>
            ))}
          </List>
        </Paper>
      )}


      <Paper sx={{ mt: 3, p: 2 }}>
        <Typography variant="h6" gutterBottom>
          {projectId === '8' ? 'To-do list' : 'Project Timeline and Progress'}
        </Typography>
        <List>
          {projectData.tasks && projectData.tasks.map((task) => ( // Add check for projectData.tasks
            <ListItem key={task.id} sx={{ flexDirection: 'column', alignItems: 'flex-start' }}>
              <ListItemText
                primary={task.name}
                secondary={
                  task.startDate && task.endDate // Check if dates exist
                    ? task.startDate === task.endDate
                      ? `Date: ${new Date(task.startDate + 'T00:00:00').toLocaleDateString('en-US', { month: 'long', day: 'numeric' })} ${task.details ? task.details : ''}` // Added details for time
                      : `Dates: ${new Date(task.startDate + 'T00:00:00').toLocaleDateString('en-US', { month: 'long', day: 'numeric' })} to ${new Date(task.endDate + 'T00:00:00').toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}`
                    : 'Date: Not specified' // Display if no dates
                }
              />
              <Box sx={{ mt: 1 }}>
                {task.progress === 100 ? (
                  <CheckCircleIcon color="success" />
                ) : task.progress > 0 ? (
                  <HourglassEmptyIcon color="warning" />
                ) : (
                  <CancelIcon color="error" />
                )}
              </Box>
            </ListItem>
          ))}
        </List>
      </Paper>

      {/* Conditional To-Do section for Website Re-Vamp and Swag Order projects */}
      {(projectId === '7' || projectId === '10') && projectData.todo && projectData.todo.length > 0 && (
        <Paper sx={{ mt: 3, p: 2 }}>
          <Typography variant="h6" gutterBottom>
            To-Do
          </Typography>
          <List>
            {projectData.todo.map((item) => (
              <ListItem key={item.id}>
                <ListItemText primary={item.name} />
              </ListItem>
            ))}
          </List>
        </Paper>
      )}

       {/* Conditional Linked Resources section */}
       {projectData.resources && projectData.resources.length > 0 && (
        <Paper sx={{ mt: 3, p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Linked Resources
          </Typography>
          <List>
            {projectData.resources.map((resource) => (
              <ListItem key={resource.id}>
                <ListItemText
                  primary={
                    <MuiLink href={resource.path} target="_blank" rel="noopener noreferrer">
                      {resource.name}
                    </MuiLink>
                  }
                />
              </ListItem>
            ))}
          </List>
        </Paper>
      )}

      {/* You can add more sections here for notes, resources, etc. */}
    </Box>
  );
}

export default ProjectDetail;