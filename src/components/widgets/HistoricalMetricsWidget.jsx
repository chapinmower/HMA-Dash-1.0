import React, { useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent, Grid, Divider } from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import RemoveIcon from '@mui/icons-material/Remove';

// Helper to format values for display
const formatValue = (value, metric, isTrend = false) => {
  if (value === null || value === undefined) return 'N/A';
  
  if (metric.includes('rate') || metric.includes('Rate')) {
    // For rates, show as percentage
    return isTrend 
      ? `${value > 0 ? '+' : ''}${value.toFixed(2)}%` 
      : `${(value * 100).toFixed(2)}%`;
  }
  
  // For counts, show with comma separators
  return isTrend 
    ? `${value > 0 ? '+' : ''}${value.toFixed(2)}%` 
    : value.toLocaleString();
};

// Determine trend icon and color
const getTrendDisplay = (value) => {
  if (value === null || value === undefined) return { icon: <RemoveIcon fontSize="small" />, color: '#666' };
  
  if (value > 0) return { icon: <ArrowUpwardIcon fontSize="small" />, color: '#4caf50' };
  if (value < 0) return { icon: <ArrowDownwardIcon fontSize="small" />, color: '#f44336' };
  return { icon: <RemoveIcon fontSize="small" />, color: '#666' };
};

// Format metric name for display
const formatMetricName = (name) => {
  return name
    .split(/(?=[A-Z])/)
    .join(' ')
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

function HistoricalMetricsWidget({ 
  metricType = 'email', 
  metric = 'openRate', 
  title = 'Performance',
  data = null
}) {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      if (data) {
        setMetrics(data);
        return;
      }
      
      setLoading(true);
      
      try {
        // Load appropriate historical metrics file
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
          
          // Get most recent monthly metrics
          if (data.monthlyMetrics && data.monthlyMetrics.length > 0) {
            const latestMetrics = data.monthlyMetrics[0];
            setMetrics({
              value: latestMetrics[metric],
              momChange: latestMetrics[`${metric}Change`]?.momChange,
              yoyChange: latestMetrics[`${metric}Change`]?.yoyChange,
              period: latestMetrics.periodLabel,
              startDate: latestMetrics.startDate,
              endDate: latestMetrics.endDate
            });
          }
        }
      } catch (err) {
        console.error(`Error loading historical data for ${metricType}:`, err);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [metricType, metric, data]);

  // Get trend display properties
  const momTrend = metrics ? getTrendDisplay(metrics.momChange) : { icon: null, color: '#666' };
  const yoyTrend = metrics ? getTrendDisplay(metrics.yoyChange) : { icon: null, color: '#666' };

  return (
    <Card variant="outlined" sx={{ minHeight: 150, height: '100%' }}>
      <CardContent>
        <Typography variant="subtitle1" sx={{ mb: 1 }}>{title}</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {formatMetricName(metric)}
        </Typography>
        
        <Typography variant="h4" sx={{ mb: 2, fontWeight: 'bold', color: '#1976d2' }}>
          {metrics ? formatValue(metrics.value, metric) : 'Loading...'}
        </Typography>
        
        <Divider sx={{ my: 1 }} />
        
        <Grid container spacing={1}>
          <Grid item xs={6}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box sx={{ color: momTrend.color, display: 'flex', alignItems: 'center', mr: 0.5 }}>
                {momTrend.icon}
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">MoM</Typography>
                <Typography variant="body2" sx={{ color: momTrend.color, fontWeight: 'bold' }}>
                  {metrics ? formatValue(metrics.momChange, metric, true) : 'N/A'}
                </Typography>
              </Box>
            </Box>
          </Grid>
          
          <Grid item xs={6}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box sx={{ color: yoyTrend.color, display: 'flex', alignItems: 'center', mr: 0.5 }}>
                {yoyTrend.icon}
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">YoY</Typography>
                <Typography variant="body2" sx={{ color: yoyTrend.color, fontWeight: 'bold' }}>
                  {metrics ? formatValue(metrics.yoyChange, metric, true) : 'N/A'}
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
        
        {metrics && metrics.period && (
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 2 }}>
            {metrics.period}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}

export default HistoricalMetricsWidget;