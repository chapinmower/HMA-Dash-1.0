import React from 'react';
import { Box, Typography, Grid, Paper, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'; // Removed unused Link import
import DownloadIcon from '@mui/icons-material/Download';

// Helper to format duration (copied from WebsiteAnalyticsPage)
const formatDuration = (seconds) => {
  if (seconds === null || seconds === undefined || isNaN(seconds)) return 'N/A';
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.round(seconds % 60);
  return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
};

// Reusable Metric Card (copied from WebsiteAnalyticsPage)
const MetricCard = ({ title, value }) => (
  <Paper elevation={1} sx={{ p: 1.5, textAlign: 'center', height: '100%', backgroundColor: 'grey.50' }}>
    <Typography color="textSecondary" gutterBottom sx={{ fontSize: '0.8rem' }}>
      {title}
    </Typography>
    <Typography variant="h6" sx={{ fontWeight: 'medium', color: 'primary.dark', fontSize: '1.1rem' }}>
      {value ?? 'N/A'}
    </Typography>
  </Paper>
);

// Reusable Blog Table (modified from BlogPerformance)
const BlogTable = ({ blogData }) => (
    <TableContainer component={Paper} sx={{ mb: 3 }}>
      <Table size="small" aria-label="top blogs table">
        <TableHead sx={{ backgroundColor: 'grey.100' }}>
          <TableRow>
            <TableCell>Blog Post Title</TableCell>
            <TableCell align="center">Views</TableCell>
            <TableCell align="center">Avg. Session Duration</TableCell>
            <TableCell align="center">Scroll Depth 75% (Count)</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {blogData.map((post, index) => (
            <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              <TableCell component="th" scope="row">{post.title}</TableCell>
              <TableCell align="center">{post.views}</TableCell>
              <TableCell align="center">{post.duration}</TableCell>
              <TableCell align="center">{post.scrollDepth}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
);

const PdfReportSummary = ({ periodTitle, overallStats, topPagesData, blogData, pdfPath }) => {
  return (
    <Paper elevation={2} sx={{ p: 3, mt: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 1 }}>
        <Typography variant="h5" component="h2" sx={{ color: '#105938' }}>
          {periodTitle} PDF Report Summary
        </Typography>
        {pdfPath && (
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            href={pdfPath}
            target="_blank"
            rel="noopener noreferrer"
            size="small"
          >
            Download Full Report (PDF)
          </Button>
        )}
      </Box>

      {/* Overall Stats */}
      <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>Overall Performance {overallStats.comparisonPeriod ? `(${overallStats.comparisonPeriod})` : ''}</Typography>
      <Grid container spacing={2} sx={{ mb: 3 }}>
         <Grid item xs={6} sm={4} md={2.4}>
           <MetricCard title="Users" value={`${overallStats.users} ${overallStats.usersChange ? `(${overallStats.usersChange})` : ''}`} />
         </Grid>
         <Grid item xs={6} sm={4} md={2.4}>
           <MetricCard title="New Users" value={`${overallStats.newUsers} ${overallStats.newUsersChange ? `(${overallStats.newUsersChange})` : ''}`} />
         </Grid>
         <Grid item xs={6} sm={4} md={2.4}>
           <MetricCard title="Sessions" value={`${overallStats.sessions} ${overallStats.sessionsChange ? `(${overallStats.sessionsChange})` : ''}`} />
         </Grid>
         <Grid item xs={6} sm={4} md={2.4}>
           <MetricCard title="Pages/Session" value={`${overallStats.pagesPerSession} ${overallStats.pagesPerSessionChange ? `(${overallStats.pagesPerSessionChange})` : ''}`} />
         </Grid>
         <Grid item xs={6} sm={4} md={2.4}>
           <MetricCard title="Avg Eng. Time" value={`${formatDuration(overallStats.avgEngTimeSeconds)} ${overallStats.avgEngTimeChange ? `(${overallStats.avgEngTimeChange})` : ''}`} />
         </Grid>
      </Grid>

      {/* Top Pages Table Removed */}

      {/* Blog Performance Table */}
      {blogData && blogData.length > 0 && (
          <>
            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>Top Blog Posts</Typography>
            <BlogTable blogData={blogData} />
          </>
      )}
       <p className="text-xs text-gray-500 mt-2">Data sourced from {pdfPath ? pdfPath.split('/').pop() : 'PDF Report'}</p>
    </Paper>
  );
};

export default PdfReportSummary;
