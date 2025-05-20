import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
  CircularProgress,
  Alert,
  Snackbar // Added for feedback on creation
} from '@mui/material';
import apiClient from '../apiClient'; // Import the configured apiClient
import MonthlyScheduleDiagram from './MonthlyScheduleDiagram'; // Import the diagram component
import AddIcon from '@mui/icons-material/Add'; // Added for create button

// Define months statically for selection
const months = [
  'january', 'february', 'march', 'april', 'may', 'june',
  'july', 'august', 'september', 'october', 'november', 'december'
];

function CalendarView() {
  const [selectedMonth, setSelectedMonth] = useState(null); // Store the selected month name (e.g., 'january')
  const [monthScheduleData, setMonthScheduleData] = useState(null); // Store detailed data for the selected month
  const [loading, setLoading] = useState(false); // Loading state for fetching month details
  const [error, setError] = useState(null); // Error state for fetching month details
  const [isNotFoundError, setIsNotFoundError] = useState(false); // State to track if the error is a 404
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  // Function to fetch detailed schedule data for a specific month
  const fetchMonthData = async (month) => {
    if (!month) return;
    setLoading(true);
    setError(null);
    setIsNotFoundError(false); // Reset not found error state
    setMonthScheduleData(null); // Clear previous data
    console.log(`[CalendarView] Fetching data for month: ${month}`);
    try {
      // Use the new API endpoint: /api/schedules/:month
      const response = await apiClient.get(`/api/schedules/${month}`);
      console.log(`[CalendarView] Received data for ${month}:`, response.data);

      // Expecting { month: '...', title: '...', categories: [...] }
      if (response.data && response.data.month && Array.isArray(response.data.categories)) {
        setMonthScheduleData(response.data);
      } else {
        console.error(`[CalendarView] Unexpected API response structure for ${month}:`, response.data);
        setError(`Failed to load schedule data for ${month}: Invalid format from API.`);
      }
    } catch (err) {
      console.error(`[CalendarView] Error fetching schedule for ${month}:`, err);
      const apiErrorMessage = err.response?.data?.error || err.message;
      // Handle 404 specifically - means no data exists yet for this month
      if (err.response?.status === 404) {
          setError(`No schedule data found for ${month}.`);
          setIsNotFoundError(true); // Set flag for UI to show create button
          setMonthScheduleData(null); // Ensure no diagram component is rendered
      } else {
          setError(`Failed to load schedule data for ${month}: ${apiErrorMessage}`);
          setIsNotFoundError(false);
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle month selection from the list
  const handleMonthSelect = (month) => {
    setSelectedMonth(month); // Set the selected month name
    fetchMonthData(month); // Fetch data for the newly selected month
  };

  // Go back to the month selection list
  const handleBackToList = () => {
    setSelectedMonth(null);
    setMonthScheduleData(null); // Clear the detailed data
    setError(null); // Clear any previous errors
    setIsNotFoundError(false); // Clear not found state
  };

  // Function to create a new schedule diagram for the selected month
  const handleCreateSchedule = async () => {
      if (!selectedMonth) return;
      setLoading(true); // Show loading indicator during creation
      setError(null);
      setIsNotFoundError(false);
      console.log(`[CalendarView] Creating schedule for month: ${selectedMonth}`);
      try {
          // Call new API endpoint to create the diagram
          const response = await apiClient.post('/api/schedule_diagrams', { month: selectedMonth });
          console.log(`[CalendarView] Schedule created successfully for ${selectedMonth}:`, response.data);
          setSnackbarMessage(`Schedule for ${selectedMonth} created successfully!`);
          setSnackbarOpen(true);
          // Immediately fetch the newly created data
          await fetchMonthData(selectedMonth);
      } catch (err) {
          console.error(`[CalendarView] Error creating schedule for ${selectedMonth}:`, err);
          const apiErrorMessage = err.response?.data?.error || err.message;
          setError(`Failed to create schedule for ${selectedMonth}: ${apiErrorMessage}`);
          // If creation failed, it might still be a "not found" scenario for display purposes
          setIsNotFoundError(true);
      } finally {
          setLoading(false);
      }
  };

   const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };


  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        2025 Calendar & Planning
      </Typography>

      {selectedMonth ? (
        // Display the selected month's detailed schedule diagram/editor
        <Box>
          <Button onClick={handleBackToList} sx={{ mb: 2 }}>
            &larr; Back to Month List
          </Button>
          {/* Display loading indicator */}
          {loading && <CircularProgress sx={{ display: 'block', margin: '20px auto' }} />}

          {/* Display error messages OR the create button */}
          {!loading && error && (
              <Alert severity={isNotFoundError ? "info" : "error"} sx={{ my: 2 }}>
                  {error}
                  {isNotFoundError && (
                      <Button
                          variant="contained"
                          startIcon={<AddIcon />}
                          onClick={handleCreateSchedule}
                          sx={{ ml: 2 }}
                          size="small"
                      >
                          Create Schedule for {selectedMonth.charAt(0).toUpperCase() + selectedMonth.slice(1)}
                      </Button>
                  )}
              </Alert>
          )}


          {/* Pass the detailed monthScheduleData to the diagram component (only if not loading, no error, and data exists) */}
          {/* MonthlyScheduleDiagram will need significant updates to handle this structured data */}
          {/* and implement editing functionality */}
          {!loading && !error && monthScheduleData && (
             <MonthlyScheduleDiagram
                scheduleData={monthScheduleData}
                onDataChange={() => fetchMonthData(selectedMonth)} // Pass callback to refetch data on change
             />
          )}
        </Box>
      ) : (
        // Display the list of months for selection
        <Paper elevation={2} sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>Select a Month:</Typography>
          <List>
            {months.map((month, index) => (
              <React.Fragment key={month}>
                <ListItem disablePadding>
                  <ListItemButton onClick={() => handleMonthSelect(month)}>
                    <ListItemText
                      primary={month.charAt(0).toUpperCase() + month.slice(1)}
                    />
                  </ListItemButton>
                </ListItem>
                {index < months.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </Paper>
      )}

       {/* Snackbar for feedback */}
       <Snackbar
            open={snackbarOpen}
            autoHideDuration={6000}
            onClose={handleCloseSnackbar}
            message={snackbarMessage}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        />
    </Box>
  );
}

export default CalendarView;
