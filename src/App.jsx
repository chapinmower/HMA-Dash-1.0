import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Dashboard from './components/Dashboard';
// import Campaigns from './components/Campaigns';
import Requests from './components/Requests';
import Sidebar from './components/Sidebar'; // Needs user/logout props
import CalendarView from './components/CalendarView';
import MarketingMaterials from './components/MarketingMaterials';
import DataEntryPage from './components/DataEntryPage';
import EmailAnalyticsPage from './components/EmailAnalyticsPage';
import WebsiteAnalyticsPage from './components/WebsiteAnalyticsPage';
import LinkedInAnalyticsPage from './components/LinkedInAnalyticsPage';
import ContactEngagement from './components/ContactEngagement';
import ProjectTimeline from './components/ProjectTimeline'; // Import ProjectTimeline
import ProjectDetail from './components/ProjectDetail'; // Import ProjectDetail component

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#105938',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  // The main app layout
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex' }}>
        <Sidebar />
        <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
          {/* Removed basename for local development */}
          <Routes>
            <Route path="/" element={<Dashboard />} />
            {/* <Route path="/campaigns" element={<Campaigns />} /> */}
            <Route path="/analytics/email" element={<EmailAnalyticsPage />} />
            <Route path="/analytics/website" element={<WebsiteAnalyticsPage />} />
            <Route path="/analytics/linkedin" element={<LinkedInAnalyticsPage />} />
            <Route path="/contact-engagement" element={<ContactEngagement />} />
            <Route path="/calendar" element={<CalendarView />} />
            <Route path="/materials" element={<MarketingMaterials />} />
            <Route path="/data-entry" element={<DataEntryPage />} />
            <Route path="/requests" element={<Requests />} />
            {/* Add route for Project Timeline */}
            <Route path="/timeline" element={<ProjectTimeline />} />
            {/* Add route for individual project details */}
            <Route path="/timeline/:projectId" element={<ProjectDetail />} />
            {/* Remove explicit /login route, handled by conditional rendering */}
            {/* Catch-all redirects to dashboard if logged in */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
