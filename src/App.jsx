import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
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
import ProjectDetailEnhanced from './components/projects/ProjectDetailEnhanced'; // Import Enhanced ProjectDetail
import HistoricalTrends from './components/HistoricalTrends'; // Import HistoricalTrends
import ProjectProgressTracker from './components/ProjectProgressTracker'; // Import ProjectProgressTracker
import DataManagement from './components/DataManagement'; // Import DataManagement
import TaskManager from './components/TaskManager'; // Import enhanced TaskManager
import Projects from './components/Projects'; // Import Projects component
import ErrorBoundary from './components/ErrorBoundary'; // Import ErrorBoundary
import { ProjectProvider } from './contexts/ProjectContext'; // Import ProjectProvider

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
    <HashRouter>
      <ThemeProvider theme={theme}>
        <ErrorBoundary>
          <ProjectProvider>
            <CssBaseline />
            <Box sx={{ display: 'flex' }}>
              <Sidebar />
              <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
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
            <Route path="/projects" element={<Projects />} />
            {/* Add route for Project Timeline */}
            <Route path="/timeline" element={<ProjectTimeline />} />
            {/* Add route for individual project details */}
            <Route path="/timeline/:projectId" element={<ProjectDetail />} />
            <Route path="/projects/:projectId" element={<ProjectDetailEnhanced />} />
            {/* Add new dashboard features */}
            <Route path="/trends" element={<HistoricalTrends />} />
            <Route path="/project-tracker" element={<ProjectProgressTracker />} />
            <Route path="/task-manager" element={<TaskManager />} />
            <Route path="/data-management" element={<DataManagement />} />
            {/* Remove explicit /login route, handled by conditional rendering */}
            {/* Catch-all redirects to dashboard if logged in */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Box>
      </Box>
      </ProjectProvider>
      </ErrorBoundary>
    </ThemeProvider>
    </HashRouter>
  );
}

export default App;
