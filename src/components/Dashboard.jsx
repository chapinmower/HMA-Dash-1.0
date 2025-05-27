import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Paper,
  Button,
  Alert,
  Divider,
} from '@mui/material';
import { ArrowForward as ArrowForwardIcon } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import BlogPerformance from './BlogPerformance';
import ProjectTimeline from './ProjectTimeline';
import HistoricalMetricsWidget from './widgets/HistoricalMetricsWidget';

function Dashboard() {
  const [emailMetrics, setEmailMetrics] = useState({
    opens: 'N/A',
    clicks: 'N/A',
    clickThroughRate: 'N/A',
    openRate: 'N/A',
    customEngagement: 'N/A',
    period: 'N/A'
  });
  
  
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Fetch data from our static JSON files
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch email data
        const emailResponse = await fetch(`${process.env.PUBLIC_URL}/data/email_analytics.json`);
        if (!emailResponse.ok) throw new Error('Failed to load email analytics');
        const emailData = await emailResponse.json();
        
        // Fetch last updated timestamp
        try {
          const timestampResponse = await fetch(`${process.env.PUBLIC_URL}/data/last_updated.json`);
          if (timestampResponse.ok) {
            const timestampData = await timestampResponse.json();
            setLastUpdated(timestampData.timestamp);
          }
        } catch (err) {
          console.log('No timestamp file found');
        }
        
        // Fetch projects data
        const projectsResponse = await fetch(`${process.env.PUBLIC_URL}/data/projects.json`);
        if (!projectsResponse.ok) throw new Error('Failed to load projects data');
        const projectsData = await projectsResponse.json();
        
        // Update state with most recent data (first item in each array)
        if (emailData.summaries && emailData.summaries.length > 0) {
          // Use the most recent data (first item in the array)
          const mostRecentEmailData = emailData.summaries[0];
          setEmailMetrics(mostRecentEmailData);
          
          // Set last updated timestamp if available
          if (mostRecentEmailData.lastUpdated) {
            setLastUpdated(new Date(mostRecentEmailData.lastUpdated));
          }
        }
        
        
        // Set active/ongoing projects
        if (projectsData.projects && projectsData.projects.length > 0) {
          // Filter for active projects and take the first 3
          const activeProjects = projectsData.projects
            .filter(project => project.status === 'In Progress')
            .slice(0, 3);
          setProjects(activeProjects);
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', mb: 2 }}>
        <Typography variant="h4" component="h1">
          HMA Marketing Dashboard
        </Typography>
        {lastUpdated && (
          <Typography variant="caption" color="text.secondary">
            Last updated: {new Date(lastUpdated).toLocaleString()}
          </Typography>
        )}
      </Box>
      
      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      {/* Email Performance Section */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">
            Email Performance {emailMetrics.period ? `(${emailMetrics.period})` : ''}
          </Typography>
          <Button 
            component={Link} 
            to="/analytics/email" 
            endIcon={<ArrowForwardIcon />}
            size="small"
          >
            View Details
          </Button>
        </Box>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={2.4}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h5" component="div">{emailMetrics.opens}</Typography>
                <Typography color="text.secondary">Opens</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h5" component="div">{emailMetrics.clicks}</Typography>
                <Typography color="text.secondary">Clicks</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h5" component="div">{emailMetrics.clickThroughRate}</Typography>
                <Typography color="text.secondary">Click-Through Rate</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h5" component="div">{emailMetrics.openRate}</Typography>
                <Typography color="text.secondary">Open Rate</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h5" component="div">{emailMetrics.customEngagement}</Typography>
                <Typography color="text.secondary">Custom Engagement</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>
      
      {/* Website Analytics Reports Section */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">
            Website Analytics Reports
          </Typography>
          <Button 
            component={Link} 
            to="/analytics/website" 
            endIcon={<ArrowForwardIcon />}
            size="small"
          >
            View All Reports
          </Button>
        </Box>
        <Typography variant="body1" sx={{ mb: 2 }}>
          View detailed Google Analytics reports for website performance, traffic, and user engagement metrics.
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={4}>
            <Button
              variant="outlined"
              fullWidth
              href="/reports/April 2025 MTD 0428.pdf"
              target="_blank"
              rel="noopener noreferrer"
            >
              April 2025 MTD Report
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Button
              variant="outlined"
              fullWidth
              href="/reports/April 25 Google Analytics.pdf"
              target="_blank"
              rel="noopener noreferrer"
            >
              April 25 GA Report
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Button
              variant="outlined"
              fullWidth
              href="/reports/HMA Google Analytics 2024 Calendar Year.pdf"
              target="_blank"
              rel="noopener noreferrer"
            >
              2024 Annual Report
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Active Projects Overview */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">
            Active Projects
          </Typography>
          <Button 
            component={Link} 
            to="/projects" 
            endIcon={<ArrowForwardIcon />}
            size="small"
          >
            View All Projects
          </Button>
        </Box>
        {projects.length > 0 ? (
          <Grid container spacing={3}>
            {projects.map((project) => (
              <Grid item xs={12} md={4} key={project.id}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" component="div" gutterBottom>
                      {project.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {project.description}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Typography variant="body2" sx={{ mr: 1 }}>
                        Progress: {project.completionPercentage}%
                      </Typography>
                      <Box sx={{ width: '100%', ml: 1 }}>
                        <Box
                          sx={{
                            height: 8,
                            backgroundColor: '#e0e0e0',
                            borderRadius: 4,
                            position: 'relative'
                          }}
                        >
                          <Box
                            sx={{
                              height: '100%',
                              backgroundColor: 'primary.main',
                              borderRadius: 4,
                              width: `${project.completionPercentage}%`,
                            }}
                          />
                        </Box>
                      </Box>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      Due: {new Date(project.endDate).toLocaleDateString()}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography variant="body1" color="text.secondary">
            No active projects at this time.
          </Typography>
        )}
      </Paper>

      {/* Contact Engagement Section - Link to Reports */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">
            Contact Engagement
          </Typography>
          <Button 
            component={Link} 
            to="/contact-engagement" 
            endIcon={<ArrowForwardIcon />}
            size="small"
          >
            View Reports
          </Button>
        </Box>
        <Typography variant="body1">
          View detailed reports on contact engagement including email opens, clicks, and interaction metrics.
          The April 2025 engagement reports are now available.
        </Typography>
      </Paper>

      {/* Ongoing Projects Section */}
      <ProjectTimeline />

      <Typography variant="body2" color="text.secondary" sx={{ mt: 4, textAlign: 'center' }}>
        Last updated: {lastUpdated ? lastUpdated.toLocaleString() : new Date().toLocaleDateString()}
      </Typography>
    </Box>
  );
}

export default Dashboard;