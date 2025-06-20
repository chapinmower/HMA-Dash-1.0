import React, { useState } from 'react'; // Added useState
import { useNavigate, useLocation } from 'react-router-dom';
import hmaLogo from '../assets/hma-logo.png'; // Import the logo image
import {
  Drawer,
  List,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Box,
  Typography,
  Collapse, // Added Collapse
  // Divider, // Removed unused import
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  // Campaign as CampaignIcon, // Removed unused CampaignIcon
  Analytics as AnalyticsIcon,
  Assignment as AssignmentIcon,
  Contacts as EngagementIcon, // Added Engagement icon
  Language as WebsiteIcon, // Added Website icon
  Email as EmailIcon, // Added Email icon
  LinkedIn as LinkedInIcon, // Added LinkedIn icon
  // People as ClientsIcon, // Removed unused Clients icon
  // PersonSearch as ProspectsIcon, // Removed unused Prospects icon
  ExpandLess, // Added ExpandLess icon
  ExpandMore, // Added ExpandMore icon
  Article as ArticleIcon, // Added Article icon for materials
  AddTask as RequestsIcon, // Added Requests icon
  Timeline as TimelineIcon, // Added Timeline icon
  TrendingUp as TrendsIcon, // Added Trends icon  
  Storage as DataIcon, // Added Data Management icon
  TaskAlt as TaskManagerIcon, // Added Task Manager icon
  FolderOpen as ProjectsIcon, // Added Projects icon
  // Logout as LogoutIcon, // Removed logout icon import
} from '@mui/icons-material';

const drawerWidth = 240;

// Removed menuItems array definition from here

// Removed user and onLogout props
function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [analyticsOpen, setAnalyticsOpen] = useState(false); // State for Analytics dropdown
  // const [engagementOpen, setEngagementOpen] = useState(false); // Removed state for Engagement dropdown

  const handleAnalyticsClick = () => {
    setAnalyticsOpen(!analyticsOpen);
  };

  // Removed handleEngagementClick handler

  // Define menu items structure including nested items
  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
    {
      text: 'Analytics',
      icon: <AnalyticsIcon />,
      onClick: handleAnalyticsClick,
      open: analyticsOpen,
      subItems: [
        { text: 'Website', icon: <WebsiteIcon />, path: '/analytics/website' },
        { text: 'Email', icon: <EmailIcon />, path: '/analytics/email' },
        { text: 'LinkedIn', icon: <LinkedInIcon />, path: '/analytics/linkedin' },
      ],
    },
    { text: 'Contact Engagement', icon: <EngagementIcon />, path: '/contact-engagement' }, // Changed to single link
    { text: 'Marketing Materials', icon: <ArticleIcon />, path: '/materials' }, // Added Marketing Materials
    { text: 'Task Manager', icon: <TaskManagerIcon />, path: '/task-manager' }, // Enhanced Task Manager
    { text: 'Projects', icon: <ProjectsIcon />, path: '/projects' }, // New Projects tab
    { text: 'Project Timeline', icon: <AssignmentIcon />, path: '/timeline' }, // Changed label to Project Timeline
    { text: 'Project Tracker', icon: <TimelineIcon />, path: '/project-tracker' }, // Added Project Tracker
    { text: 'Requests', icon: <RequestsIcon />, path: '/requests' },
    { text: 'Historical Trends', icon: <TrendsIcon />, path: '/trends' }, // Added Historical Trends
    { text: 'Data Management', icon: <DataIcon />, path: '/data-management' }, // Added Data Management
  ];


  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
        },
      }}
    >
      {/* Removed mt: 2 from here */}
      <Box sx={{ overflow: 'auto' }}>
        {/* Added Logo at the top */}
        <Box sx={{ p: 2, textAlign: 'center' }}>
          <img
            src={hmaLogo} // Use the imported logo variable
            alt="HMA Logo"
            style={{ height: '50px', marginBottom: '8px' }} // Adjust height and margin
          />
        </Box>
        {/* Kept HMA Marketing text below logo */}
        <Typography variant="h6" sx={{ p: 2, pt: 0, textAlign: 'center' }}> {/* Removed top padding */}
          HMA Marketing
        </Typography>
        <List>
          {menuItems.map((item) => (
            <React.Fragment key={item.text}>
              <ListItemButton
                onClick={item.subItems ? item.onClick : () => navigate(item.path)}
                selected={!item.subItems && location.pathname === item.path}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
                {item.subItems ? (item.open ? <ExpandLess /> : <ExpandMore />) : null}
              </ListItemButton>
              {item.subItems && (
                <Collapse in={item.open} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {item.subItems.map((subItem) => (
                      <ListItemButton
                        key={subItem.text}
                        sx={{ pl: 4 }} // Indent sub-items
                        selected={location.pathname === subItem.path}
                        onClick={() => navigate(subItem.path)}
                      >
                        <ListItemIcon>{subItem.icon}</ListItemIcon>
                        <ListItemText primary={subItem.text} />
                      </ListItemButton>
                    ))}
                  </List>
                </Collapse>
              )}
            </React.Fragment>
          ))}
        </List>
        {/* Divider and Logout Button/List removed */}
        {/* User display box removed */}
      </Box>
    </Drawer>
  );
}

export default Sidebar;
