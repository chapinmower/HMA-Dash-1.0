import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  CircularProgress, 
  Alert, 
  Link, 
  List, 
  ListItem, 
  ListItemText,
  Paper,
  Grid,
  Button,
  Card,
  CardContent,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import BarChartIcon from '@mui/icons-material/BarChart';
import EmailIcon from '@mui/icons-material/Email';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import HistoricalTrends from './HistoricalTrends';

// Available email data files
const emailDataFiles = [
  { 
    name: 'April 2025 Clout Data', 
    file: 'April 2025 Clout Data.csv',
    icon: <EmailIcon />,
    description: 'Email performance metrics for April 2025 campaigns'
  },
  { 
    name: 'March 2025 Newsletter', 
    file: 'March Newsletter Email data.xlsx',
    icon: <EmailIcon />,
    description: 'Complete analytics for March 2025 Newsletter'
  },
  { 
    name: 'February Market Letter', 
    file: 'february market letter email analytics.xlsx',
    icon: <EmailIcon />,
    description: 'Analytics for February Market Letter email'
  },
  { 
    name: 'Q1 2025 Clout Data', 
    file: 'Q125 Clout Data.csv',
    icon: <BarChartIcon />,
    description: 'Quarterly email performance summary (Q1 2025)'
  },
  { 
    name: 'Lorraine March 2025 Update', 
    file: 'Lorraine March25 Update email analytics.csv',
    icon: <EmailIcon />,
    description: 'Analytics for special update email from Lorraine'
  }
];

// Email campaign summary data - from the HTML report
const campaignSummaryData = [
  { 
    campaign: 'April Newsletter', 
    recipients: 537, 
    opens: 310, 
    openRate: '57.73%', 
    clicks: 31, 
    clickRate: '5.77%',
    clickToOpenRate: '10.00%'
  },
  { 
    campaign: 'ATTN: New Client Portal', 
    recipients: 112, 
    opens: 95, 
    openRate: '84.82%', 
    clicks: 0, 
    clickRate: '0.00%',
    clickToOpenRate: '0.00%'
  },
  { 
    campaign: 'Well-th Vault Primaries Round 2', 
    recipients: 125, 
    opens: 83, 
    openRate: '66.40%', 
    clicks: 0, 
    clickRate: '0.00%',
    clickToOpenRate: '0.00%'
  },
  { 
    campaign: 'RSVP: June 18 Double Header', 
    recipients: 68, 
    opens: 53, 
    openRate: '77.94%', 
    clicks: 5, 
    clickRate: '7.35%',
    clickToOpenRate: '9.43%'
  }
];

// Helper function to format percentage with trend
const formatPercentageWithTrend = (value, change) => {
  const isPositive = change > 0;
  const TrendIcon = isPositive ? TrendingUpIcon : TrendingDownIcon;
  const color = isPositive ? 'success' : 'error';
  
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Typography variant="h5">{(value * 100).toFixed(1)}%</Typography>
      <Chip 
        icon={<TrendIcon />}
        label={`${isPositive ? '+' : ''}${change.toFixed(1)}%`}
        size="small"
        color={color}
        variant="outlined"
      />
    </Box>
  );
};

// Helper function to format number with trend
const formatNumberWithTrend = (value, change) => {
  const isPositive = change > 0;
  const TrendIcon = isPositive ? TrendingUpIcon : TrendingDownIcon;
  const color = isPositive ? 'success' : 'error';
  
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Typography variant="h5">{value.toLocaleString()}</Typography>
      <Chip 
        icon={<TrendIcon />}
        label={`${isPositive ? '+' : ''}${change.toFixed(1)}%`}
        size="small"
        color={color}
        variant="outlined"
      />
    </Box>
  );
};

function EmailAnalyticsPage() {
  const [reportHtml, setReportHtml] = useState(null);
  const [loadingHtml, setLoadingHtml] = useState(true);
  const [errorHtml, setErrorHtml] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [emailMetrics, setEmailMetrics] = useState(null);
  const [historicalData, setHistoricalData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load historical email data and calculate current metrics
  useEffect(() => {
    const loadEmailData = async () => {
      setLoading(true);
      try {
        const response = await fetch('/data/historical_email_metrics.json');
        const data = await response.json();
        
        if (data.monthlyMetrics && data.monthlyMetrics.length > 0) {
          // Sort by date descending to get latest first
          const sortedData = data.monthlyMetrics.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
          setHistoricalData(sortedData);
          
          // Get current month data (most recent)
          const currentMonth = sortedData[0];
          const previousMonth = sortedData[1];
          
          setEmailMetrics({
            currentMonth,
            previousMonth,
            totalSent: currentMonth.totalSent,
            totalOpened: currentMonth.totalOpened,
            totalClicked: currentMonth.totalClicked,
            openRate: currentMonth.openRate,
            clickRate: currentMonth.clickRate,
            clickToOpenRate: currentMonth.clickToOpenRate,
            period: currentMonth.periodLabel
          });
        } else {
          // Fallback to calculating from campaign data if historical data not available
          const totalRecipients = campaignSummaryData.reduce((sum, campaign) => sum + campaign.recipients, 0);
          const totalOpens = campaignSummaryData.reduce((sum, campaign) => sum + campaign.opens, 0);
          const totalClicks = campaignSummaryData.reduce((sum, campaign) => sum + campaign.clicks, 0);
          
          setEmailMetrics({
            totalSent: totalRecipients,
            totalOpened: totalOpens,
            totalClicked: totalClicks,
            openRate: totalOpens / totalRecipients,
            clickRate: totalClicks / totalRecipients,
            clickToOpenRate: totalClicks / totalOpens,
            period: 'April 2025'
          });
        }
      } catch (error) {
        console.error('Error loading historical email data:', error);
        // Fallback to static calculation
        const totalRecipients = campaignSummaryData.reduce((sum, campaign) => sum + campaign.recipients, 0);
        const totalOpens = campaignSummaryData.reduce((sum, campaign) => sum + campaign.opens, 0);
        const totalClicks = campaignSummaryData.reduce((sum, campaign) => sum + campaign.clicks, 0);
        
        setEmailMetrics({
          totalSent: totalRecipients,
          totalOpened: totalOpens,
          totalClicked: totalClicks,
          openRate: totalOpens / totalRecipients,
          clickRate: totalClicks / totalRecipients,
          clickToOpenRate: totalClicks / totalOpens,
          period: 'April 2025'
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadEmailData();
  }, []);

  // Path to the HTML report file in the public directory
  const reportPath = '/reports/Email Dashboard HTML/april25emailcampaign-overview-report.html';

  useEffect(() => {
    const fetchReportHtml = async () => {
      setLoadingHtml(true);
      setErrorHtml(null);
      try {
        const response = await fetch(reportPath);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const html = await response.text();
        setReportHtml(html);
      } catch (err) {
        console.error(`Error fetching HTML report from ${reportPath}:`, err);
        setErrorHtml(`Failed to load email performance report. Please ensure the file exists at ${reportPath}.`);
      } finally {
        setLoadingHtml(false);
      }
    };

    if (tabValue === 2) {
      fetchReportHtml();
    }
  }, [reportPath, tabValue]); // Re-run effect if reportPath or tabValue changes

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleDownload = (filename) => {
    // In a real app, this would fetch from the actual file location
    alert(`In a production environment, this would download: ${filename}`);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Email Analytics
      </Typography>

      {/* Summary Metrics */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : emailMetrics && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            {emailMetrics.period} Email Campaign Summary
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={2}>
              <Card variant="outlined">
                <CardContent>
                  <Typography color="text.secondary" variant="subtitle2">Total Sent</Typography>
                  {emailMetrics.currentMonth ? 
                    formatNumberWithTrend(
                      emailMetrics.totalSent, 
                      emailMetrics.currentMonth.totalSentChange?.momChange || 0
                    ) : 
                    <Typography variant="h5">{emailMetrics.totalSent?.toLocaleString()}</Typography>
                  }
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <Card variant="outlined">
                <CardContent>
                  <Typography color="text.secondary" variant="subtitle2">Total Opens</Typography>
                  <Typography variant="h5">{emailMetrics.totalOpened?.toLocaleString()}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <Card variant="outlined">
                <CardContent>
                  <Typography color="text.secondary" variant="subtitle2">Total Clicks</Typography>
                  <Typography variant="h5">{emailMetrics.totalClicked?.toLocaleString()}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <Card variant="outlined">
                <CardContent>
                  <Typography color="text.secondary" variant="subtitle2">Open Rate</Typography>
                  {emailMetrics.currentMonth ? 
                    formatPercentageWithTrend(
                      emailMetrics.openRate, 
                      emailMetrics.currentMonth.openRateChange?.momChange || 0
                    ) : 
                    <Typography variant="h5">{(emailMetrics.openRate * 100).toFixed(1)}%</Typography>
                  }
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <Card variant="outlined">
                <CardContent>
                  <Typography color="text.secondary" variant="subtitle2">Click Rate</Typography>
                  {emailMetrics.currentMonth ? 
                    formatPercentageWithTrend(
                      emailMetrics.clickRate, 
                      emailMetrics.currentMonth.clickRateChange?.momChange || 0
                    ) : 
                    <Typography variant="h5">{(emailMetrics.clickRate * 100).toFixed(1)}%</Typography>
                  }
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <Card variant="outlined">
                <CardContent>
                  <Typography color="text.secondary" variant="subtitle2">Click-to-Open</Typography>
                  <Typography variant="h5">{(emailMetrics.clickToOpenRate * 100).toFixed(1)}%</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      )}

      {/* Tabs Navigation */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="email analytics tabs">
          <Tab label="Historical Trends" />
          <Tab label="Campaign Summary" />
          <Tab label="Email Data Files" />
          <Tab label="Monthly Widgets" />
          <Tab label="Full Report" />
        </Tabs>
      </Box>

      {/* Tab 1: Historical Trends */}
      {tabValue === 0 && (
        <Box>
          <Typography variant="h6" gutterBottom>
            Email Performance Trends
          </Typography>
          <HistoricalTrends metricType="email" />
        </Box>
      )}

      {/* Tab 2: Campaign Summary Table */}
      {tabValue === 1 && (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="campaign summary table">
            <TableHead>
              <TableRow>
                <TableCell>Campaign</TableCell>
                <TableCell align="right">Recipients</TableCell>
                <TableCell align="right">Opens</TableCell>
                <TableCell align="right">Open Rate</TableCell>
                <TableCell align="right">Clicks</TableCell>
                <TableCell align="right">Click Rate</TableCell>
                <TableCell align="right">Click-to-Open</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {campaignSummaryData.map((campaign) => (
                <TableRow
                  key={campaign.campaign}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">{campaign.campaign}</TableCell>
                  <TableCell align="right">{campaign.recipients}</TableCell>
                  <TableCell align="right">{campaign.opens}</TableCell>
                  <TableCell align="right">{campaign.openRate}</TableCell>
                  <TableCell align="right">{campaign.clicks}</TableCell>
                  <TableCell align="right">{campaign.clickRate}</TableCell>
                  <TableCell align="right">{campaign.clickToOpenRate}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Tab 3: Email Data Files */}
      {tabValue === 2 && (
        <Box>
          <Typography variant="body1" paragraph>
            The following email analytics data files are available for detailed analysis. 
            In a production environment, these files would be available for download.
          </Typography>
          <List>
            {emailDataFiles.map((file) => (
              <ListItem 
                key={file.file}
                sx={{ 
                  mb: 2, 
                  p: 2, 
                  border: '1px solid #e0e0e0', 
                  borderRadius: 1,
                  backgroundColor: '#f8f8f8'
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                  <Box sx={{ mr: 2, color: 'primary.main' }}>
                    {file.icon}
                  </Box>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="subtitle1">{file.name}</Typography>
                    <Typography variant="body2" color="text.secondary">{file.description}</Typography>
                  </Box>
                  <IconButton 
                    onClick={() => handleDownload(file.file)} 
                    color="primary"
                    title={`Download ${file.name}`}
                  >
                    <DownloadIcon />
                  </IconButton>
                </Box>
              </ListItem>
            ))}
          </List>
        </Box>
      )}

      {/* Tab 4: Monthly Widgets */}
      {tabValue === 3 && (
        <Box>
          <Typography variant="h6" gutterBottom>
            Monthly Clout Widgets - Dec 2024 through Apr 2025
          </Typography>
          <Typography variant="body1" paragraph>
            Interactive email performance widgets showing detailed analytics for each month.
          </Typography>
          <Box 
            sx={{ 
              border: '1px solid #e0e0e0',
              borderRadius: 1,
              overflow: 'hidden',
              height: '800px'
            }}
          >
            <iframe 
              src="/widgets/monthly-clout-widgets.html"
              width="100%"
              height="100%"
              style={{ border: 'none' }}
              title="Monthly Clout Widgets"
            />
          </Box>
        </Box>
      )}

      {/* Tab 5: HTML Report Display Section */}
      {tabValue === 4 && (
        <Box>
          <Typography variant="h6" gutterBottom>
            April 2025 Campaign Overview - Full Report
          </Typography>
          {loadingHtml ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}><CircularProgress /></Box>
          ) : errorHtml ? (
            <Alert severity="error">{errorHtml}</Alert>
          ) : (
            <Box 
              sx={{ 
                border: '1px solid #e0e0e0',
                borderRadius: 1,
                overflow: 'hidden'
              }}
            >
              <div dangerouslySetInnerHTML={{ __html: reportHtml }} />
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
}

export default EmailAnalyticsPage;
