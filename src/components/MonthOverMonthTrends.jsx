import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Grid,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  TrendingFlat as TrendingFlatIcon
} from '@mui/icons-material';

const MonthOverMonthTrends = () => {
  const [emailData, setEmailData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/data/email_analytics.json')
      .then(response => response.json())
      .then(data => {
        setEmailData(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error loading email analytics:', error);
        setLoading(false);
      });
  }, []);

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up': return <TrendingUpIcon sx={{ color: 'success.main', fontSize: 16 }} />;
      case 'down': return <TrendingDownIcon sx={{ color: 'error.main', fontSize: 16 }} />;
      default: return <TrendingFlatIcon sx={{ color: 'text.secondary', fontSize: 16 }} />;
    }
  };

  const getTrendColor = (trend, percentage) => {
    if (trend === 'up') return 'success';
    if (trend === 'down') return 'error';
    return 'default';
  };

  const formatPercentage = (percentage, showSign = true) => {
    if (percentage === null || percentage === undefined) return 'N/A';
    const sign = showSign && parseFloat(percentage) > 0 ? '+' : '';
    return `${sign}${percentage}%`;
  };

  if (loading) {
    return (
      <Card>
        <CardContent>
          <Typography>Loading month-over-month trends...</Typography>
        </CardContent>
      </Card>
    );
  }

  if (!emailData || !emailData.summaries) {
    return (
      <Card>
        <CardContent>
          <Typography>No trend data available</Typography>
        </CardContent>
      </Card>
    );
  }

  // Get latest trends for summary cards
  const latestSummary = emailData.summaries[emailData.summaries.length - 1];
  const trends = latestSummary?.monthOverMonth;

  return (
    <Box>
      {/* Summary Cards */}
      {trends && (
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Email Opens
                    </Typography>
                    <Typography variant="h6">
                      {trends.opens.change !== null ? 
                        (trends.opens.change > 0 ? `+${trends.opens.change}` : trends.opens.change) : 
                        'N/A'
                      }
                    </Typography>
                  </Box>
                  <Box display="flex" alignItems="center">
                    {getTrendIcon(trends.opens.trend)}
                    <Chip 
                      label={formatPercentage(trends.opens.percentage)}
                      color={getTrendColor(trends.opens.trend)}
                      size="small"
                      sx={{ ml: 1 }}
                    />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Link Clicks
                    </Typography>
                    <Typography variant="h6">
                      {trends.clicks.change !== null ? 
                        (trends.clicks.change > 0 ? `+${trends.clicks.change}` : trends.clicks.change) : 
                        'N/A'
                      }
                    </Typography>
                  </Box>
                  <Box display="flex" alignItems="center">
                    {getTrendIcon(trends.clicks.trend)}
                    <Chip 
                      label={formatPercentage(trends.clicks.percentage)}
                      color={getTrendColor(trends.clicks.trend)}
                      size="small"
                      sx={{ ml: 1 }}
                    />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Recipients
                    </Typography>
                    <Typography variant="h6">
                      {trends.recipients.change !== null ? 
                        (trends.recipients.change > 0 ? `+${trends.recipients.change}` : trends.recipients.change) : 
                        'N/A'
                      }
                    </Typography>
                  </Box>
                  <Box display="flex" alignItems="center">
                    {getTrendIcon(trends.recipients.trend)}
                    <Chip 
                      label={formatPercentage(trends.recipients.percentage)}
                      color={getTrendColor(trends.recipients.trend)}
                      size="small"
                      sx={{ ml: 1 }}
                    />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Open Rate
                    </Typography>
                    <Typography variant="h6">
                      {trends.openRate.change !== null ? 
                        `${trends.openRate.change > 0 ? '+' : ''}${trends.openRate.change.toFixed(1)}%` : 
                        'N/A'
                      }
                    </Typography>
                  </Box>
                  <Box display="flex" alignItems="center">
                    {getTrendIcon(trends.openRate.trend)}
                    <Chip 
                      label={formatPercentage(trends.openRate.percentage)}
                      color={getTrendColor(trends.openRate.trend)}
                      size="small"
                      sx={{ ml: 1 }}
                    />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Detailed Month-over-Month Table */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Month-over-Month Performance
          </Typography>
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Period</strong></TableCell>
                  <TableCell align="right"><strong>Opens</strong></TableCell>
                  <TableCell align="right"><strong>Opens Change</strong></TableCell>
                  <TableCell align="right"><strong>Clicks</strong></TableCell>
                  <TableCell align="right"><strong>Clicks Change</strong></TableCell>
                  <TableCell align="right"><strong>Open Rate</strong></TableCell>
                  <TableCell align="right"><strong>Rate Change</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {emailData.summaries.map((summary, index) => (
                  <TableRow key={summary.period}>
                    <TableCell>
                      <Typography variant="body2" fontWeight="medium">
                        {summary.period}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      {summary.opens.toLocaleString()}
                    </TableCell>
                    <TableCell align="right">
                      {index === 0 ? (
                        <Chip label="Baseline" size="small" color="default" />
                      ) : (
                        <Box display="flex" alignItems="center" justifyContent="flex-end">
                          {getTrendIcon(summary.monthOverMonth.opens.trend)}
                          <Typography variant="body2" sx={{ ml: 0.5 }}>
                            {summary.monthOverMonth.opens.change > 0 ? '+' : ''}
                            {summary.monthOverMonth.opens.change} ({formatPercentage(summary.monthOverMonth.opens.percentage)})
                          </Typography>
                        </Box>
                      )}
                    </TableCell>
                    <TableCell align="right">
                      {summary.clicks.toLocaleString()}
                    </TableCell>
                    <TableCell align="right">
                      {index === 0 ? (
                        <Chip label="Baseline" size="small" color="default" />
                      ) : (
                        <Box display="flex" alignItems="center" justifyContent="flex-end">
                          {getTrendIcon(summary.monthOverMonth.clicks.trend)}
                          <Typography variant="body2" sx={{ ml: 0.5 }}>
                            {summary.monthOverMonth.clicks.change > 0 ? '+' : ''}
                            {summary.monthOverMonth.clicks.change} ({formatPercentage(summary.monthOverMonth.clicks.percentage)})
                          </Typography>
                        </Box>
                      )}
                    </TableCell>
                    <TableCell align="right">
                      {summary.openRate}
                    </TableCell>
                    <TableCell align="right">
                      {index === 0 ? (
                        <Chip label="Baseline" size="small" color="default" />
                      ) : (
                        <Box display="flex" alignItems="center" justifyContent="flex-end">
                          {getTrendIcon(summary.monthOverMonth.openRate.trend)}
                          <Typography variant="body2" sx={{ ml: 0.5 }}>
                            {summary.monthOverMonth.openRate.change > 0 ? '+' : ''}
                            {summary.monthOverMonth.openRate.change?.toFixed(1)}% points
                          </Typography>
                        </Box>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
};

export default MonthOverMonthTrends;