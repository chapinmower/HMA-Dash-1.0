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

function EmailAnalyticsForm({ open, onClose, onSubmit, initialData }) {
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
        campaign_name: initialData.campaign_name ?? '',
        subject_line: initialData.subject_line ?? '',
        sent: initialData.sent ?? '',
        delivered: initialData.delivered ?? '',
        opened: initialData.opened ?? '',
        open_rate: initialData.open_rate ?? '',
        clicked: initialData.clicked ?? '',
        click_rate: initialData.click_rate ?? '',
      } : {
        date: '',
        campaign_name: '',
        subject_line: '',
        sent: '',
        delivered: '',
        opened: '',
        open_rate: '',
        clicked: '',
        click_rate: '',
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
      sent: formData.sent === '' ? null : Number(formData.sent),
      delivered: formData.delivered === '' ? null : Number(formData.delivered),
      opened: formData.opened === '' ? null : Number(formData.opened),
      open_rate: formData.open_rate === '' ? null : Number(formData.open_rate),
      clicked: formData.clicked === '' ? null : Number(formData.clicked),
      click_rate: formData.click_rate === '' ? null : Number(formData.click_rate),
      // Date should be in YYYY-MM-DD format which the input provides
    };
     // Remove id if it exists but we are not editing
    if (!isEditing) {
        delete submissionData.id;
        delete submissionData.created_at;
    }
    onSubmit(submissionData);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{isEditing ? 'Edit Email Analytics Entry' : 'Add New Email Analytics Entry'}</DialogTitle>
      <Box component="form" onSubmit={handleSubmit}>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
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
            <Grid item xs={12} sm={8}>
              <TextField
                fullWidth
                id="campaign_name"
                name="campaign_name"
                label="Campaign Name"
                value={formData.campaign_name ?? ''}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="subject_line"
                name="subject_line"
                label="Subject Line"
                value={formData.subject_line ?? ''}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={6} sm={3}>
              <TextField
                fullWidth
                id="sent"
                name="sent"
                label="Sent"
                type="number"
                value={formData.sent ?? ''}
                onChange={handleChange}
                inputProps={{ min: 0 }}
              />
            </Grid>
             <Grid item xs={6} sm={3}>
              <TextField
                fullWidth
                id="delivered"
                name="delivered"
                label="Delivered"
                type="number"
                value={formData.delivered ?? ''}
                onChange={handleChange}
                inputProps={{ min: 0 }}
              />
            </Grid>
            <Grid item xs={6} sm={3}>
              <TextField
                fullWidth
                id="opened"
                name="opened"
                label="Opened"
                type="number"
                value={formData.opened ?? ''}
                onChange={handleChange}
                inputProps={{ min: 0 }}
              />
            </Grid>
             <Grid item xs={6} sm={3}>
              <TextField
                fullWidth
                id="clicked"
                name="clicked"
                label="Clicked"
                type="number"
                value={formData.clicked ?? ''}
                onChange={handleChange}
                inputProps={{ min: 0 }}
              />
            </Grid>
             <Grid item xs={6} sm={6}>
              <TextField
                fullWidth
                id="open_rate"
                name="open_rate"
                label="Open Rate (0.0 to 1.0)"
                type="number"
                value={formData.open_rate ?? ''}
                onChange={handleChange}
                inputProps={{ step: "0.01", min: 0, max: 1 }}
              />
            </Grid>
            <Grid item xs={6} sm={6}>
              <TextField
                fullWidth
                id="click_rate"
                name="click_rate"
                label="Click Rate (0.0 to 1.0)"
                type="number"
                value={formData.click_rate ?? ''}
                onChange={handleChange}
                inputProps={{ step: "0.01", min: 0, max: 1 }}
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

export default EmailAnalyticsForm;
