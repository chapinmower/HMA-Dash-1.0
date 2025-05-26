import React, { useState, useEffect } from 'react'; // Import useEffect
import {
  Box,
  Button,
  TextField,
  Grid,
  Typography,
  CircularProgress,
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import apiClient from '../apiClient';

// Helper function to get year range
const getYearOptions = () => {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let i = 0; i < 5; i++) {
    years.push(currentYear - i);
  }
  return years;
};

// Helper function to get date range for a given year/month/quarter
const getDateRange = (year, periodType, periodValue) => {
    if (!year || !periodType || !periodValue) return { startDate: null, endDate: null };

    let startDate, endDate;
    const month = parseInt(periodValue, 10); // Used for Month and Quarter calculations

    if (periodType === 'Quarter') {
        if (month === 1) { startDate = `${year}-01-01`; endDate = `${year}-03-31`; }
        else if (month === 2) { startDate = `${year}-04-01`; endDate = `${year}-06-30`; }
        else if (month === 3) { startDate = `${year}-07-01`; endDate = `${year}-09-30`; }
        else if (month === 4) { startDate = `${year}-10-01`; endDate = `${year}-12-31`; }
        else { return { startDate: null, endDate: null }; } // Invalid quarter
    } else if (periodType === 'Month') {
        if (month >= 1 && month <= 12) {
            const firstDay = new Date(year, month - 1, 1);
            const lastDay = new Date(year, month, 0);
            startDate = firstDay.toISOString().split('T')[0];
            endDate = lastDay.toISOString().split('T')[0];
        } else { return { startDate: null, endDate: null }; } // Invalid month
    } else { // Assume Year if not Month or Quarter
         startDate = `${year}-01-01`;
         endDate = `${year}-12-31`;
    }
    return { startDate, endDate };
};


const initialFormData = {
  campaign_name: '',
  year: new Date().getFullYear(),
  period_type: 'Month', // Default to Month
  period_value: new Date().getMonth() + 1, // Default to current month (1-12)
  unique_recipients: '',
  unique_opens: '',
  unique_clicks: '',
  total_clicks: '',
};

// Accept initialData and onEditComplete props
function EmailSummaryEntryForm({ initialData, onEditComplete }) {
  const [formData, setFormData] = useState(initialData || initialFormData);
  const [isLoading, setIsLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ success: false, error: null });
  const isEditing = !!initialData; // Determine if we are in edit mode

  // Use useEffect to update form when initialData changes (i.e., when Edit is clicked)
  useEffect(() => {
      if (initialData) {
          // Need to parse period from dates if editing
          const year = initialData.period_start_date ? new Date(initialData.period_start_date + 'T00:00:00').getFullYear() : new Date().getFullYear();
          let periodType = initialData.period_type || 'Month';
          let periodValue = '';
           if (periodType === 'Month') {
               periodValue = initialData.period_start_date ? new Date(initialData.period_start_date + 'T00:00:00').getMonth() + 1 : 1;
           } else if (periodType === 'Quarter') {
               const month = initialData.period_start_date ? new Date(initialData.period_start_date + 'T00:00:00').getMonth() + 1 : 1;
               periodValue = Math.ceil(month / 3); // Calculate quarter number
           }
           // Year type doesn't need a periodValue

          setFormData({
              campaign_name: initialData.campaign_name || '',
              year: year,
              period_type: periodType,
              period_value: periodValue,
              unique_recipients: initialData.unique_recipients ?? '',
              unique_opens: initialData.unique_opens ?? '',
              unique_clicks: initialData.unique_clicks ?? '',
              total_clicks: initialData.total_clicks ?? '',
          });
      } else {
          // Reset to initial state if initialData becomes null (e.g., after successful edit)
          setFormData(initialFormData);
      }
  }, [initialData]); // Dependency array includes initialData

  const yearOptions = getYearOptions();
  const periodTypeOptions = ['Month', 'Quarter', 'Year'];
  const monthOptions = Array.from({ length: 12 }, (_, i) => ({ value: i + 1, label: new Date(0, i).toLocaleString('default', { month: 'long' }) }));
  const quarterOptions = [{ value: 1, label: 'Q1' }, { value: 2, label: 'Q2' }, { value: 3, label: 'Q3' }, { value: 4, label: 'Q4' }];

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
      // Reset period value if type changes
      ...(name === 'period_type' && { period_value: value === 'Month' ? 1 : (value === 'Quarter' ? 1 : '') })
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setSubmitStatus({ success: false, error: null });

    // Basic validation
    if (!formData.campaign_name || !formData.year || !formData.period_type || (formData.period_type !== 'Year' && !formData.period_value)) {
        setSubmitStatus({ success: false, error: 'Please fill in Campaign Name, Year, and Period details.' });
        setIsLoading(false);
        return;
    }

    // Calculate start/end dates
    const { startDate, endDate } = getDateRange(formData.year, formData.period_type, formData.period_value);

    if (!startDate || !endDate) {
         setSubmitStatus({ success: false, error: 'Invalid period selected.' });
         setIsLoading(false);
         return;
    }

    // Prepare payload for API
    const payload = {
        campaign_name: formData.campaign_name,
        period_type: formData.period_type,
        period_start_date: startDate,
        period_end_date: endDate,
        // Convert empty strings to null for numeric fields
        unique_recipients: formData.unique_recipients === '' ? null : Number(formData.unique_recipients),
        unique_opens: formData.unique_opens === '' ? null : Number(formData.unique_opens),
        unique_clicks: formData.unique_clicks === '' ? null : Number(formData.unique_clicks),
        total_clicks: formData.total_clicks === '' ? null : Number(formData.total_clicks),
    };

    // Input validation for numbers
     for (const key of ['unique_recipients', 'unique_opens', 'unique_clicks', 'total_clicks']) {
        if (payload[key] !== null && isNaN(payload[key])) {
            setSubmitStatus({ success: false, error: `Invalid number entered for ${key.replace(/_/g, ' ')}.` });
            setIsLoading(false);
            return;
        }
    }


    try {
      console.log('Submitting email summary data:', payload);
      // Use POST with upsert logic on the backend based on unique constraint
      const response = await apiClient.post('/api/submit/email-summary', payload);
      console.log('Submission successful:', response.data);
      setSubmitStatus({ success: true, error: null });

      // If editing, call onEditComplete to reset the parent state
      if (isEditing && onEditComplete) {
          onEditComplete();
      } else {
         // If creating new, reset form completely
         setFormData(initialFormData);
      }
       // Clear success message after a delay
       setTimeout(() => setSubmitStatus(prev => ({ ...prev, success: false })), 4000);

    } catch (error) {
      console.error('Submission failed:', error.response?.data || error.message);
      const errorMessage = error.response?.data?.details || error.response?.data?.error || 'Submission failed. Please check the data and try again.';
      // Handle unique constraint violation specifically
      if (error.response?.data?.details?.includes('unique constraint')) {
           setSubmitStatus({ success: false, error: `A summary for "${formData.campaign_name}" for this period already exists. You might need to edit it instead.` });
      } else {
           setSubmitStatus({ success: false, error: errorMessage });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <Grid container spacing={2}>
           {/* Campaign Name */}
           <Grid item xs={12}>
             <TextField
               fullWidth
               required
               variant="outlined"
               label="Campaign Name"
               name="campaign_name"
               value={formData.campaign_name}
               onChange={handleChange}
               size="small"
             />
           </Grid>

           {/* Period Selection */}
           <Grid item xs={12} sm={4}>
             <FormControl fullWidth size="small" required>
               <InputLabel id="year-select-label">Year</InputLabel>
               <Select
                 labelId="year-select-label"
                 name="year"
                 value={formData.year}
                 label="Year"
                 onChange={handleChange}
               >
                 {yearOptions.map(year => <MenuItem key={year} value={year}>{year}</MenuItem>)}
               </Select>
             </FormControl>
           </Grid>
           <Grid item xs={12} sm={4}>
             <FormControl fullWidth size="small" required>
               <InputLabel id="period-type-label">Period Type</InputLabel>
               <Select
                 labelId="period-type-label"
                 name="period_type"
                 value={formData.period_type}
                 label="Period Type"
                 onChange={handleChange}
               >
                 {periodTypeOptions.map(type => <MenuItem key={type} value={type}>{type}</MenuItem>)}
               </Select>
             </FormControl>
           </Grid>
           <Grid item xs={12} sm={4}>
             {formData.period_type === 'Month' && (
               <FormControl fullWidth size="small" required>
                 <InputLabel id="month-select-label">Month</InputLabel>
                 <Select
                   labelId="month-select-label"
                   name="period_value"
                   value={formData.period_value}
                   label="Month"
                   onChange={handleChange}
                 >
                   {monthOptions.map(opt => <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>)}
                 </Select>
               </FormControl>
             )}
             {formData.period_type === 'Quarter' && (
               <FormControl fullWidth size="small" required>
                 <InputLabel id="quarter-select-label">Quarter</InputLabel>
                 <Select
                   labelId="quarter-select-label"
                   name="period_value"
                   value={formData.period_value}
                   label="Quarter"
                   onChange={handleChange}
                 >
                   {quarterOptions.map(opt => <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>)}
                 </Select>
               </FormControl>
             )}
             {/* No value needed for Year type */}
           </Grid>

           {/* Metric Inputs */}
           <Grid item xs={6} sm={3}>
              <TextField fullWidth variant="outlined" label="Unique Recipients" name="unique_recipients" type="number" value={formData.unique_recipients} onChange={handleChange} size="small" InputLabelProps={{ shrink: true }}/>
           </Grid>
            <Grid item xs={6} sm={3}>
              <TextField fullWidth variant="outlined" label="Unique Opens" name="unique_opens" type="number" value={formData.unique_opens} onChange={handleChange} size="small" InputLabelProps={{ shrink: true }}/>
           </Grid>
            <Grid item xs={6} sm={3}>
              <TextField fullWidth variant="outlined" label="Unique Clicks" name="unique_clicks" type="number" value={formData.unique_clicks} onChange={handleChange} size="small" InputLabelProps={{ shrink: true }}/>
           </Grid>
            <Grid item xs={6} sm={3}>
              <TextField fullWidth variant="outlined" label="Total Clicks" name="total_clicks" type="number" value={formData.total_clicks} onChange={handleChange} size="small" InputLabelProps={{ shrink: true }}/>
           </Grid>

           {/* Submit Button & Status */}
           <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={isLoading}
                startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : null}
                sx={{ mt: 2 }}
              >
                {isLoading ? 'Submitting...' : 'Submit Email Summary'}
              </Button>
           </Grid>
            {submitStatus.error && (
              <Grid item xs={12}>
                <Alert severity="error" sx={{ mt: 2 }}>{submitStatus.error}</Alert>
              </Grid>
            )}
            {submitStatus.success && (
               <Grid item xs={12}>
                 <Alert severity="success" sx={{ mt: 2 }}>
                    Email summary {isEditing ? 'updated' : 'submitted'} successfully!
                 </Alert>
               </Grid>
            )}
        </Grid>
      </Box>
  );
}

export default EmailSummaryEntryForm;
