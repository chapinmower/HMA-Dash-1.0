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
  Divider
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import BarChartIcon from '@mui/icons-material/BarChart';
import EmailIcon from '@mui/icons-material/Email';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AssessmentIcon from '@mui/icons-material/Assessment';

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
  },
  { 
    name: 'Email Marketing Analysis (30 Days)', 
    file: 'email-analysis-summary.html',
    icon: <AssessmentIcon />,
    description: 'Comprehensive analysis of all email campaigns (last 30 days)'
  }
];

// Email campaign summary data - from the HTML report
const campaignSummaryData = [
  { 
    campaign: 'April Newsletter', 
    recipients: 540, 
    opens: 302, 
    openRate: '56.0%', 
    clicks: 69, 
    clickRate: '12.8%',
    clickToOpenRate: '22.8%',
    avgEngagement: '12.5'
  },
  { 
    campaign: 'ATTN: New Client Portal', 
    recipients: 176, 
    opens: 112, 
    openRate: '63.6%', 
    clicks: 5, 
    clickRate: '2.8%',
    clickToOpenRate: '4.5%',
    avgEngagement: '7.1'
  },
  { 
    campaign: 'RSVP: June 18 Double Header', 
    recipients: 103, 
    opens: 67, 
    openRate: '65.0%', 
    clicks: 34, 
    clickRate: '33.0%',
    clickToOpenRate: '50.7%',
    avgEngagement: '16.5'
  },
  { 
    campaign: 'Re: RSVP: June 18 Double Header', 
    recipients: 85, 
    opens: 54, 
    openRate: '63.5%', 
    clicks: 28, 
    clickRate: '32.9%',
    clickToOpenRate: '51.9%',
    avgEngagement: '15.9'
  },
  { 
    campaign: 'Well-th Vault Primaries Round 2', 
    recipients: 94, 
    opens: 42, 
    openRate: '44.7%', 
    clicks: 0, 
    clickRate: '0.0%',
    clickToOpenRate: '0.0%',
    avgEngagement: '4.5'
  }
];

// Key insights from the email analysis summary
const keyInsights = [
  "Event RSVP campaign was most effective with 33.0% click rate and 16.5 engagement score, showing strong interest in the Wrigley Field event.",
  "Follow-up RSVP campaign achieved a 32.9% click rate, demonstrating the effectiveness of timely follow-up messages.",
  "April Newsletter performed well with 56% open rate and 12.8% click rate, significantly above industry average.",
  "Overall click rates are outstanding at 8.9%, more than 3x the industry average.",
  "Cross-campaign engagement is low with only 5.7% of audience engaging with multiple campaigns, suggesting opportunity for improvement."
];

// Newsletter widgets data
const newsletterWidgets = [
  {
    id: 'march',
    title: 'March Newsletter',
    url: '/widgets/marchnewsletter-widget.html',
    stats: {
      contacts: 537,
      openRate: '56.80%',
      clickRate: '10.61%',
      topContent: 'February Market Letter (31 clicks)'
    }
  },
  {
    id: 'february',
    title: 'February Newsletter',
    url: '/widgets/february-newsletter-widget.html',
    stats: {
      contacts: 528,
      openRate: '60.42%',
      clickRate: '12.12%',
      topContent: 'Investment Outlook 2025 (47 clicks)'
    }
  },
  {
    id: 'january',
    title: 'January Newsletter',
    url: '/widgets/january-newsletter-widget.html',
    stats: {
      contacts: 531,
      openRate: '62.71%',
      clickRate: '12.43%',
      topContent: '2025 Tax Reference Guide (54 clicks)'
    }
  }
];

function EmailAnalyticsPage() {
  const [reportHtml, setReportHtml] = useState(null);
  const [analysisHtml, setAnalysisHtml] = useState(null);
  const [loadingHtml, setLoadingHtml] = useState(true);
  const [loadingAnalysis, setLoadingAnalysis] = useState(true);
  const [errorHtml, setErrorHtml] = useState(null);
  const [errorAnalysis, setErrorAnalysis] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [emailMetrics, setEmailMetrics] = useState(null);
  const [showEmailAnalysisSummary, setShowEmailAnalysisSummary] = useState(false);
  const [selectedWidgetUrl, setSelectedWidgetUrl] = useState(null);

  // Calculate aggregated metrics
  useEffect(() => {
    const calculateMetrics = () => {
      // Calculate total metrics across all campaigns
      const totalRecipients = campaignSummaryData.reduce((sum, campaign) => sum + campaign.recipients, 0);
      const totalOpens = campaignSummaryData.reduce((sum, campaign) => sum + campaign.opens, 0);
      const totalClicks = campaignSummaryData.reduce((sum, campaign) => sum + campaign.clicks, 0);
      
      // Calculate rates
      const avgOpenRate = (totalOpens / totalRecipients * 100).toFixed(2) + '%';
      const avgClickRate = (totalClicks / totalRecipients * 100).toFixed(2) + '%';
      const avgClickToOpenRate = (totalClicks / totalOpens * 100).toFixed(2) + '%';
      
      setEmailMetrics({
        totalRecipients,
        totalOpens,
        totalClicks,
        avgOpenRate,
        avgClickRate,
        avgClickToOpenRate,
        period: 'Last 30 Days (as of May 18, 2025)'
      });
    };
    
    calculateMetrics();
  }, []);

  // Path to the HTML report file in the public directory
  const reportPath = '/reports/Email Dashboard HTML/april25emailcampaign-overview-report.html';
  const analysisPath = '/email-analysis-summary.html';

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

    const fetchAnalysisHtml = async () => {
      setLoadingAnalysis(true);
      setErrorAnalysis(null);
      try {
        const response = await fetch(analysisPath);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const html = await response.text();
        setAnalysisHtml(html);
      } catch (err) {
        console.error(`Error fetching analysis HTML from ${analysisPath}:`, err);
        setErrorAnalysis(`Failed to load email analysis summary. Please ensure the file exists at ${analysisPath}.`);
      } finally {
        setLoadingAnalysis(false);
      }
    };

    if (tabValue === 3) {
      fetchReportHtml();
    }
    
    if (showEmailAnalysisSummary) {
      fetchAnalysisHtml();
    }
  }, [reportPath, analysisPath, tabValue, showEmailAnalysisSummary]); 

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    if (newValue !== 0) {
      setShowEmailAnalysisSummary(false);
      setSelectedWidgetUrl(null);
    }
  };

  const handleDownload = (filename) => {
    // In a real app, this would fetch from the actual file location
    alert(`In a production environment, this would download: ${filename}`);
  };

  const handleViewAnalysisSummary = () => {
    setShowEmailAnalysisSummary(true);
    setSelectedWidgetUrl(null);
  };

  const handleViewWidget = (widgetUrl) => {
    setSelectedWidgetUrl(widgetUrl);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Email Analytics
      </Typography>

      {/* Summary Metrics */}
      {emailMetrics && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            {emailMetrics.period} Email Campaign Summary
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={2}>
              <Card variant="outlined" sx={{ bgcolor: '#e8f2ed' }}>
                <CardContent>
                  <Typography color="text.secondary" variant="subtitle2">Total Recipients</Typography>
                  <Typography variant="h5" sx={{ color: '#105938', fontWeight: 'bold' }}>{emailMetrics.totalRecipients}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <Card variant="outlined" sx={{ bgcolor: '#e8f2ed' }}>
                <CardContent>
                  <Typography color="text.secondary" variant="subtitle2">Total Opens</Typography>
                  <Typography variant="h5" sx={{ color: '#105938', fontWeight: 'bold' }}>{emailMetrics.totalOpens}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <Card variant="outlined" sx={{ bgcolor: '#e8f2ed' }}>
                <CardContent>
                  <Typography color="text.secondary" variant="subtitle2">Total Clicks</Typography>
                  <Typography variant="h5" sx={{ color: '#105938', fontWeight: 'bold' }}>{emailMetrics.totalClicks}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <Card variant="outlined" sx={{ bgcolor: '#e8f2ed' }}>
                <CardContent>
                  <Typography color="text.secondary" variant="subtitle2">Avg. Open Rate</Typography>
                  <Typography variant="h5" sx={{ color: '#105938', fontWeight: 'bold' }}>{emailMetrics.avgOpenRate}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <Card variant="outlined" sx={{ bgcolor: '#e8f2ed' }}>
                <CardContent>
                  <Typography color="text.secondary" variant="subtitle2">Avg. Click Rate</Typography>
                  <Typography variant="h5" sx={{ color: '#105938', fontWeight: 'bold' }}>{emailMetrics.avgClickRate}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <Card variant="outlined" sx={{ bgcolor: '#e8f2ed' }}>
                <CardContent>
                  <Typography color="text.secondary" variant="subtitle2">Click-to-Open</Typography>
                  <Typography variant="h5" sx={{ color: '#105938', fontWeight: 'bold' }}>{emailMetrics.avgClickToOpenRate}</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {!showEmailAnalysisSummary && !selectedWidgetUrl && tabValue === 0 && (
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
              <Button 
                variant="contained" 
                color="primary"
                startIcon={<AssessmentIcon />}
                onClick={handleViewAnalysisSummary}
              >
                View Full Email Analysis Summary
              </Button>
            </Box>
          )}
        </Box>
      )}

      {/* Email Analysis Summary Full View */}
      {showEmailAnalysisSummary && tabValue === 0 && (
        <Box sx={{ mt: 3, mb: 4 }}>
          <Button 
            variant="outlined" 
            size="small" 
            onClick={() => setShowEmailAnalysisSummary(false)}
            sx={{ mb: 2 }}
          >
            ← Back to Campaign Summary
          </Button>
          
          {loadingAnalysis ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}><CircularProgress /></Box>
          ) : errorAnalysis ? (
            <Alert severity="error">{errorAnalysis}</Alert>
          ) : (
            <Box 
              sx={{ 
                border: '1px solid #e0e0e0',
                borderRadius: 1,
                height: 'calc(100vh - 300px)',
                overflow: 'hidden'
              }}
            >
              <iframe
                src="/email-analysis-summary.html"
                title="Email Analysis Summary"
                width="100%"
                height="100%"
                style={{ border: 'none' }}
              />
            </Box>
          )}
        </Box>
      )}

      {/* Widget Full View */}
      {selectedWidgetUrl && tabValue === 0 && (
        <Box sx={{ mt: 3, mb: 4 }}>
          <Button 
            variant="outlined" 
            size="small" 
            onClick={() => setSelectedWidgetUrl(null)}
            sx={{ mb: 2 }}
          >
            ← Back to Campaign Summary
          </Button>
          
          <Box 
            sx={{ 
              border: '1px solid #e0e0e0',
              borderRadius: 1,
              height: 'calc(100vh - 300px)',
              overflow: 'hidden'
            }}
          >
            <iframe
              src={selectedWidgetUrl}
              title="Newsletter Widget"
              width="100%"
              height="100%"
              style={{ border: 'none' }}
            />
          </Box>
        </Box>
      )}

      {/* Tabs Navigation */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="email analytics tabs">
          <Tab label="Campaign Summary" />
          <Tab label="Key Insights" />
          <Tab label="Email Data Files" />
          <Tab label="Full Report" />
        </Tabs>
      </Box>

      {/* Tab 1: Campaign Summary Table - only show if not showing the analysis summary or widget */}
      {tabValue === 0 && !showEmailAnalysisSummary && !selectedWidgetUrl && (
        <>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="campaign summary table">
              <TableHead>
                <TableRow sx={{ backgroundColor: '#e8f2ed' }}>
                  <TableCell>Campaign</TableCell>
                  <TableCell align="right">Recipients</TableCell>
                  <TableCell align="right">Opens</TableCell>
                  <TableCell align="right">Open Rate</TableCell>
                  <TableCell align="right">Clicks</TableCell>
                  <TableCell align="right">Click Rate</TableCell>
                  <TableCell align="right">Click-to-Open</TableCell>
                  <TableCell align="right">Avg. Engagement</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {campaignSummaryData.map((campaign, index) => (
                  <TableRow
                    key={campaign.campaign}
                    sx={{ 
                      '&:last-child td, &:last-child th': { border: 0 },
                      backgroundColor: index % 2 === 0 ? '#f9f9f9' : 'inherit'
                    }}
                  >
                    <TableCell component="th" scope="row">{campaign.campaign}</TableCell>
                    <TableCell align="right">{campaign.recipients}</TableCell>
                    <TableCell align="right">{campaign.opens}</TableCell>
                    <TableCell align="right" sx={{ 
                      color: parseFloat(campaign.openRate) > 60 ? '#105938' : 
                             parseFloat(campaign.openRate) > 40 ? '#fd7e14' : '#dc3545'
                    }}>
                      {campaign.openRate}
                    </TableCell>
                    <TableCell align="right">{campaign.clicks}</TableCell>
                    <TableCell align="right" sx={{ 
                      color: parseFloat(campaign.clickRate) > 10 ? '#105938' : 
                             parseFloat(campaign.clickRate) > 3 ? '#fd7e14' : '#dc3545'
                    }}>
                      {campaign.clickRate}
                    </TableCell>
                    <TableCell align="right">{campaign.clickToOpenRate}</TableCell>
                    <TableCell align="right">{campaign.avgEngagement}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Newsletter Widgets Section */}
          <Box sx={{ mt: 5 }}>
            <Typography variant="h6" gutterBottom sx={{ color: '#105938', mb: 2 }}>
              Newsletter Performance (Q1 2025)
            </Typography>
            <Divider sx={{ mb: 3 }} />
            
            <Grid container spacing={3}>
              {newsletterWidgets.map((widget) => (
                <Grid item xs={12} sm={6} md={4} key={widget.id}>
                  <Paper 
                    elevation={1}
                    onClick={() => handleViewWidget(widget.url)}
                    sx={{ 
                      p: 3, 
                      borderTop: '4px solid #105938',
                      height: '100%',
                      transition: 'all 0.3s ease',
                      cursor: 'pointer',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: 3
                      }
                    }}
                  >
                    <Typography variant="h6" color="primary.main" gutterBottom>
                      {widget.title}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" color="text.secondary">Total Contacts:</Typography>
                      <Typography variant="body1" fontWeight="bold">{widget.stats.contacts}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" color="text.secondary">Open Rate:</Typography>
                      <Typography variant="body1" fontWeight="bold" color="#105938">{widget.stats.openRate}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">Click Rate:</Typography>
                      <Typography variant="body1" fontWeight="bold" color="#105938">{widget.stats.clickRate}</Typography>
                    </Box>
                    <Divider sx={{ mb: 2 }} />
                    <Typography variant="body2" color="text.secondary">
                      Top Content: {widget.stats.topContent}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                      <Button 
                        size="small" 
                        variant="outlined"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewWidget(widget.url);
                        }}
                      >
                        View Details
                      </Button>
                    </Box>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Box>
        </>
      )}

      {/* Tab 2: Key Insights */}
      {tabValue === 1 && (
        <Box>
          <Typography variant="h6" gutterBottom sx={{ color: '#105938' }}>
            Key Email Marketing Insights - Last 30 Days
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Paper 
                elevation={0} 
                sx={{ 
                  p: 3, 
                  backgroundColor: '#e8f2ed', 
                  borderLeft: '4px solid #105938'
                }}
              >
                <Typography variant="subtitle1" sx={{ mb: 2, color: '#105938', fontWeight: 'bold' }}>
                  Campaign Performance Highlights
                </Typography>
                <List dense>
                  {keyInsights.map((insight, index) => (
                    <ListItem key={index} sx={{ py: 1 }}>
                      <ListItemText primary={insight} />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper 
                elevation={0} 
                sx={{ 
                  p: 3, 
                  backgroundColor: '#f8f9fa', 
                  border: '1px solid #ddd', 
                  borderRadius: '4px'
                }}
              >
                <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold' }}>
                  Recommendations
                </Typography>
                <List>
                  <ListItem>
                    <ListItemText 
                      primary="Continue event-based marketing" 
                      secondary="Build on the success of the Wrigley Field event campaign with more event-focused initiatives."
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="Learn from April Newsletter success" 
                      secondary="Apply techniques from the successful April Newsletter with 12.8% click rate to future newsletters."
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="Continue follow-up RSVP strategy" 
                      secondary="The Re: RSVP follow-up email was extremely successful with a 32.9% click rate."
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="Increase cross-campaign engagement" 
                      secondary="Create more cohesive email journeys to boost the 5.7% of recipients who engage with multiple emails."
                    />
                  </ListItem>
                </List>
              </Paper>
            </Grid>
          </Grid>
          
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
            <Button 
              variant="outlined" 
              color="primary"
              component="a"
              href="/email-analysis-summary.html"
              target="_blank"
              rel="noopener noreferrer"
              startIcon={<AssessmentIcon />}
              sx={{ mr: 2 }}
            >
              Open Full Analysis in New Tab
            </Button>
          </Box>
        </Box>
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
                  {file.file.endsWith('.html') ? (
                    <Button
                      variant="outlined"
                      size="small"
                      component="a"
                      href={`/${file.file}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View
                    </Button>
                  ) : (
                    <IconButton 
                      onClick={() => handleDownload(file.file)} 
                      color="primary"
                      title={`Download ${file.name}`}
                    >
                      <DownloadIcon />
                    </IconButton>
                  )}
                </Box>
              </ListItem>
            ))}
          </List>
        </Box>
      )}

      {/* Tab 4: HTML Report Display Section */}
      {tabValue === 3 && (
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
