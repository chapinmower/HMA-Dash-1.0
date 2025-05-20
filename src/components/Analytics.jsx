import React, { useState, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Dialog from '@mui/material/Dialog'; // For confirmation dialog
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Snackbar from '@mui/material/Snackbar'; // For feedback
import Alert from '@mui/material/Alert';

import { supabase } from '../supabaseClient'; // Import Supabase client
import WebsiteAnalyticsForm from './WebsiteAnalyticsForm'; // Import the form
import EmailAnalyticsForm from './EmailAnalyticsForm'; // Import the form

function Analytics() {
  const [websiteData, setWebsiteData] = useState([]);
  const [emailData, setEmailData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for dialogs/forms
  const [openWebForm, setOpenWebForm] = useState(false);
  const [openEmailForm, setOpenEmailForm] = useState(false);
  const [editingWebData, setEditingWebData] = useState(null); // Holds data for editing
  const [editingEmailData, setEditingEmailData] = useState(null); // Holds data for editing

  // State for delete confirmation
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);
  const [itemToDelete, setItemToDelete] = useState({ id: null, type: null }); // { id: row.id, type: 'web' | 'email' }

  // State for Snackbar feedback
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const fetchData = async () => {
    // Keep existing loading/error logic, just wrap it
    setLoading(true);
    setError(null);
      try {
        // Fetch website analytics data
        // IMPORTANT: Replace 'website_analytics' with your actual table name if different
        const { data: webData, error: webError } = await supabase
          .from('website_analytics') // Replace with your actual table name
          .select('*')
          .order('date', { ascending: false }); // Example ordering

        if (webError) throw webError;
        setWebsiteData(webData || []);

        // Fetch email analytics data
        // IMPORTANT: Replace 'email_analytics' with your actual table name if different
        const { data: mailData, error: mailError } = await supabase
          .from('email_analytics') // Replace with your actual table name
          .select('*')
          .order('date', { ascending: false }); // Example ordering

        if (mailError) throw mailError;
        setEmailData(mailData || []);

      } catch (err) {
        console.error("Error fetching analytics data:", err);
        setError(err.message || 'Failed to fetch data');
        setWebsiteData([]); // Clear data on error
        setEmailData([]);   // Clear data on error
      } finally {
        setLoading(false);
      }
    };
    // Removed the misplaced fetchData() call from here
  // Removed the extra closing brace from here

  useEffect(() => {
    fetchData(); // Initial fetch - This is the correct place to call it
  }, []); // Empty dependency array means this runs once on mount

  // --- CRUD Handlers ---

  const handleOpenWebForm = (data = null) => {
    setEditingWebData(data); // Set null for 'Add', data object for 'Edit'
    setOpenWebForm(true);
  };

  const handleCloseWebForm = () => {
    setOpenWebForm(false);
    setEditingWebData(null); // Clear editing data on close
  };

  const handleOpenEmailForm = (data = null) => {
    setEditingEmailData(data);
    setOpenEmailForm(true);
  };

  const handleCloseEmailForm = () => {
    setOpenEmailForm(false);
    setEditingEmailData(null);
  };

  const handleOpenDeleteConfirm = (id, type) => {
    setItemToDelete({ id, type });
    setOpenDeleteConfirm(true);
  };

  const handleCloseDeleteConfirm = () => {
    setOpenDeleteConfirm(false);
    setItemToDelete({ id: null, type: null });
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  // --- Website Data CRUD ---
  const handleWebsiteSubmit = async (formData) => {
    const isEditing = Boolean(editingWebData);
    const tableName = 'website_analytics';
    let errorOccurred = false;

    try {
      if (isEditing) {
        // Update
        const { error } = await supabase
          .from(tableName)
          .update(formData)
          .eq('id', editingWebData.id);
        if (error) throw error;
        showSnackbar('Website data updated successfully!');
      } else {
        // Insert
        const { error } = await supabase
          .from(tableName)
          .insert([formData]);
        if (error) throw error;
        showSnackbar('Website data added successfully!');
      }
    } catch (err) {
      console.error(`Error ${isEditing ? 'updating' : 'adding'} website data:`, err);
      setError(`Failed to ${isEditing ? 'update' : 'add'} website data: ${err.message}`);
      showSnackbar(`Error: ${err.message}`, 'error');
      errorOccurred = true;
    } finally {
      handleCloseWebForm();
      if (!errorOccurred) fetchData(); // Refresh data on success
    }
  };

  const handleWebsiteDelete = async () => {
    if (!itemToDelete.id || itemToDelete.type !== 'web') return;
    const tableName = 'website_analytics';
    let errorOccurred = false;

    try {
      const { error } = await supabase
        .from(tableName)
        .delete()
        .eq('id', itemToDelete.id);
      if (error) throw error;
      showSnackbar('Website data deleted successfully!');
    } catch (err) {
      console.error("Error deleting website data:", err);
      setError(`Failed to delete website data: ${err.message}`);
      showSnackbar(`Error: ${err.message}`, 'error');
      errorOccurred = true;
    } finally {
      handleCloseDeleteConfirm();
      if (!errorOccurred) fetchData(); // Refresh data on success
    }
  };


  // --- Email Data CRUD ---
 const handleEmailSubmit = async (formData) => {
    const isEditing = Boolean(editingEmailData);
    const tableName = 'email_analytics';
    let errorOccurred = false;

    try {
      if (isEditing) {
        // Update
        const { error } = await supabase
          .from(tableName)
          .update(formData)
          .eq('id', editingEmailData.id);
        if (error) throw error;
        showSnackbar('Email data updated successfully!');
      } else {
        // Insert
        const { error } = await supabase
          .from(tableName)
          .insert([formData]);
        if (error) throw error;
        showSnackbar('Email data added successfully!');
      }
    } catch (err) {
      console.error(`Error ${isEditing ? 'updating' : 'adding'} email data:`, err);
      setError(`Failed to ${isEditing ? 'update' : 'add'} email data: ${err.message}`);
      showSnackbar(`Error: ${err.message}`, 'error');
      errorOccurred = true;
    } finally {
      handleCloseEmailForm();
      if (!errorOccurred) fetchData(); // Refresh data on success
    }
  };

  const handleEmailDelete = async () => {
    if (!itemToDelete.id || itemToDelete.type !== 'email') return;
    const tableName = 'email_analytics';
    let errorOccurred = false;

    try {
      const { error } = await supabase
        .from(tableName)
        .delete()
        .eq('id', itemToDelete.id);
      if (error) throw error;
      showSnackbar('Email data deleted successfully!');
    } catch (err) {
      console.error("Error deleting email data:", err);
      setError(`Failed to delete email data: ${err.message}`);
      showSnackbar(`Error: ${err.message}`, 'error');
      errorOccurred = true;
    } finally {
      handleCloseDeleteConfirm();
      if (!errorOccurred) fetchData(); // Refresh data on success
    }
  };

  // --- Render ---
  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4" gutterBottom sx={{ mb: 0 }}>
          Analytics Overview
        </Typography>
        {/* Add buttons can go here or within each section */}
      </Box>

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Typography color="error" sx={{ mt: 2 }}>
          Error loading data: {error}
        </Typography>
      )}

      {!loading && !error && (
        <Grid container spacing={3} sx={{ mt: 2 }}>
          {/* Website Analytics Section */}
          <Grid item xs={12}> {/* Make tables full width */}
            <Paper elevation={3} sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="h6" gutterBottom sx={{ mb: 0 }}>Website Analytics</Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => handleOpenWebForm()}
                  size="small"
                >
                  Add Website Data
                </Button>
              </Box>
              {websiteData.length > 0 ? (
                <TableContainer component={Paper} sx={{ maxHeight: 440 }}>
                  <Table stickyHeader size="small" aria-label="website analytics table">
                    <TableHead>
                      <TableRow>
                        <TableCell>Date</TableCell>
                        <TableCell align="right">Visitors</TableCell>
                        <TableCell align="right">Pageviews</TableCell>
                        <TableCell align="right">Bounce Rate</TableCell>
                        <TableCell>Avg. Duration</TableCell>
                        <TableCell>Source</TableCell>
                        <TableCell align="right">Actions</TableCell> {/* Actions column */}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {websiteData.map((row) => (
                        <TableRow hover key={row.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                          <TableCell component="th" scope="row">{new Date(row.date).toLocaleDateString()}</TableCell>
                          <TableCell align="right">{row.visitors}</TableCell>
                          <TableCell align="right">{row.pageviews}</TableCell>
                          <TableCell align="right">{row.bounce_rate ? `${(row.bounce_rate * 100).toFixed(1)}%` : '-'}</TableCell>
                          <TableCell>{row.avg_session_duration || '-'}</TableCell>
                          <TableCell>{row.source || '-'}</TableCell>
                          <TableCell align="right">
                            <IconButton size="small" onClick={() => handleOpenWebForm(row)} aria-label="edit">
                              <EditIcon fontSize="small" />
                            </IconButton>
                            <IconButton size="small" onClick={() => handleOpenDeleteConfirm(row.id, 'web')} aria-label="delete">
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Typography>No website analytics data found.</Typography>
              )}
            </Paper>
          </Grid>

          {/* Email Analytics Section */}
          <Grid item xs={12}> {/* Make tables full width */}
            <Paper elevation={3} sx={{ p: 2 }}>
               <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="h6" gutterBottom sx={{ mb: 0 }}>Email Analytics</Typography>
                 <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => handleOpenEmailForm()}
                  size="small"
                >
                  Add Email Data
                </Button>
              </Box>
              {emailData.length > 0 ? (
                 <TableContainer component={Paper} sx={{ maxHeight: 440 }}>
                  <Table stickyHeader size="small" aria-label="email analytics table">
                    <TableHead>
                      <TableRow>
                        <TableCell>Date</TableCell>
                        <TableCell>Campaign</TableCell>
                        <TableCell>Subject</TableCell>
                        <TableCell align="right">Sent</TableCell>
                        <TableCell align="right">Opened</TableCell>
                        <TableCell align="right">Open Rate</TableCell>
                        <TableCell align="right">Clicked</TableCell>
                        <TableCell align="right">Click Rate</TableCell>
                        <TableCell align="right">Actions</TableCell> {/* Actions column */}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {emailData.map((row) => (
                        <TableRow hover key={row.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                          <TableCell component="th" scope="row">{new Date(row.date).toLocaleDateString()}</TableCell>
                          <TableCell>{row.campaign_name || '-'}</TableCell>
                          <TableCell>{row.subject_line || '-'}</TableCell>
                          <TableCell align="right">{row.sent}</TableCell>
                          <TableCell align="right">{row.opened}</TableCell>
                          <TableCell align="right">{row.open_rate ? `${(row.open_rate * 100).toFixed(1)}%` : '-'}</TableCell>
                          <TableCell align="right">{row.clicked}</TableCell>
                          <TableCell align="right">{row.click_rate ? `${(row.click_rate * 100).toFixed(1)}%` : '-'}</TableCell>
                           <TableCell align="right">
                            <IconButton size="small" onClick={() => handleOpenEmailForm(row)} aria-label="edit">
                              <EditIcon fontSize="small" />
                            </IconButton>
                            <IconButton size="small" onClick={() => handleOpenDeleteConfirm(row.id, 'email')} aria-label="delete">
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Typography>No email analytics data found.</Typography>
              )}
            </Paper>
          </Grid>
        </Grid>
      )}

      {/* Website Analytics Form Dialog */}
      <WebsiteAnalyticsForm
        open={openWebForm}
        onClose={handleCloseWebForm}
        onSubmit={handleWebsiteSubmit}
        initialData={editingWebData}
      />

      {/* Email Analytics Form Dialog */}
      <EmailAnalyticsForm
        open={openEmailForm}
        onClose={handleCloseEmailForm}
        onSubmit={handleEmailSubmit}
        initialData={editingEmailData}
      />

       {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteConfirm}
        onClose={handleCloseDeleteConfirm}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this {itemToDelete.type} analytics entry? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteConfirm}>Cancel</Button>
          <Button
            onClick={itemToDelete.type === 'web' ? handleWebsiteDelete : handleEmailDelete}
            color="error"
            variant="contained"
            autoFocus
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for Feedback */}
      <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
          <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
              {snackbar.message}
          </Alert>
      </Snackbar>

    </Box>
  );
}

export default Analytics;
