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
  
  const [websiteMetrics, setWebsiteMetrics] = useState({
    visits: 'N/A',
    pageViews: 'N/A',
    avgSessionDuration: 'N/A',
    bounceRate: 'N/A',
    period: 'N/A'
  });

  const [contactMetrics, setContactMetrics] = useState({
    totalContacts: 'N/A',
    totalEngagementEvents: 'N/A',
    totalClicks: 'N/A'
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
        
        // Fetch email data from historical metrics (more accurate)
        const emailResponse = await fetch(`${process.env.PUBLIC_URL}/data/historical_email_metrics.json`);
        if (!emailResponse.ok) throw new Error('Failed to load email analytics');
        const emailData = await emailResponse.json();
        
        // Fetch website data
        const websiteResponse = await fetch(`${process.env.PUBLIC_URL}/data/website_analytics.json`);
        if (!websiteResponse.ok) throw new Error('Failed to load website analytics');
        const websiteData = await websiteResponse.json();

        // Fetch contact data
        const contactResponse = await fetch(`${process.env.PUBLIC_URL}/data/contacts.json`);
        if (!contactResponse.ok) throw new Error('Failed to load contact data');
        const contactData = await contactResponse.json();
        
        // Update state with historical data - use March 2025 data
        if (emailData.monthlyMetrics && emailData.monthlyMetrics.length > 0) {
          // Find March 2025 data specifically
          const marchData = emailData.monthlyMetrics.find(month => month.period === '2025-03');
          
          if (marchData) {
            setEmailMetrics({
              opens: marchData.totalOpened,
              clicks: marchData.totalClicked,
              clickThroughRate: `${(marchData.clickRate * 100).toFixed(1)}%`,
              openRate: `${(marchData.openRate * 100).toFixed(1)}%`,
              customEngagement: `${(marchData.openRate * 100).toFixed(1)}%`,
              period: marchData.periodLabel
            });
          } else {
            // Fallback to latest month if March 2025 not found
            const latest = emailData.monthlyMetrics[0]; // First item is most recent
            setEmailMetrics({
              opens: latest.totalOpened,
              clicks: latest.totalClicked,
              clickThroughRate: `${(latest.clickRate * 100).toFixed(1)}%`,
              openRate: `${(latest.openRate * 100).toFixed(1)}%`,
              customEngagement: `${(latest.openRate * 100).toFixed(1)}%`,
              period: latest.periodLabel
            });
          }
          
          // Set last updated to current time since this is historical data
          setLastUpdated(new Date());
        }
        
        if (websiteData.summaries && websiteData.summaries.length > 0) {
          const latest = websiteData.summaries[websiteData.summaries.length - 1];
          setWebsiteMetrics({
            visits: latest.sessions,
            pageViews: latest.pageViews,
            avgSessionDuration: latest.avgSessionDuration,
            bounceRate: latest.bounceRate,
            period: latest.period
          });
          
          // If email data doesn't have timestamp but website does, use that
          if (!lastUpdated && latest.lastUpdated) {
            setLastUpdated(new Date(latest.lastUpdated));
          }
        }

        // Process contact engagement data
        if (contactData.contacts && contactData.engagementEvents) {
          const totalContacts = contactData.contacts.length;
          const allEvents = Object.values(contactData.engagementEvents).flat();
          const totalEngagementEvents = allEvents.length;
          const totalClicks = allEvents.filter(event => event.type === 'Email Click').length;

          setContactMetrics({
            totalContacts,
            totalEngagementEvents,
            totalClicks
          });
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
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={4}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h5" component="div">{contactMetrics.totalContacts}</Typography>
                <Typography color="text.secondary">Total Contacts</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h5" component="div">{contactMetrics.totalEngagementEvents}</Typography>
                <Typography color="text.secondary">Total Engagement Events</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h5" component="div">{contactMetrics.totalClicks}</Typography>
                <Typography color="text.secondary">Email Link Clicks</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>

      {/* Historical Metrics Overview Section */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Historical Performance Metrics</Typography>
          <Button 
            component={Link} 
            to="/analytics" 
            endIcon={<ArrowForwardIcon />}
            size="small"
          >
            View All Analytics
          </Button>
        </Box>
        
        <Divider sx={{ mb: 3 }} />
        
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <HistoricalMetricsWidget 
              metricType="email" 
              metric="openRate" 
              title="Email Performance" 
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <HistoricalMetricsWidget 
              metricType="email" 
              metric="clickRate" 
              title="Email Clicks" 
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <HistoricalMetricsWidget 
              metricType="website" 
              metric="visitors" 
              title="Website Traffic" 
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <HistoricalMetricsWidget 
              metricType="engagement" 
              metric="averageEngagementScore" 
              title="Contact Engagement" 
            />
          </Grid>
        </Grid>
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
