import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';

// Helper to format date for input type="date"
const formatDateForInput = (dateString) => {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0]; // YYYY-MM-DD
  } catch (e) {
    console.error("Error formatting date:", e);
    return '';
  }
};

function WebsiteAnalyticsForm({ open, onClose, onSubmit, initialData }) {
  const [formData, setFormData] = useState({});
  const isEditing = Boolean(initialData);

  useEffect(() => {
    // Reset form when initialData changes or dialog opens/closes
    if (open) {
      setFormData(initialData ? {
        ...initialData,
        // Format date for input field
        date: formatDateForInput(initialData.date),
        // Convert nulls/undefined to empty strings for controlled inputs
        visitors: initialData.visitors ?? '',
        pageviews: initialData.pageviews ?? '',
        bounce_rate: initialData.bounce_rate ?? '',
        avg_session_duration: initialData.avg_session_duration ?? '',
        source: initialData.source ?? '',
      } : {
        date: '',
        visitors: '',
        pageviews: '',
        bounce_rate: '',
        avg_session_duration: '',
        source: '',
      });
    }
  }, [initialData, open]);

  const handleChange = (event) => {
    const { name, value, type } = event.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? (value === '' ? '' : Number(value)) : value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Prepare data for submission (convert types if necessary)
    const submissionData = {
      ...formData,
      // Ensure numeric types are numbers or null
      visitors: formData.visitors === '' ? null : Number(formData.visitors),
      pageviews: formData.pageviews === '' ? null : Number(formData.pageviews),
      bounce_rate: formData.bounce_rate === '' ? null : Number(formData.bounce_rate),
      // Date should be in YYYY-MM-DD format which the input provides
    };
    // Remove id if it exists but we are not editing (shouldn't happen with current logic, but safe)
    if (!isEditing) {
        delete submissionData.id;
        delete submissionData.created_at;
    }
    onSubmit(submissionData);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{isEditing ? 'Edit Website Analytics Entry' : 'Add New Website Analytics Entry'}</DialogTitle>
      <Box component="form" onSubmit={handleSubmit}>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                id="date"
                name="date"
                label="Date"
                type="date"
                value={formData.date || ''}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="visitors"
                name="visitors"
                label="Visitors"
                type="number"
                value={formData.visitors ?? ''}
                onChange={handleChange}
                inputProps={{ min: 0 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="pageviews"
                name="pageviews"
                label="Pageviews"
                type="number"
                value={formData.pageviews ?? ''}
                onChange={handleChange}
                inputProps={{ min: 0 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="bounce_rate"
                name="bounce_rate"
                label="Bounce Rate (0.0 to 1.0)"
                type="number"
                value={formData.bounce_rate ?? ''}
                onChange={handleChange}
                inputProps={{ step: "0.01", min: 0, max: 1 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="avg_session_duration"
                name="avg_session_duration"
                label="Avg. Session Duration (e.g., 5m 30s)"
                value={formData.avg_session_duration ?? ''}
                onChange={handleChange}
                helperText="Use interval format like '5 minutes 30 seconds'"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="source"
                name="source"
                label="Source (e.g., Organic, Referral)"
                value={formData.source ?? ''}
                onChange={handleChange}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained">{isEditing ? 'Save Changes' : 'Add Entry'}</Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}

export default WebsiteAnalyticsForm;
