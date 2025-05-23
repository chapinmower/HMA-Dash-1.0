import React, { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress, Paper, FormControl, InputLabel, Select, MenuItem, Grid, ToggleButtonGroup, ToggleButton } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function HistoricalTrends({ metricType = 'email' }) {
  const [trendData, setTrendData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState('6m'); // Default to 6 months
  const [metrics, setMetrics] = useState([]); // Metrics to show

  // Available metrics by type
  const availableMetrics = {
    email: [
      { key: 'openRate', display: 'Open Rate' },
      { key: 'clickRate', display: 'Click Rate' },
      { key: 'totalSent', display: 'Total Sent' }
    ],
    website: [
      { key: 'visitors', display: 'Visitors' },
      { key: 'pageViews', display: 'Page Views' },
      { key: 'bounceRate', display: 'Bounce Rate' }
    ],
    engagement: [
      { key: 'averageEngagementScore', display: 'Engagement Score' },
      { key: 'engagedContacts', display: 'Engaged Contacts' },
      { key: 'totalEvents', display: 'Total Events' }
    ]
  };

  // Set default metrics based on type
  useEffect(() => {
    if (metricType === 'email') {
      setMetrics(['openRate', 'clickRate']);
    } else if (metricType === 'website') {
      setMetrics(['visitors', 'pageViews']);
    } else if (metricType === 'engagement') {
      setMetrics(['averageEngagementScore', 'engagedContacts']);
    }
  }, [metricType]);

  useEffect(() => {
    const fetchTrendData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Calculate date range based on timeRange
        const endDate = new Date();
        let startDate = new Date();
        
        switch (timeRange) {
          case '3m':
            startDate.setMonth(endDate.getMonth() - 3);
            break;
          case '6m':
            startDate.setMonth(endDate.getMonth() - 6);
            break;
          case '1y':
            startDate.setFullYear(endDate.getFullYear() - 1);
            break;
          case '2y':
            startDate.setFullYear(endDate.getFullYear() - 2);
            break;
          default:
            startDate.setMonth(endDate.getMonth() - 6);
        }
        
        // Format dates for filtering
        const startDateStr = startDate.toISOString().split('T')[0];
        
        // Load appropriate data file
        let jsonFile;
        if (metricType === 'email') {
          jsonFile = '/data/historical_email_metrics.json';
        } else if (metricType === 'website') {
          jsonFile = '/data/historical_website_metrics.json';
        } else if (metricType === 'engagement') {
          jsonFile = '/data/historical_engagement_metrics.json';
        }
        
        if (jsonFile) {
          const response = await fetch(jsonFile);
          const data = await response.json();
          
          if (data.monthlyMetrics) {
            // Filter by date range
            const filteredData = data.monthlyMetrics.filter(m => {
              return m.startDate >= startDateStr;
            });
            
            // Sort by date ascending for charts
            filteredData.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
            
            setTrendData(filteredData);
          }
        }
      } catch (err) {
        console.error(`Error fetching ${metricType} trend data:`, err);
        setError(`Failed to load trend data: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTrendData();
  }, [metricType, timeRange]);

  const handleTimeRangeChange = (event) => {
    setTimeRange(event.target.value);
  };

  const handleMetricsChange = (event, newMetrics) => {
    // Ensure at least one metric is selected
    if (newMetrics.length) {
      setMetrics(newMetrics);
    }
  };

  const formatYAxisValue = (value, metric) => {
    if (metric === 'openRate' || metric === 'clickRate' || metric === 'bounceRate') {
      return `${(value * 100).toFixed(0)}%`;
    }
    return value >= 1000 ? `${(value / 1000).toFixed(1)}k` : value;
  };

  const formatTooltipValue = (value, name) => {
    const metricObj = availableMetrics[metricType].find(m => m.key === name);
    const metricName = metricObj ? metricObj.display : name;
    
    if (name === 'openRate' || name === 'clickRate' || name === 'bounceRate') {
      return [`${(value * 100).toFixed(2)}%`, metricName];
    }
    return [value.toLocaleString(), metricName];
  };

  // Colors for different metrics
  const colors = {
    openRate: '#82ca9d',
    clickRate: '#8884d8',
    totalSent: '#ffc658',
    visitors: '#82ca9d',
    pageViews: '#8884d8',
    bounceRate: '#ff8042',
    averageEngagementScore: '#82ca9d',
    engagedContacts: '#8884d8',
    totalEvents: '#ffc658'
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ my: 2 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ mb: 4 }}>
      <Grid container spacing={2} sx={{ mb: 3 }} alignItems="center">
        <Grid item xs={12} sm={4} md={3}>
          <FormControl fullWidth size="small">
            <InputLabel id="time-range-select-label">Time Range</InputLabel>
            <Select
              labelId="time-range-select-label"
              id="time-range-select"
              value={timeRange}
              label="Time Range"
              onChange={handleTimeRangeChange}
            >
              <MenuItem value="3m">Last 3 Months</MenuItem>
              <MenuItem value="6m">Last 6 Months</MenuItem>
              <MenuItem value="1y">Last Year</MenuItem>
              <MenuItem value="2y">Last 2 Years</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        
        <Grid item xs={12} sm={8} md={9}>
          <ToggleButtonGroup
            value={metrics}
            onChange={handleMetricsChange}
            aria-label="metrics to display"
            size="small"
          >
            {availableMetrics[metricType].map((metric) => (
              <ToggleButton 
                key={metric.key} 
                value={metric.key} 
                aria-label={metric.display}
                sx={{ 
                  '&.Mui-selected': { 
                    bgcolor: `${colors[metric.key]}20`,
                    borderColor: colors[metric.key],
                    color: colors[metric.key]
                  }
                }}
              >
                {metric.display}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Grid>
      </Grid>
      
      <Paper sx={{ p: 2 }}>
        {trendData.length === 0 ? (
          <Typography>No trend data available for the selected period.</Typography>
        ) : (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart
              data={trendData}
              margin={{ top: 10, right: 30, left: 10, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="periodLabel" 
                tickMargin={10}
              />
              <YAxis 
                yAxisId="left"
                orientation="left"
                tickFormatter={(value) => formatYAxisValue(value)} 
                domain={['auto', 'auto']}
              />
              <YAxis 
                yAxisId="right"
                orientation="right"
                tickFormatter={(value) => formatYAxisValue(value)} 
                domain={['auto', 'auto']}
              />
              <Tooltip 
                formatter={formatTooltipValue}
                labelFormatter={(label) => `Period: ${label}`}
              />
              <Legend />
              
              {metrics.map((metric, index) => {
                const metricObj = availableMetrics[metricType].find(m => m.key === metric);
                // Use left axis for first metric, right for second
                const axisId = index === 0 ? "left" : "right";
                
                return (
                  <Line
                    key={metric}
                    type="monotone"
                    dataKey={metric}
                    name={metricObj ? metricObj.display : metric}
                    stroke={colors[metric]}
                    activeDot={{ r: 8 }}
                    yAxisId={axisId}
                    strokeWidth={2}
                  />
                );
              })}
            </LineChart>
          </ResponsiveContainer>
        )}
      </Paper>
    </Box>
  );
}

export default HistoricalTrends;