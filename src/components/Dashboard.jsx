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
} from '@mui/material';
import { ArrowForward as ArrowForwardIcon } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import BlogPerformance from './BlogPerformance';
import ProjectTimeline from './ProjectTimeline';

function Dashboard() {
  const [emailMetrics, setEmailMetrics] = useState({
    opens: 'N/A',
    clicks: 'N/A',
    clickThroughRate: 'N/A',
    openRate: 'N/A',
    customEngagement: 'N/A',
    period: 'N/A'
  });
  
  const [websiteMetrics, setWebsiteMetrics] = useState({
    visits: 'N/A',
    pageViews: 'N/A',
    avgSessionDuration: 'N/A',
    bounceRate: 'N/A',
    period: 'N/A'
  });
  
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
        
        // Fetch website data
        const websiteResponse = await fetch(`${process.env.PUBLIC_URL}/data/website_analytics.json`);
        if (!websiteResponse.ok) throw new Error('Failed to load website analytics');
        const websiteData = await websiteResponse.json();
        
        // Update state with most recent data
        if (emailData.summaries && emailData.summaries.length > 0) {
          // Get the most recent email data (first item in array is most recent)
          const mostRecentEmailData = emailData.summaries[0];
          setEmailMetrics(mostRecentEmailData);
          
          // Set last updated timestamp if available
          if (mostRecentEmailData.lastUpdated) {
            setLastUpdated(new Date(mostRecentEmailData.lastUpdated));
          }
        }
        
        if (websiteData.summaries && websiteData.summaries.length > 0) {
          // Get the most recent website data (first item in array is most recent)
          const mostRecentWebsiteData = websiteData.summaries[0];
          setWebsiteMetrics(mostRecentWebsiteData);
          
          // If email data doesn't have timestamp but website does, use that
          if (!lastUpdated && mostRecentWebsiteData.lastUpdated) {
            setLastUpdated(new Date(mostRecentWebsiteData.lastUpdated));
          }
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
      <Typography variant="h4" component="h1" gutterBottom>
        HMA Marketing Dashboard
      </Typography>
      
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
      
      {/* Website Performance Section */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">
            Website Performance {websiteMetrics.period ? `(${websiteMetrics.period})` : ''}
          </Typography>
          <Button 
            component={Link} 
            to="/analytics/website" 
            endIcon={<ArrowForwardIcon />}
            size="small"
          >
            View Details
          </Button>
        </Box>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h5" component="div">{websiteMetrics.visits}</Typography>
                <Typography color="text.secondary">Visits</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h5" component="div">{websiteMetrics.pageViews}</Typography>
                <Typography color="text.secondary">Page Views</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h5" component="div">{websiteMetrics.avgSessionDuration}</Typography>
                <Typography color="text.secondary">Avg. Session Duration</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h5" component="div">{websiteMetrics.bounceRate}</Typography>
                <Typography color="text.secondary">Bounce Rate</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
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
