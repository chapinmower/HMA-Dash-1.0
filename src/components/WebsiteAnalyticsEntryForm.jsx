import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Grid,
  Typography,
  CircularProgress,
  Alert,
  Divider
} from '@mui/material';
// import { DatePicker } from '@mui/x-date-pickers/DatePicker'; // Consider adding date pickers later
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import apiClient from '../apiClient'; // Import the API client

const initialFormData = {
  report_start_date: '',
  report_end_date: '',
  total_users: '',
  new_users: '',
  total_sessions: '',
  avg_pages_per_session: '',
  avg_session_duration_seconds: '',
  total_engaged_sessions: '',
  conversion_calls: '',
  conversion_forms: '',
  conversion_email_clicks: '',
  top_page_1_path: '', top_page_1_sessions: '',
  top_page_2_path: '', top_page_2_sessions: '',
  top_page_3_path: '', top_page_3_sessions: '',
  top_page_4_path: '', top_page_4_sessions: '',
  top_page_5_path: '', top_page_5_sessions: '',
  top_source_1: '', top_source_1_sessions: '',
  top_source_2: '', top_source_2_sessions: '',
  top_source_3: '', top_source_3_sessions: '',
  top_query_1: '', top_query_1_clicks: '', top_query_1_impressions: '',
  top_query_2: '', top_query_2_clicks: '', top_query_2_impressions: '',
  top_query_3: '', top_query_3_clicks: '', top_query_3_impressions: '',
};

function WebsiteAnalyticsEntryForm() {
  const [formData, setFormData] = useState(initialFormData);
  const [isLoading, setIsLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ success: false, error: null });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setSubmitStatus({ success: false, error: null });

    // Basic validation (example: check required dates)
    if (!formData.report_start_date || !formData.report_end_date) {
        setSubmitStatus({ success: false, error: 'Report Start Date and End Date are required.' });
        setIsLoading(false);
        return;
    }

    try {
      console.log('Attempting to submit website analytics data:', formData);
      // Convert empty strings to null for numeric fields before sending
      const payload = { ...formData };
      Object.keys(payload).forEach(key => {
        if (key !== 'report_start_date' && key !== 'report_end_date' && payload[key] === '') {
          payload[key] = null;
        }
      });

      const response = await apiClient.post('/submit/website-summary', payload);
      console.log('Submission successful:', response.data);
      setSubmitStatus({ success: true, error: null });
      setFormData(initialFormData); // Reset form on success
    } catch (error) {
      console.error('Submission failed:', error.response?.data || error.message);
      const errorMessage = error.response?.data?.details || error.response?.data?.error || 'Submission failed. Please check the data and try again.';
      setSubmitStatus({ success: false, error: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  // Helper to create text fields
  const renderTextField = (name, label, type = 'text', required = false, gridProps = { xs: 12, sm: 6 }) => (
    <Grid item {...gridProps}>
      <TextField
        fullWidth
        variant="outlined"
        label={label}
        name={name}
        type={type}
        value={formData[name]}
        onChange={handleChange}
        required={required}
        size="small"
      />
    </Grid>
  );

  return (
    // <LocalizationProvider dateAdapter={AdapterDateFns}> // Wrap if using DatePicker
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <Typography variant="h6" gutterBottom>Report Period</Typography>
        <Grid container spacing={2} sx={{ mb: 3 }}>
          {/* Consider using DatePicker components here for better UX */}
          {renderTextField('report_start_date', 'Report Start Date (YYYY-MM-DD)', 'date', true, { xs: 12, sm: 6 })}
          {renderTextField('report_end_date', 'Report End Date (YYYY-MM-DD)', 'date', true, { xs: 12, sm: 6 })}
        </Grid>

        <Divider sx={{ my: 3 }} />
        <Typography variant="h6" gutterBottom>Overall Metrics</Typography>
        <Grid container spacing={2} sx={{ mb: 3 }}>
          {renderTextField('total_users', 'Total Users', 'number')}
          {renderTextField('new_users', 'New Users', 'number')}
          {renderTextField('total_sessions', 'Total Sessions', 'number')}
          {renderTextField('avg_pages_per_session', 'Avg Pages/Session', 'number')}
          {renderTextField('avg_session_duration_seconds', 'Avg Session Duration (Seconds)', 'number')}
          {renderTextField('total_engaged_sessions', 'Total Engaged Sessions', 'number')}
        </Grid>

        <Divider sx={{ my: 3 }} />
        <Typography variant="h6" gutterBottom>Conversions</Typography>
        <Grid container spacing={2} sx={{ mb: 3 }}>
          {renderTextField('conversion_calls', 'Calls (Conversion)', 'number')}
          {renderTextField('conversion_forms', 'Forms Submitted (Conversion)', 'number')}
          {renderTextField('conversion_email_clicks', 'Email Clicks (Conversion)', 'number')}
        </Grid>

        <Divider sx={{ my: 3 }} />
        <Typography variant="h6" gutterBottom>Top Pages (by Sessions)</Typography>
        <Grid container spacing={2} sx={{ mb: 1 }}>
          {renderTextField('top_page_1_path', 'Page 1 Path', 'text', false, { xs: 8, sm: 9 })}
          {renderTextField('top_page_1_sessions', 'Page 1 Sessions', 'number', false, { xs: 4, sm: 3 })}
          {renderTextField('top_page_2_path', 'Page 2 Path', 'text', false, { xs: 8, sm: 9 })}
          {renderTextField('top_page_2_sessions', 'Page 2 Sessions', 'number', false, { xs: 4, sm: 3 })}
          {renderTextField('top_page_3_path', 'Page 3 Path', 'text', false, { xs: 8, sm: 9 })}
          {renderTextField('top_page_3_sessions', 'Page 3 Sessions', 'number', false, { xs: 4, sm: 3 })}
          {renderTextField('top_page_4_path', 'Page 4 Path', 'text', false, { xs: 8, sm: 9 })}
          {renderTextField('top_page_4_sessions', 'Page 4 Sessions', 'number', false, { xs: 4, sm: 3 })}
          {renderTextField('top_page_5_path', 'Page 5 Path', 'text', false, { xs: 8, sm: 9 })}
          {renderTextField('top_page_5_sessions', 'Page 5 Sessions', 'number', false, { xs: 4, sm: 3 })}
        </Grid>

        <Divider sx={{ my: 3 }} />
        <Typography variant="h6" gutterBottom>Top Sources (by Sessions)</Typography>
        <Grid container spacing={2} sx={{ mb: 1 }}>
          {renderTextField('top_source_1', 'Source 1', 'text', false, { xs: 8, sm: 9 })}
          {renderTextField('top_source_1_sessions', 'Source 1 Sessions', 'number', false, { xs: 4, sm: 3 })}
          {renderTextField('top_source_2', 'Source 2', 'text', false, { xs: 8, sm: 9 })}
          {renderTextField('top_source_2_sessions', 'Source 2 Sessions', 'number', false, { xs: 4, sm: 3 })}
          {renderTextField('top_source_3', 'Source 3', 'text', false, { xs: 8, sm: 9 })}
          {renderTextField('top_source_3_sessions', 'Source 3 Sessions', 'number', false, { xs: 4, sm: 3 })}
        </Grid>

        <Divider sx={{ my: 3 }} />
        <Typography variant="h6" gutterBottom>Top Search Queries (from Search Console)</Typography>
        <Grid container spacing={2} sx={{ mb: 3 }}>
          {renderTextField('top_query_1', 'Query 1', 'text', false, { xs: 12, sm: 6 })}
          {renderTextField('top_query_1_clicks', 'Query 1 Clicks', 'number', false, { xs: 6, sm: 3 })}
          {renderTextField('top_query_1_impressions', 'Query 1 Impressions', 'number', false, { xs: 6, sm: 3 })}
          {renderTextField('top_query_2', 'Query 2', 'text', false, { xs: 12, sm: 6 })}
          {renderTextField('top_query_2_clicks', 'Query 2 Clicks', 'number', false, { xs: 6, sm: 3 })}
          {renderTextField('top_query_2_impressions', 'Query 2 Impressions', 'number', false, { xs: 6, sm: 3 })}
          {renderTextField('top_query_3', 'Query 3', 'text', false, { xs: 12, sm: 6 })}
          {renderTextField('top_query_3_clicks', 'Query 3 Clicks', 'number', false, { xs: 6, sm: 3 })}
          {renderTextField('top_query_3_impressions', 'Query 3 Impressions', 'number', false, { xs: 6, sm: 3 })}
        </Grid>

        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={isLoading}
          startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : null}
          sx={{ mt: 2 }}
        >
          {isLoading ? 'Submitting...' : 'Submit Website Summary'}
        </Button>

        {submitStatus.error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {submitStatus.error}
          </Alert>
        )}
        {submitStatus.success && (
          <Alert severity="success" sx={{ mt: 2 }}>
            Website analytics summary submitted successfully!
          </Alert>
        )}
      </Box>
    // </LocalizationProvider> // Close wrapper if using DatePicker
  );
}

export default WebsiteAnalyticsEntryForm;
