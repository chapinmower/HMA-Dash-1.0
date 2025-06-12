import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Alert
} from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  ComposedChart,
  Area,
  AreaChart
} from 'recharts';
import { loadStaticData } from '../apiClient';

const HistoricalTrends = () => {
  const [trendData, setTrendData] = useState(null);
  const [selectedMetric, setSelectedMetric] = useState('email');
  const [timeRange, setTimeRange] = useState('12months');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadTrendData();
  }, []);

  const loadTrendData = async () => {
    try {
      setLoading(true);
      const data = await loadStaticData('trend_data.json');
      setTrendData(data);
      setError(null);
    } catch (err) {
      setError('Failed to load historical trend data');
      console.error('Error loading trend data:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatTrendData = (data, metric) => {
    if (!data || !data[metric]) return [];
    
    return data[metric].map(item => ({
      ...item,
      // Convert percentage strings to numbers for better charting
      openRate: typeof item.openRate === 'string' ? 
        parseFloat(item.openRate.replace('%', '')) : item.openRate,
      clickThroughRate: typeof item.clickThroughRate === 'string' ? 
        parseFloat(item.clickThroughRate.replace('%', '')) : item.clickThroughRate,
      bounceRate: typeof item.bounceRate === 'string' ? 
        parseFloat(item.bounceRate.replace('%', '')) : item.bounceRate,
    }));
  };

  const renderEmailTrends = () => {
    const data = formatTrendData(trendData, 'email');
    if (data.length === 0) return <Alert severity="info">No email trend data available</Alert>;

    return (
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Email Opens & Clicks Trends</Typography>
              <ResponsiveContainer width="100%" height={300}>
                <ComposedChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="period" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="opens" fill="#105938" name="Opens" />
                  <Bar yAxisId="left" dataKey="clicks" fill="#2ab87b" name="Clicks" />
                  <Line 
                    yAxisId="right" 
                    type="monotone" 
                    dataKey="openRate" 
                    stroke="#dc004e" 
                    name="Open Rate %" 
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Click-Through Rate Trend</Typography>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="period" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value}%`, '']} />
                  <Area 
                    type="monotone" 
                    dataKey="clickThroughRate" 
                    stroke="#105938" 
                    fill="#105938" 
                    fillOpacity={0.3}
                    name="CTR %"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    );
  };

  const renderWebsiteTrends = () => {
    const data = formatTrendData(trendData, 'website');
    if (data.length === 0) return <Alert severity="info">No website trend data available</Alert>;

    return (
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Website Traffic Trends</Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="period" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="visits" 
                    stroke="#105938" 
                    strokeWidth={3}
                    name="Visits" 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="pageViews" 
                    stroke="#2ab87b" 
                    strokeWidth={2}
                    name="Page Views" 
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Bounce Rate Trend</Typography>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="period" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value}%`, '']} />
                  <Area 
                    type="monotone" 
                    dataKey="bounceRate" 
                    stroke="#dc004e" 
                    fill="#dc004e" 
                    fillOpacity={0.3}
                    name="Bounce Rate %"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    );
  };

  const renderLinkedInTrends = () => {
    const data = formatTrendData(trendData, 'linkedin');
    if (data.length === 0) return <Alert severity="info">No LinkedIn trend data available</Alert>;

    return (
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>LinkedIn Engagement Trends</Typography>
              <ResponsiveContainer width="100%" height={300}>
                <ComposedChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="period" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="impressions" fill="#0077b5" name="Impressions" />
                  <Bar yAxisId="left" dataKey="engagements" fill="#005885" name="Engagements" />
                  <Line 
                    yAxisId="right" 
                    type="monotone" 
                    dataKey="followers" 
                    stroke="#dc004e" 
                    name="Followers" 
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Follower Growth</Typography>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="period" />
                  <YAxis />
                  <Tooltip />
                  <Area 
                    type="monotone" 
                    dataKey="followers" 
                    stroke="#0077b5" 
                    fill="#0077b5" 
                    fillOpacity={0.3}
                    name="Followers"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    );
  };

  const renderMetricSummary = () => {
    if (!trendData) return null;

    const currentData = trendData[selectedMetric]?.[0] || {};
    const previousData = trendData[selectedMetric]?.[1] || {};

    const getChange = (current, previous, isPercentage = false) => {
      if (!current || !previous) return null;
      const change = ((current - previous) / previous) * 100;
      return isPercentage ? change.toFixed(1) : change.toFixed(0);
    };

    const getChangeChip = (change) => {
      if (change === null) return null;
      const isPositive = parseFloat(change) > 0;
      return (
        <Chip 
          label={`${isPositive ? '+' : ''}${change}%`}
          color={isPositive ? 'success' : 'error'}
          size="small"
          variant="outlined"
        />
      );
    };

    return (
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Current vs Previous Period ({selectedMetric.charAt(0).toUpperCase() + selectedMetric.slice(1)})
          </Typography>
          <Grid container spacing={2}>
            {selectedMetric === 'email' && (
              <>
                <Grid item xs={6} sm={3}>
                  <Box textAlign="center">
                    <Typography variant="h4" color="primary">
                      {currentData.opens?.toLocaleString() || 'N/A'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">Opens</Typography>
                    {getChangeChip(getChange(currentData.opens, previousData.opens))}
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box textAlign="center">
                    <Typography variant="h4" color="primary">
                      {currentData.clicks?.toLocaleString() || 'N/A'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">Clicks</Typography>
                    {getChangeChip(getChange(currentData.clicks, previousData.clicks))}
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box textAlign="center">
                    <Typography variant="h4" color="primary">
                      {currentData.openRate || 'N/A'}%
                    </Typography>
                    <Typography variant="body2" color="text.secondary">Open Rate</Typography>
                    {getChangeChip(getChange(currentData.openRate, previousData.openRate, true))}
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box textAlign="center">
                    <Typography variant="h4" color="primary">
                      {currentData.clickThroughRate || 'N/A'}%
                    </Typography>
                    <Typography variant="body2" color="text.secondary">CTR</Typography>
                    {getChangeChip(getChange(currentData.clickThroughRate, previousData.clickThroughRate, true))}
                  </Box>
                </Grid>
              </>
            )}
            
            {selectedMetric === 'website' && (
              <>
                <Grid item xs={6} sm={3}>
                  <Box textAlign="center">
                    <Typography variant="h4" color="primary">
                      {currentData.visits?.toLocaleString() || 'N/A'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">Visits</Typography>
                    {getChangeChip(getChange(currentData.visits, previousData.visits))}
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box textAlign="center">
                    <Typography variant="h4" color="primary">
                      {currentData.pageViews?.toLocaleString() || 'N/A'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">Page Views</Typography>
                    {getChangeChip(getChange(currentData.pageViews, previousData.pageViews))}
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box textAlign="center">
                    <Typography variant="h4" color="primary">
                      {currentData.bounceRate || 'N/A'}%
                    </Typography>
                    <Typography variant="body2" color="text.secondary">Bounce Rate</Typography>
                    {getChangeChip(getChange(currentData.bounceRate, previousData.bounceRate, true))}
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box textAlign="center">
                    <Typography variant="h4" color="primary">
                      {currentData.avgSessionDuration || 'N/A'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">Avg Session</Typography>
                  </Box>
                </Grid>
              </>
            )}
            
            {selectedMetric === 'linkedin' && (
              <>
                <Grid item xs={6} sm={3}>
                  <Box textAlign="center">
                    <Typography variant="h4" color="primary">
                      {currentData.impressions?.toLocaleString() || 'N/A'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">Impressions</Typography>
                    {getChangeChip(getChange(currentData.impressions, previousData.impressions))}
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box textAlign="center">
                    <Typography variant="h4" color="primary">
                      {currentData.engagements?.toLocaleString() || 'N/A'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">Engagements</Typography>
                    {getChangeChip(getChange(currentData.engagements, previousData.engagements))}
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box textAlign="center">
                    <Typography variant="h4" color="primary">
                      {currentData.followers?.toLocaleString() || 'N/A'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">Followers</Typography>
                    {getChangeChip(getChange(currentData.followers, previousData.followers))}
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box textAlign="center">
                    <Typography variant="h4" color="primary">
                      {currentData.clickThroughRate || 'N/A'}%
                    </Typography>
                    <Typography variant="body2" color="text.secondary">CTR</Typography>
                    {getChangeChip(getChange(currentData.clickThroughRate, previousData.clickThroughRate, true))}
                  </Box>
                </Grid>
              </>
            )}
          </Grid>
        </CardContent>
      </Card>
    );
  };

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Loading historical trends...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Historical Trends & Analytics
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Metric</InputLabel>
            <Select
              value={selectedMetric}
              label="Metric"
              onChange={(e) => setSelectedMetric(e.target.value)}
            >
              <MenuItem value="email">Email Marketing</MenuItem>
              <MenuItem value="website">Website Analytics</MenuItem>
              <MenuItem value="linkedin">LinkedIn</MenuItem>
            </Select>
          </FormControl>
          
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Time Range</InputLabel>
            <Select
              value={timeRange}
              label="Time Range"
              onChange={(e) => setTimeRange(e.target.value)}
            >
              <MenuItem value="6months">Last 6 Months</MenuItem>
              <MenuItem value="12months">Last 12 Months</MenuItem>
              <MenuItem value="24months">Last 24 Months</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      {trendData?.generatedAt && (
        <Alert severity="info" sx={{ mb: 3 }}>
          Trend data last updated: {new Date(trendData.generatedAt).toLocaleString()}
        </Alert>
      )}

      {renderMetricSummary()}

      {selectedMetric === 'email' && renderEmailTrends()}
      {selectedMetric === 'website' && renderWebsiteTrends()}
      {selectedMetric === 'linkedin' && renderLinkedInTrends()}
    </Box>
  );
};

export default HistoricalTrends;