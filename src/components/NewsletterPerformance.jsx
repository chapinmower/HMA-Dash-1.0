import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Grid,
  Paper
} from '@mui/material';
import apiClient, { getEmailAnalyticsSummary } from '../apiClient';
import { BarChart, createChartData } from './ChartComponents';

// Remove all hardcoded data
// const lorraineData = { ... };
// const februaryData = { ... };
// const januaryData = { ... };
// const marchMetrics = { ... };
// const marchCampaigns = { ... };
// const topClickers = [ ... ];
// const marchInsights = [ ... ];

// Remove internal MetricCard and CampaignCard components
// const MetricCard = (...) => { ... };
// const CampaignCard = (...) => { ... };

// Remove TabPanel component
// function TabPanel(props) { ... }

// Remove duplicate import from here
// import { Grid, Paper } from '@mui/material';

// Re-add MetricCard component definition (or import if moved to shared location)
const MetricCard = ({ title, value, description }) => (
  <Paper elevation={2} sx={{ p: 2, textAlign: 'center', height: '100%' }}>
    <Typography color="textSecondary" gutterBottom sx={{ fontSize: '0.9rem' }}>
      {title}
    </Typography>
    <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
      {value ?? 'N/A'}
    </Typography>
    {description && (
       <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
         {description}
       </Typography>
     )}
  </Paper>
);


function NewsletterPerformance({ dateRange }) { // Accept dateRange as a prop
  const [analyticsData, setAnalyticsData] = useState({ overall: null, campaigns: [] }); // Store both overall and campaign data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSummary = async () => {
      setLoading(true);
      setError(null);
      setAnalyticsData({ overall: null, campaigns: [] }); // Reset data
      // Prepare query parameters based on dateRange
      const params = {};
      if (dateRange?.startDate) {
          params.startDate = dateRange.startDate;
      }
      if (dateRange?.endDate) {
          params.endDate = dateRange.endDate;
      }

      try {
        // Pass params to the API call
        const response = await apiClient.get('/api/analytics/email-summary', { params });
        // API now returns { overall: {...}, campaigns: [...] }
        setAnalyticsData({
            overall: response.data?.overall || null,
            campaigns: response.data?.campaigns || []
        });
      } catch (err) {
        console.error(`Error fetching email summary for range ${dateRange?.startDate}-${dateRange?.endDate}:`, err);
        setError(err.response?.data?.details || err.message || `Failed to load email campaign summary for the selected period.`);
        setAnalyticsData({ overall: null, campaigns: [] }); // Ensure reset on error
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, [dateRange]); // Re-run effect when dateRange changes

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  const { overall, campaigns } = analyticsData;

  // Prepare campaign comparison chart data
  const prepareCampaignComparisonData = () => {
    if (!campaigns || campaigns.length === 0) return null;
    
    return createChartData(
      campaigns.map(c => c.name),
      [
        {
          label: 'Open Rate (%)',
          values: campaigns.map(c => c.openRate.toFixed(2)),
          backgroundColor: 'rgba(16, 89, 56, 0.6)',
          borderColor: 'rgba(16, 89, 56, 1)',
          borderWidth: 1,
        },
        {
          label: 'Click Rate (%)',
          values: campaigns.map(c => c.clickRate.toFixed(2)),
          backgroundColor: 'rgba(77, 140, 111, 0.6)',
          borderColor: 'rgba(77, 140, 111, 1)',
          borderWidth: 1,
        }
      ]
    );
  };


  return (
    <Box sx={{ mt: 4 }}>
       <Typography variant="h5" gutterBottom sx={{ color: 'primary.main', borderBottom: 2, borderColor: 'primary.main', pb: 1, mb: 3 }}>
        Email Campaign Performance
      </Typography>

      {/* Overall Stats Cards */}
      {overall && (
          <Grid container spacing={2} sx={{ mb: 4 }}>
              <Grid item xs={12} sm={6} md={3}>
                  <MetricCard
                      title="Total Sent"
                      value={overall.totalSent?.toLocaleString()}
                      description={`To ${overall.uniqueRecipients?.toLocaleString()} unique contacts`}
                   />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                  <MetricCard
                      title="Unique Opens"
                      value={overall.uniqueOpeners?.toLocaleString()}
                      description={`${overall.overallOpenRate?.toFixed(1)}% Open Rate`}
                   />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                  <MetricCard
                      title="Unique Clickers"
                      value={overall.uniqueClickers?.toLocaleString()}
                      description={`${overall.overallClickRate?.toFixed(1)}% Click Rate`}
                   />
              </Grid>
               <Grid item xs={12} sm={6} md={3}>
                  <MetricCard
                      title="Total Clicks"
                      value={overall.totalClicks?.toLocaleString()}
                   />
              </Grid>
          </Grid>
      )}

      {campaigns.length === 0 ? (
        <Typography>No email campaigns found for the selected period.</Typography>
      ) : (
        <> {/* Use Fragment to wrap table and chart */}
          <Typography variant="h6" gutterBottom>Campaign Breakdown</Typography>
          <TableContainer component={Paper} sx={{ mb: 4 }}>
            <Table aria-label="email campaign summary table" size="small">
              <TableHead sx={{ backgroundColor: 'primary.light' }}>
                <TableRow>
                  <TableCell sx={{ color: 'primary.contrastText', fontWeight: 'bold' }}>Campaign Name</TableCell>
                  <TableCell align="right" sx={{ color: 'primary.contrastText', fontWeight: 'bold' }}>Latest Sent</TableCell>
                  <TableCell align="right" sx={{ color: 'primary.contrastText', fontWeight: 'bold' }}>Unique Recipients</TableCell>
                  {/* <TableCell align="right" sx={{ color: 'primary.contrastText', fontWeight: 'bold' }}>Total Sent</TableCell> */}
                  <TableCell align="right" sx={{ color: 'primary.contrastText', fontWeight: 'bold' }}>Opens</TableCell>
                  <TableCell align="right" sx={{ color: 'primary.contrastText', fontWeight: 'bold' }}>Open Rate</TableCell>
                  <TableCell align="right" sx={{ color: 'primary.contrastText', fontWeight: 'bold' }}>Clicks</TableCell>
                  <TableCell align="right" sx={{ color: 'primary.contrastText', fontWeight: 'bold' }}>Click Rate</TableCell>
                  <TableCell sx={{ color: 'primary.contrastText', fontWeight: 'bold' }}>Clicked Content IDs</TableCell> {/* New Column Header */}
                </TableRow>
              </TableHead>
              <TableBody>
                {campaigns.map((campaign) => (
                <TableRow
                  key={campaign.name}
                  sx={{ '&:nth-of-type(even)': { backgroundColor: 'action.hover' }, '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {campaign.name}
                  </TableCell>
                  <TableCell align="right">{campaign.latestSentDate || 'N/A'}</TableCell>
                  <TableCell align="right">{campaign.uniqueRecipients.toLocaleString()}</TableCell>
                  {/* <TableCell align="right">{campaign.totalSent.toLocaleString()}</TableCell> */}
                  <TableCell align="right">{campaign.totalOpened.toLocaleString()}</TableCell>
                  <TableCell align="right">{campaign.openRate.toFixed(1)}%</TableCell>
                  <TableCell align="right">{campaign.totalClicked.toLocaleString()}</TableCell>
                  <TableCell align="right">{campaign.clickRate.toFixed(1)}%</TableCell>
                  <TableCell> {/* New Column Data */}
                    {(() => {
                      try {
                        // clickedContentIds from API is a JSON string array, e.g., '["id1", "id2"]' or null
                        const ids = campaign.clickedContentIds ? JSON.parse(campaign.clickedContentIds) : [];
                        return ids.length > 0 ? ids.join(', ') : 'None';
                      } catch (e) {
                        console.error("Error parsing clickedContentIds:", campaign.clickedContentIds, e);
                        return 'Error';
                      }
                    })()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Campaign Comparison Chart */}
        <BarChart
          title="Campaign Open & Click Rates"
          data={prepareCampaignComparisonData()}
          options={{
            plugins: {
              tooltip: {
                callbacks: {
                  label: function(context) {
                    let label = context.dataset.label || '';
                    if (label) {
                      label += ': ';
                    }
                    if (context.parsed.y !== null) {
                      label += context.parsed.y + '%';
                    }
                    return label;
                  }
                }
              }
            },
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  callback: function(value) {
                    return value + '%'; // Add percent sign to y-axis ticks
                  }
                }
              }
            }
          }}
        />
       </>
      )}
    </Box>
  );
}

export default NewsletterPerformance;
