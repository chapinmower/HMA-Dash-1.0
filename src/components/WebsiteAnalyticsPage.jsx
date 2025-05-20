import React, { useState, useEffect } from 'react';
import { Box, Typography, Select, MenuItem, FormControl, InputLabel, Grid, Paper, CircularProgress, Alert } from '@mui/material';
import apiClient, { getWebsiteAnalyticsSummary } from '../apiClient';
import PdfReportSummary from './PdfReportSummary';
import { BarChart, LineChart, DoughnutChart, createChartData } from './ChartComponents';

// Helper function to get year range (e.g., last 5 years)
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
    if (period === 'Q1') { startDate = `${year}-01-01`; endDate = `${year}-03-31`; }
    else if (period === 'Q2') { startDate = `${year}-04-01`; endDate = `${year}-06-30`; }
    else if (period === 'Q3') { startDate = `${year}-07-01`; endDate = `${year}-09-30`; }
    else if (period === 'Q4') { startDate = `${year}-10-01`; endDate = `${year}-12-31`; }
    else if (period === 'Full Year') { startDate = `${year}-01-01`; endDate = `${year}-12-31`; }
    else { // Monthly
        const month = parseInt(period, 10);
        if (month >= 1 && month <= 12) {
            const firstDay = new Date(year, month - 1, 1);
            const lastDay = new Date(year, month, 0);
            startDate = firstDay.toISOString().split('T')[0];
            endDate = lastDay.toISOString().split('T')[0];
        } else { return { startDate: null, endDate: null }; }
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

// --- Static Data Definitions ---

// April 2025 Data
const april2025OverallStats = {
  users: '486', usersChange: '+35.2%', comparisonPeriod: 'vs Mar 2025',
  newUsers: '472', newUsersChange: '+35.2%',
  pagesPerSession: '1.94', pagesPerSessionChange: '+12.1%',
  avgEngTimeSeconds: 53, avgEngTimeChange: '+26.2%',
  sessions: '615', sessionsChange: '+29.6%'
};

const april2025TopPagesData = [
  { url: 'hummermower.com/', sessions: 311, engagementRate: '48.6%', eventsPerSession: '5.13' },
  { url: 'hummermower.com/about.html', sessions: 92, engagementRate: '86.21%', eventsPerSession: '6.85' },
  { url: 'hummermower.com/blogs/insights/april25-market-letter', sessions: 86, engagementRate: '83.82%', eventsPerSession: '5.75' },
  { url: 'hummermower.com/events/june-wrigley-event.html', sessions: 79, engagementRate: '91.03%', eventsPerSession: '7.24' },
  { url: 'hummermower.com/index.html', sessions: 58, engagementRate: '72.41%', eventsPerSession: '5.15' },
  { url: 'hummermower.com/grove-mower.html', sessions: 42, engagementRate: '85.71%', eventsPerSession: '6.30' },
  { url: 'hummermower.com/contact.html', sessions: 38, engagementRate: '79.95%', eventsPerSession: '5.56' },
  { url: 'hummermower.com/blogs/insights/q125-market-letter', sessions: 31, engagementRate: '80.65%', eventsPerSession: '5.38' },
  { url: 'hummermower.com/david-cox.html', sessions: 29, engagementRate: '83.51%', eventsPerSession: '6.18' },
  { url: 'hummermower.com/clients-capabilities.html', sessions: 27, engagementRate: '88.89%', eventsPerSession: '6.02' },
];

const april2025BlogData = [
  { title: "April '25 Market Letter", views: 82, duration: '00:07:19', scrollDepth: 12 },
  { title: 'June Wrigley Field Event Announcement', views: 76, duration: '00:06:42', scrollDepth: 14 },
  { title: "1Q '25 Market Letter", views: 33, duration: '00:04:12', scrollDepth: 8 },
  { title: 'Tax Planning Guide: 2025 Update', views: 28, duration: '00:05:37', scrollDepth: 11 },
  { title: 'Retirement Planning Strategies', views: 19, duration: '00:04:21', scrollDepth: 9 },
];

// Q1 2025 Data (from previous steps)
const q12025OverallStats = {
  users: '1,277', usersChange: '-18.1%', comparisonPeriod: 'vs Q1 2024',
  newUsers: '1,235', newUsersChange: '-18.2%',
  pagesPerSession: '1.81', pagesPerSessionChange: '+14.2%',
  avgEngTimeSeconds: 49, avgEngTimeChange: '+51.3%',
  sessions: '1,703', sessionsChange: '-7.1%'
};

const q12025TopPagesData = [
  { url: 'hummermower.com/', sessions: 833, engagementRate: '45.5%', eventsPerSession: '4.93' },
  { url: 'hummermower.com/about.html', sessions: 296, engagementRate: '88.18%', eventsPerSession: '7.00' },
  { url: 'hummermower.com/blogs/insights/february-market-l...', sessions: 203, engagementRate: '78.33%', eventsPerSession: '5.22' },
  { url: 'hummermower.com/index.html', sessions: 178, engagementRate: '70.79%', eventsPerSession: '5.01' },
  { url: 'hummermower.com/grove-mower.html', sessions: 119, engagementRate: '86.55%', eventsPerSession: '6.10' },
  { url: 'hummermower.com/blogs/insights/q125-market-letter', sessions: 94, engagementRate: '81.91%', eventsPerSession: '5.49' },
  { url: 'hummermower.com/blogs/library/2025-tax-referenc...', sessions: 86, engagementRate: '63.95%', eventsPerSession: '7.93' },
  { url: 'hummermower.com/contact.html', sessions: 79, engagementRate: '81.01%', eventsPerSession: '5.37' },
  { url: 'hummermower.com/david-cox.html', sessions: 74, engagementRate: '82.43%', eventsPerSession: '6.26' },
  { url: 'hummermower.com/clients-capabilities.html', sessions: 68, engagementRate: '89.71%', eventsPerSession: '5.90' },
];

const q12025BlogData = [
  { title: 'February Market Letter', views: 190, duration: '00:08:28', scrollDepth: 10 },
  { title: '2025 Tax Reference Guide', views: 88, duration: '00:05:31', scrollDepth: 11 },
  { title: "1Q '25 Market Letter", views: 72, duration: '00:05:19', scrollDepth: 9 },
  { title: "Lorraine's Monthly Update", views: 18, duration: '00:02:48', scrollDepth: 7 },
  { title: "New Year's Financial Checklist", views: 11, duration: '00:01:57', scrollDepth: 9 },
];

// 2024 Data (extracted from PDF)
const year2024OverallStats = {
  users: '5,112', usersChange: '+189.0%', comparisonPeriod: 'vs 2023',
  newUsers: '5,032', newUsersChange: '+187.7%',
  pagesPerSession: '1.76', pagesPerSessionChange: '-3.6%',
  avgEngTimeSeconds: 34, avgEngTimeChange: '-48.9%',
  sessions: '6,252', sessionsChange: '+173.7%'
};

const year2024TopPagesData = [
  { url: 'hummermower.com/', sessions: 4229, engagementRate: '40.58%', eventsPerSession: '4.78' },
  { url: 'hummermower.com/about.html', sessions: 1026, engagementRate: '86.94%', eventsPerSession: '7.33' },
  { url: 'hummermower.com/grove-mower.html', sessions: 376, engagementRate: '88.3%', eventsPerSession: '6.51' },
  { url: 'hummermower.com/contact.html', sessions: 316, engagementRate: '81.96%', eventsPerSession: '5.67' },
  { url: 'hummermower.com/ryan-ross.html', sessions: 310, engagementRate: '83.55%', eventsPerSession: '6.02' },
  { url: 'hummermower.com/index.html', sessions: 293, engagementRate: '82.94%', eventsPerSession: '4.86' },
  { url: 'hummermower.com/jonathan-harper.html', sessions: 258, engagementRate: '84.5%', eventsPerSession: '6.25' },
];

const year2024BlogData = [
  { title: "Q1 '24 Market Letter: Pain Trade", views: 96, duration: '00:02:36', scrollDepth: 9 },
  { title: "Network's Down – Now What?", views: 62, duration: '00:02:49', scrollDepth: 9 },
  { title: "Phishing 2.0: Fake Text Messages", views: 57, duration: '00:05:28', scrollDepth: 10 },
  { title: "2024 Tax Reference Guide", views: 54, duration: '00:03:14', scrollDepth: 11 },
  // Removed 'BLOG | Hummer Mower Associates' entry
];

// 2023 Data (extracted from PDF)
const year2023OverallStats = {
  users: '1,769', usersChange: null, comparisonPeriod: null, // No comparison data in PDF
  newUsers: '1,749', newUsersChange: null,
  pagesPerSession: '1.82', pagesPerSessionChange: null,
  avgEngTimeSeconds: 67, avgEngTimeChange: null,
  sessions: '2,284', sessionsChange: null
};

const year2023TopPagesData = [
  { url: 'hummermower.com/', sessions: 1005, engagementRate: '62.79%', eventsPerSession: '5.42' },
  { url: 'hummermower.com/about.html', sessions: 412, engagementRate: '55.83%', eventsPerSession: '7.74' },
  { url: 'hummermower.com/grove-mower.html', sessions: 147, engagementRate: '59.18%', eventsPerSession: '6.80' },
  { url: 'hummermower.com/blogs/insights/dog-days-of-sum...', sessions: 145, engagementRate: '66.21%', eventsPerSession: '6.40' },
  { url: 'hummermower.com/contact.html', sessions: 143, engagementRate: '51.75%', eventsPerSession: '5.80' },
  { url: 'hummermower.com/index.html', sessions: 129, engagementRate: '64.34%', eventsPerSession: '5.04' },
  { url: 'hummermower.com/ryan-ross.html', sessions: 126, engagementRate: '60.32%', eventsPerSession: '6.63' },
];

const year2023BlogData = [
  { title: "Dog Days of Summer", views: 140, duration: '00:15:17', scrollDepth: 10 },
  { title: "Q3 '23 Market Letter: Worries...", views: 85, duration: '00:03:07', scrollDepth: 9 },
  { title: "Becky's Best Vol. XI: Our Flavorful Christmas Tradition", views: 65, duration: '00:05:07', scrollDepth: 9 },
  { title: "Becky's Best Vol. X – Happy Fall", views: 56, duration: '00:03:07', scrollDepth: 9 },
  { title: "Tax Planning – We All Need It", views: 51, duration: '00:04:14', scrollDepth: 9 },
];

// --- End Static Data Definitions ---


// Helper to format duration
const formatDuration = (seconds) => {
  if (seconds === null || seconds === undefined || isNaN(seconds)) return 'N/A';
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.round(seconds % 60);
  return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
};


function WebsiteAnalyticsPage() {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedPeriod, setSelectedPeriod] = useState('Q1'); // Default to Q1
  const [dateRange, setDateRange] = useState(getDateRange(currentYear, 'Q1'));
  const [summaryData, setSummaryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const yearOptions = getYearOptions();
  
  // Dynamically determine period options based on selected year
  const periodOptions = selectedYear === 2025
    ? ['Full Year', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'] // Months for 2025
    : ['Full Year', 'Q1', 'Q2', 'Q3', 'Q4']; // Quarters for other years (2023, 2024, etc.)

  useEffect(() => {
    // Reset selected period when year changes to ensure a valid period is selected
    // For 2025, default to 'Full Year', for others, default to 'Full Year'
    const defaultPeriod = 'Full Year';
    setSelectedPeriod(defaultPeriod);
    setDateRange(getDateRange(selectedYear, defaultPeriod));
  }, [selectedYear]); // Rerun effect when selectedYear changes

  // Removed dynamic data fetching as backend endpoint is not available.
  // The page will now only display static PDF report summaries.
  useEffect(() => {
      setLoading(false); // Set loading to false since we are not fetching dynamic data
  }, []);

  const handleYearChange = (event) => {
    const year = event.target.value;
    setSelectedYear(year);
    // No need to set dateRange or fetch data if dynamic fetching is removed
    // setDateRange(getDateRange(year, selectedPeriod));
  };

  const handlePeriodChange = (event) => {
    const period = event.target.value;
    setSelectedPeriod(period);
    // No need to set dateRange or fetch data if dynamic fetching is removed
    // setDateRange(getDateRange(selectedYear, period));
  };

  const getPeriodDisplayName = (period) => {
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const monthIndex = parseInt(period, 10);
      if (monthIndex >= 1 && monthIndex <= 12) return monthNames[monthIndex - 1];
      return period;
  };

  // --- Chart Data Preparation ---
  const prepareTrafficSourcesData = (data) => {
    if (!data || !data.traffic_sources) return null;
    
    const labels = Object.keys(data.traffic_sources);
    const values = Object.values(data.traffic_sources);
    
    return createChartData(
      labels,
      [{
        label: 'Traffic Sources',
        values: values,
        backgroundColor: [
          'rgba(16, 89, 56, 0.7)',  // HMA primary green
          'rgba(54, 162, 235, 0.7)', // Blue
          'rgba(255, 206, 86, 0.7)', // Yellow
          'rgba(75, 192, 192, 0.7)', // Teal
          'rgba(153, 102, 255, 0.7)' // Purple
        ]
      }]
    );
  };

  const prepareTrafficTrendData = () => {
    // Mock data for demonstration - would normally come from API
    const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    
    return createChartData(
      labels,
      [
        {
          label: 'Sessions',
          values: [520, 580, 603, 650, 590, 640],
          borderColor: 'rgba(16, 89, 56, 1)',
          backgroundColor: 'rgba(16, 89, 56, 0.1)',
          tension: 0.4,
          fill: true
        },
        {
          label: 'Users',
          values: [480, 510, 520, 590, 550, 580],
          borderColor: 'rgba(54, 162, 235, 1)',
          backgroundColor: 'rgba(54, 162, 235, 0.1)',
          tension: 0.4,
          fill: true
        }
      ]
    );
  };

  const preparePageViewsData = () => {
    // Mock data for demonstration - would normally come from API
    return createChartData(
      ['Home', 'About', 'Services', 'Blog', 'Contact'],
      [{
        label: 'Page Views',
        values: [833, 296, 178, 297, 79],
        backgroundColor: 'rgba(16, 89, 56, 0.7)'
      }]
    );
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Website Analytics
      </Typography>

      {/* Date Range Selection */}
      <Grid container spacing={2} sx={{ mb: 3, alignItems: 'center' }}>
        <Grid item>
          <FormControl size="small">
            <InputLabel id="year-select-label">Year</InputLabel>
            <Select labelId="year-select-label" value={selectedYear} label="Year" onChange={handleYearChange} sx={{ minWidth: 100 }}>
              {yearOptions.map(year => <MenuItem key={year} value={year}>{year}</MenuItem>)}
            </Select>
          </FormControl>
        </Grid>
        <Grid item>
          <FormControl size="small">
            <InputLabel id="period-select-label">Period</InputLabel>
            <Select labelId="period-select-label" value={selectedPeriod} label="Period" onChange={handlePeriodChange} sx={{ minWidth: 120 }}>
              {periodOptions.map(period => <MenuItem key={period} value={period}>{getPeriodDisplayName(period)}</MenuItem>)}
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
        <Typography sx={{ mt: 2 }}>No website analytics data found for the selected period. Please enter data via the Data Entry page.</Typography>
      ) : (
        <Grid container spacing={3}>
          {/* Stat Cards */}
          <Grid item xs={12} sm={6} md={3}>
            <MetricCard title="Total Users" value={summaryData.total_users?.toLocaleString()} />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <MetricCard title="Total Sessions" value={summaryData.total_sessions?.toLocaleString()} />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <MetricCard title="Avg Pages/Session" value={summaryData.avg_pages_per_session?.toFixed(1)} />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <MetricCard title="Avg Session Duration" value={formatDuration(summaryData.avg_session_duration_seconds)} />
          </Grid>
           <Grid item xs={12} sm={6} md={3}>
            <MetricCard title="Engaged Sessions" value={summaryData.total_engaged_sessions?.toLocaleString()} />
          </Grid>
           <Grid item xs={12} sm={6} md={3}>
            <MetricCard title="Form Submits" value={summaryData.conversion_forms?.toLocaleString()} />
          </Grid>
           <Grid item xs={12} sm={6} md={3}>
            <MetricCard title="Email Clicks" value={summaryData.conversion_email_clicks?.toLocaleString()} />
          </Grid>
           <Grid item xs={12} sm={6} md={3}>
            <MetricCard title="Calls" value={summaryData.conversion_calls?.toLocaleString()} />
          </Grid>

          {/* Traffic Sources Doughnut Chart */}
          <Grid item xs={12} md={6}>
            {summaryData && summaryData.traffic_sources ? (
              <DoughnutChart
                title="Traffic Sources"
                data={prepareTrafficSourcesData(summaryData)}
                options={{
                  plugins: {
                    tooltip: {
                      callbacks: {
                        label: (context) => {
                          const label = context.label || '';
                          const value = context.raw || 0;
                          const total = context.dataset.data.reduce((acc, val) => acc + val, 0);
                          const percentage = Math.round((value / total) * 100);
                          return `${label}: ${value} (${percentage}%)`;
                        }
                      }
                    }
                  }
                }}
              />
            ) : (
              <Paper sx={{ p: 2, height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography color="text.secondary">No traffic source data available</Typography>
              </Paper>
            )}
          </Grid>
          
          {/* Traffic Trend Line Chart */}
          <Grid item xs={12} md={6}>
            <LineChart
              title="Traffic Trend (Last 6 Months)"
              data={prepareTrafficTrendData()}
              options={{
                scales: {
                  y: {
                    beginAtZero: true
                  }
                }
              }}
            />
          </Grid>
          
          {/* Top Pages Bar Chart */}
          <Grid item xs={12}>
            <BarChart
              title="Top Pages by Views"
              data={preparePageViewsData()}
              options={{
                indexAxis: 'y',
                plugins: {
                  legend: {
                    display: false
                  }
                },
                scales: {
                  x: {
                    beginAtZero: true,
                    title: {
                      display: true,
                      text: 'Number of Views'
                    }
                  }
                }
              }}
            />
          </Grid>
        </Grid>
      )}

      {/* --- Static PDF Report Summaries --- */}
      {/* April 2025 Summary */}
      <PdfReportSummary
        periodTitle="April 2025"
        overallStats={april2025OverallStats}
        topPagesData={april2025TopPagesData}
        blogData={april2025BlogData}
        pdfPath="/reports/April 2025 MTD 0428.pdf"
      />
      
      {/* Q1 2025 Summary */}
      <PdfReportSummary
        periodTitle="Q1 2025"
        overallStats={q12025OverallStats}
        topPagesData={q12025TopPagesData}
        blogData={q12025BlogData}
        pdfPath="/reports/Hummer_Mower_Website_Report_GA4.pdf"
      />

      {/* 2024 Summary */}
       <PdfReportSummary
        periodTitle="2024 Calendar Year"
        overallStats={year2024OverallStats}
        topPagesData={year2024TopPagesData}
        blogData={year2024BlogData}
        pdfPath="/reports/HMA Google Analytics 2024 Calendar Year.pdf"
      />

      {/* 2023 Summary */}
       <PdfReportSummary
        periodTitle="2023 Calendar Year"
        overallStats={year2023OverallStats}
        topPagesData={year2023TopPagesData}
        blogData={year2023BlogData}
        pdfPath="/reports/HMA Google Analytics 2023 Calendar Year.pdf"
      />
      {/* --- End Static PDF Report Summaries --- */}

    </Box>
  );
}

export default WebsiteAnalyticsPage;