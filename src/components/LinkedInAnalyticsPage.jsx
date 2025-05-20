import React, { useState, useEffect } from 'react';
import { Box, Typography, Select, MenuItem, FormControl, InputLabel, Grid, Paper, CircularProgress, Alert } from '@mui/material';
import apiClient from '../apiClient';

// Helper function to get year range (last 5 years)
const getYearOptions = () => {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let i = 0; i < 5; i++) {
    years.push(currentYear - i);
  }
  return years;
};

// Helper function to get date range for a given year/month/quarter
const getDateRange = (year, period) => {
  if (!year || !period) return { startDate: null, endDate: null };
  
  let startDate, endDate;
  
  if (period === 'Q1') {
    startDate = `${year}-01-01`;
    endDate = `${year}-03-31`;
  } else if (period === 'Q2') {
    startDate = `${year}-04-01`;
    endDate = `${year}-06-30`;
  } else if (period === 'Q3') {
    startDate = `${year}-07-01`;
    endDate = `${year}-09-30`;
  } else if (period === 'Q4') {
    startDate = `${year}-10-01`;
    endDate = `${year}-12-31`;
  } else if (period === 'Full Year') {
    startDate = `${year}-01-01`;
    endDate = `${year}-12-31`;
  } else { // Monthly
    const month = parseInt(period, 10);
    if (month >= 1 && month <= 12) {
      const firstDay = new Date(year, month - 1, 1);
      const lastDay = new Date(year, month, 0); // Day 0 of next month is last day of current month
      startDate = firstDay.toISOString().split('T')[0];
      endDate = lastDay.toISOString().split('T')[0];
    } else {
      return { startDate: null, endDate: null }; // Invalid month
    }
  }
  return { startDate, endDate };
};

// Metric Card Component (similar to Dashboard)
const MetricCard = ({ title, value }) => (
  <Paper elevation={2} sx={{ p: 2, textAlign: 'center', height: '100%' }}>
    <Typography color="textSecondary" gutterBottom sx={{ fontSize: '0.9rem' }}>
      {title}
    </Typography>
    <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
      {value ?? 'N/A'}
    </Typography>
  </Paper>
);

// Example static data for Q1 2025
const q12025Data = {
  impressions: 5832,
  engagements: 312,
  clickThrough: 47,
  followers: 1245,
  followerChange: '+18',
  posts: [
    { title: 'Q1 Market Letter Highlights', date: '2025-03-15', impressions: 1245, reactions: 28, comments: 8, shares: 3 },
    { title: 'Welcome Dave Johnson to the HMA Team', date: '2025-02-20', impressions: 1876, reactions: 42, comments: 7, shares: 5 },
    { title: '2025 Tax Guide Now Available', date: '2025-01-18', impressions: 955, reactions: 17, comments: 2, shares: 4 }
  ]
};

function LinkedInAnalyticsPage() {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedPeriod, setSelectedPeriod] = useState('Q1'); // Default to Q1
  const [dateRange, setDateRange] = useState(getDateRange(currentYear, 'Q1'));
  const [summaryData, setSummaryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const yearOptions = getYearOptions();
  const periodOptions = ['Full Year', 'Q1', 'Q2', 'Q3', 'Q4', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];

  useEffect(() => {
    const fetchSummary = async () => {
      if (!dateRange.startDate || !dateRange.endDate) {
        setSummaryData(null); // Clear data if range is invalid
        return;
      }
      setLoading(true);
      setError(null);
      try {
        // Uncomment when API endpoint is available
        // const params = { startDate: dateRange.startDate, endDate: dateRange.endDate };
        // const response = await apiClient.get('/api/analytics/linkedin-summary', { params });
        // setSummaryData(response.data);
        
        // For now, return static data for Q1 2025
        setTimeout(() => {
          if (selectedYear === 2025 && selectedPeriod === 'Q1') {
            setSummaryData(q12025Data);
          } else {
            setSummaryData(null); // No data for other periods yet
          }
          setLoading(false);
        }, 1000); // Simulate API delay
      } catch (err) {
        console.error(`Error fetching LinkedIn summary for range ${dateRange.startDate}-${dateRange.endDate}:`, err);
        setError(err.response?.data?.details || err.message || `Failed to load LinkedIn summary for the selected period.`);
        setSummaryData(null); // Clear data on error
        setLoading(false);
      }
    };
    fetchSummary();
  }, [dateRange, selectedYear, selectedPeriod]); // Re-run when dateRange changes

  const handleYearChange = (event) => {
    const year = event.target.value;
    setSelectedYear(year);
    setDateRange(getDateRange(year, selectedPeriod));
  };

  const handlePeriodChange = (event) => {
    const period = event.target.value;
    setSelectedPeriod(period);
    setDateRange(getDateRange(selectedYear, period));
  };

  const getPeriodDisplayName = (period) => {
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthIndex = parseInt(period, 10);
    if (monthIndex >= 1 && monthIndex <= 12) return monthNames[monthIndex - 1];
    return period;
  };

  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        LinkedIn Analytics
      </Typography>

      {/* Date Range Selection */}
      <Grid container spacing={2} sx={{ mb: 3, alignItems: 'center' }}>
        <Grid item>
          <FormControl size="small">
            <InputLabel id="year-select-label">Year</InputLabel>
            <Select
              labelId="year-select-label"
              id="year-select"
              value={selectedYear}
              label="Year"
              onChange={handleYearChange}
              sx={{ minWidth: 100 }}
            >
              {yearOptions.map(year => (
                <MenuItem key={year} value={year}>{year}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item>
          <FormControl size="small">
            <InputLabel id="period-select-label">Period</InputLabel>
            <Select
              labelId="period-select-label"
              id="period-select"
              value={selectedPeriod}
              label="Period"
              onChange={handlePeriodChange}
              sx={{ minWidth: 120 }}
            >
              {periodOptions.map(period => (
                <MenuItem key={period} value={period}>{getPeriodDisplayName(period)}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {/* Content Area */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}><CircularProgress /></Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : !summaryData ? (
        <Typography sx={{ mt: 2 }}>No LinkedIn analytics data found for the selected period. Please enter data via the Data Entry page.</Typography>
      ) : (
        <Grid container spacing={3}>
          {/* Stat Cards */}
          <Grid item xs={12} sm={6} md={3}>
            <MetricCard title="Impressions" value={summaryData.impressions?.toLocaleString()} />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <MetricCard title="Engagements" value={summaryData.engagements?.toLocaleString()} />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <MetricCard title="Click Through" value={summaryData.clickThrough?.toLocaleString()} />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <MetricCard 
              title="Followers" 
              value={`${summaryData.followers?.toLocaleString()} (${summaryData.followerChange})`} 
            />
          </Grid>

          {/* Top Posts Table */}
          <Grid item xs={12}>
            <Paper elevation={2} sx={{ p: 2, mt: 2 }}>
              <Typography variant="h6" gutterBottom>
                Top Performing Posts
              </Typography>
              
              <Box sx={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #e0e0e0' }}>
                      <th style={{ padding: '12px 16px', textAlign: 'left' }}>Post</th>
                      <th style={{ padding: '12px 16px', textAlign: 'center' }}>Date</th>
                      <th style={{ padding: '12px 16px', textAlign: 'center' }}>Impressions</th>
                      <th style={{ padding: '12px 16px', textAlign: 'center' }}>Reactions</th>
                      <th style={{ padding: '12px 16px', textAlign: 'center' }}>Comments</th>
                      <th style={{ padding: '12px 16px', textAlign: 'center' }}>Shares</th>
                    </tr>
                  </thead>
                  <tbody>
                    {summaryData.posts.map((post, index) => (
                      <tr key={index} style={{ borderBottom: '1px solid #e0e0e0' }}>
                        <td style={{ padding: '12px 16px', textAlign: 'left' }}>{post.title}</td>
                        <td style={{ padding: '12px 16px', textAlign: 'center' }}>{formatDate(post.date)}</td>
                        <td style={{ padding: '12px 16px', textAlign: 'center' }}>{post.impressions.toLocaleString()}</td>
                        <td style={{ padding: '12px 16px', textAlign: 'center' }}>{post.reactions}</td>
                        <td style={{ padding: '12px 16px', textAlign: 'center' }}>{post.comments}</td>
                        <td style={{ padding: '12px 16px', textAlign: 'center' }}>{post.shares}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      )}

      <Typography variant="body2" color="text.secondary" sx={{ mt: 4 }}>
        Note: LinkedIn data is collected manually from LinkedIn Analytics dashboard exports. The API integration is planned for a future update.
      </Typography>
    </Box>
  );
}

export default LinkedInAnalyticsPage;