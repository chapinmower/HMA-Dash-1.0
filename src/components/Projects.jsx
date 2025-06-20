import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Tabs,
  Tab
} from '@mui/material';
import {
  Add as AddIcon,
  List as ListIcon,
  Timeline as TimelineIcon,
  Dashboard as DashboardIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import ProjectList from './projects/ProjectList';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`projects-tabpanel-${index}`}
      aria-labelledby={`projects-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `projects-tab-${index}`,
    'aria-controls': `projects-tabpanel-${index}`,
  };
}

function Projects() {
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleCreateProject = () => {
    // Navigate to requests page with project type pre-selected
    navigate('/requests?type=project');
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Projects
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleCreateProject}
        >
          New Project
        </Button>
      </Box>

      <Paper sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange}
            indicatorColor="primary"
            textColor="primary"
          >
            <Tab 
              label="All Projects" 
              icon={<ListIcon />} 
              iconPosition="start"
              {...a11yProps(0)} 
            />
            <Tab 
              label="Timeline View" 
              icon={<TimelineIcon />} 
              iconPosition="start"
              {...a11yProps(1)} 
            />
            <Tab 
              label="Tracker Dashboard" 
              icon={<DashboardIcon />} 
              iconPosition="start"
              {...a11yProps(2)} 
            />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          <ProjectList />
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary">
              Timeline View
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              Click below to navigate to the existing Timeline view
            </Typography>
            <Button
              variant="outlined"
              color="primary"
              sx={{ mt: 2 }}
              onClick={() => navigate('/timeline')}
            >
              Go to Timeline
            </Button>
          </Box>
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary">
              Project Tracker Dashboard
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              Click below to navigate to the existing Project Tracker
            </Typography>
            <Button
              variant="outlined"
              color="primary"
              sx={{ mt: 2 }}
              onClick={() => navigate('/project-tracker')}
            >
              Go to Project Tracker
            </Button>
          </Box>
        </TabPanel>
      </Paper>
    </Box>
  );
}

export default Projects;