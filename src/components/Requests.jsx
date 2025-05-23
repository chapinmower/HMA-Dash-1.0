import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  CircularProgress,
  Divider,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Chip,
  Alert,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  IconButton,
  Tabs,
  Tab
} from '@mui/material';
import {
  Add as AddIcon,
  CheckCircle as CheckCircleIcon,
  Refresh as RefreshIcon,
  Timer as TimerIcon,
  Error as ErrorIcon,
  HighPriority as HighPriorityIcon,
  Delete as DeleteIcon,
  Edit as EditIcon
} from '@mui/icons-material';

// Simulated API URL - replace with actual backend endpoint when available
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

function Requests() {
  // Form state
  const [requestForm, setRequestForm] = useState({
    title: '',
    description: '',
    type: '',
    priority: 'medium',
    dueDate: '',
    assignedTo: 'chapin-m'
  });

  // Application state
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const [confirmDialog, setConfirmDialog] = useState({ open: false, requestId: null });
  const [editMode, setEditMode] = useState(false);
  const [editingRequestId, setEditingRequestId] = useState(null);
  const [tabValue, setTabValue] = useState(0); // State for tabs (0 = Active, 1 = Completed)

  // Load existing requests on component mount
  useEffect(() => {
    fetchRequests();
  }, []);

  // Simulate fetching requests from backend
  const fetchRequests = async () => {
    setLoading(true);
    
    // In a real application, this would be an API call:
    // try {
    //   const response = await axios.get(`${API_URL}/requests`);
    //   setRequests(response.data);
    // } catch (error) {
    //   console.error('Error fetching requests:', error);
    //   showSnackbar('Failed to load requests', 'error');
    // } finally {
    //   setLoading(false);
    // }

    // For now, we'll use mock data
    setTimeout(() => {
      const mockRequests = [
        {
          id: 3, 
          title: 'Add new client to distribution list',
          description: 'Need to add Grove Financial to our newsletter distribution list.',
          type: 'contact',
          priority: 'low',
          status: 'completed',
          createdAt: '2025-05-05T14:45:00',
          dueDate: '2025-05-08',
          assignedTo: 'chapin-m',
          completedAt: '2025-05-06T11:20:00',
          notes: 'Added to both newsletter and market update distribution lists'
        }
      ];
      
      setRequests(mockRequests);
      setLoading(false);
    }, 800); // Simulate loading delay
  };

  // Show snackbar notification
  const showSnackbar = (message, severity = 'info') => {
    setSnackbar({ open: true, message, severity });
  };

  // Close snackbar
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Handle form field changes
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setRequestForm({ ...requestForm, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!requestForm.title || !requestForm.description || !requestForm.type) {
      showSnackbar('Please fill in all required fields', 'error');
      return;
    }

    setLoading(true);

    // In a real application, this would be an API call:
    // try {
    //   let response;
    //   if (editMode) {
    //     response = await axios.put(`${API_URL}/requests/${editingRequestId}`, requestForm);
    //     showSnackbar('Request updated successfully', 'success');
    //   } else {
    //     response = await axios.post(`${API_URL}/requests`, requestForm);
    //     showSnackbar('Request submitted successfully', 'success');
    //   }
    //   
    //   fetchRequests(); // Refresh the list
    // } catch (error) {
    //   console.error('Error submitting request:', error);
    //   showSnackbar('Failed to submit request', 'error');
    // } finally {
    //   setLoading(false);
    // }

    // For now, simulate API call
    setTimeout(() => {
      if (editMode) {
        // Update existing request
        const updatedRequests = requests.map(req => 
          req.id === editingRequestId ? {
            ...req,
            ...requestForm,
            status: req.status // Preserve status
          } : req
        );
        setRequests(updatedRequests);
        showSnackbar('Request updated successfully', 'success');
        setEditMode(false);
        setEditingRequestId(null);
      } else {
        // Add new request
        const newRequest = {
          id: Date.now(), // Generate a simple ID
          ...requestForm,
          status: 'pending',
          createdAt: new Date().toISOString(),
          notes: null
        };
        setRequests([newRequest, ...requests]);
        showSnackbar('Request submitted successfully', 'success');
      }
      
      // Reset form
      setRequestForm({
        title: '',
        description: '',
        type: '',
        priority: 'medium',
        dueDate: '',
        assignedTo: 'chapin-m'
      });
      
      setLoading(false);
    }, 1000);
  };

  // Handle request edit
  const handleEditRequest = (request) => {
    setRequestForm({
      title: request.title,
      description: request.description,
      type: request.type,
      priority: request.priority,
      dueDate: request.dueDate,
      assignedTo: request.assignedTo
    });
    setEditMode(true);
    setEditingRequestId(request.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle request status change
  const handleStatusChange = async (requestId, newStatus) => {
    setLoading(true);
    
    // In a real application, this would be an API call:
    // try {
    //   await axios.patch(`${API_URL}/requests/${requestId}`, { status: newStatus });
    //   fetchRequests(); // Refresh the list
    //   showSnackbar('Request status updated', 'success');
    // } catch (error) {
    //   console.error('Error updating request status:', error);
    //   showSnackbar('Failed to update request status', 'error');
    // } finally {
    //   setLoading(false);
    // }

    // For now, simulate API call
    setTimeout(() => {
      const updatedRequests = requests.map(req => 
        req.id === requestId 
          ? { 
              ...req, 
              status: newStatus,
              ...(newStatus === 'completed' ? { completedAt: new Date().toISOString() } : {})
            } 
          : req
      );
      setRequests(updatedRequests);
      showSnackbar('Request status updated', 'success');
      setLoading(false);
    }, 500);
  };

  // Handle request deletion
  const handleDeleteRequest = (requestId) => {
    setConfirmDialog({ open: true, requestId });
  };

  // Confirm and execute deletion
  const confirmDelete = async () => {
    const requestId = confirmDialog.requestId;
    setConfirmDialog({ open: false, requestId: null });
    setLoading(true);
    
    // In a real application, this would be an API call:
    // try {
    //   await axios.delete(`${API_URL}/requests/${requestId}`);
    //   fetchRequests(); // Refresh the list
    //   showSnackbar('Request deleted', 'success');
    // } catch (error) {
    //   console.error('Error deleting request:', error);
    //   showSnackbar('Failed to delete request', 'error');
    // } finally {
    //   setLoading(false);
    // }

    // For now, simulate API call
    setTimeout(() => {
      const updatedRequests = requests.filter(req => req.id !== requestId);
      setRequests(updatedRequests);
      showSnackbar('Request deleted', 'success');
      setLoading(false);
    }, 500);
  };

  // Cancel deletion
  const cancelDelete = () => {
    setConfirmDialog({ open: false, requestId: null });
  };

  // Cancel edit mode
  const handleCancelEdit = () => {
    setEditMode(false);
    setEditingRequestId(null);
    setRequestForm({
      title: '',
      description: '',
      type: '',
      priority: 'medium',
      dueDate: '',
      assignedTo: 'chapin-m'
    });
  };

  // Get status chip color based on status
  const getStatusChipColor = (status) => {
    switch (status) {
      case 'completed': return 'success';
      case 'in-progress': return 'warning';
      case 'pending': return 'info';
      default: return 'default';
    }
  };

  // Get priority chip color based on priority
  const getPriorityChipColor = (priority) => {
    switch (priority) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  // Tab panel helper component
  function TabPanel(props) {
    const { children, value, index, ...other } = props;
  
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`requests-tabpanel-${index}`}
        aria-labelledby={`requests-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{ pt: 3 }}>
            {children}
          </Box>
        )}
      </div>
    );
  }
  
  // Tab accessibility props
  function a11yProps(index) {
    return {
      id: `requests-tab-${index}`,
      'aria-controls': `requests-tabpanel-${index}`,
    };
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {editMode ? 'Edit Request' : 'Task Request System'}
        </Typography>
        <Button 
          variant="outlined" 
          color="primary" 
          startIcon={<RefreshIcon />}
          onClick={fetchRequests}
          disabled={loading}
        >
          Refresh
        </Button>
      </Box>

      {/* Request Form */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          {editMode ? 'Edit Existing Request' : 'Submit a New Request'}
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <TextField
                fullWidth
                required
                label="Request Title"
                name="title"
                value={requestForm.title}
                onChange={handleFormChange}
                variant="outlined"
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth variant="outlined" margin="normal" required>
                <InputLabel>Request Type</InputLabel>
                <Select
                  name="type"
                  value={requestForm.type}
                  onChange={handleFormChange}
                  label="Request Type"
                >
                  <MenuItem value="">Select a type</MenuItem>
                  <MenuItem value="dashboard">Dashboard Update</MenuItem>
                  <MenuItem value="email">Email/Newsletter</MenuItem>
                  <MenuItem value="website">Website Change</MenuItem>
                  <MenuItem value="contact">Contact Management</MenuItem>
                  <MenuItem value="project">Project Request</MenuItem>
                  <MenuItem value="event">Event Update</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                multiline
                rows={4}
                label="Request Description"
                name="description"
                value={requestForm.description}
                onChange={handleFormChange}
                variant="outlined"
                placeholder="Please provide details about your request..."
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth variant="outlined" margin="normal">
                <InputLabel>Priority</InputLabel>
                <Select
                  name="priority"
                  value={requestForm.priority}
                  onChange={handleFormChange}
                  label="Priority"
                >
                  <MenuItem value="low">Low</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="high">High</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                type="date"
                label="Due Date (Optional)"
                name="dueDate"
                value={requestForm.dueDate}
                onChange={handleFormChange}
                variant="outlined"
                margin="normal"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth variant="outlined" margin="normal">
                <InputLabel>Assigned To</InputLabel>
                <Select
                  name="assignedTo"
                  value={requestForm.assignedTo}
                  onChange={handleFormChange}
                  label="Assigned To"
                  disabled
                >
                  <MenuItem value="chapin-m">Chapin M</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
              {editMode && (
                <Button
                  type="button"
                  variant="outlined"
                  color="secondary"
                  onClick={handleCancelEdit}
                  disabled={loading}
                >
                  Cancel
                </Button>
              )}
              <Button
                type="submit"
                variant="contained"
                color="primary"
                startIcon={editMode ? <EditIcon /> : <AddIcon />}
                disabled={loading}
              >
                {editMode ? 'Update Request' : 'Submit Request'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>

      {/* Requests tabs */}
      <Paper sx={{ mb: 4 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab label="Active Requests (BETA)" {...a11yProps(0)} />
          <Tab label="Completed Requests" {...a11yProps(1)} />
        </Tabs>

        {/* Active Requests Tab */}
        <TabPanel value={tabValue} index={0}>
          <Box sx={{ p: 2, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              View-Only Mode
            </Typography>
            <Alert severity="info" sx={{ mb: 2 }}>
              This feature is currently in beta. Submit new requests above, but request management is view-only at this time.
            </Alert>
            <Paper elevation={0} sx={{ p: 3, bgcolor: 'background.paper', borderRadius: 2, border: '1px dashed rgba(0, 0, 0, 0.12)' }}>
              <Typography variant="body1" sx={{ fontStyle: 'italic', color: 'text.secondary' }}>
                Active requests will appear here once the feature is fully implemented. Your submitted requests will be received by the marketing team in the meantime.
              </Typography>
            </Paper>
          </Box>
        </TabPanel>

        {/* Completed Requests Tab */}
        <TabPanel value={tabValue} index={1}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Box>
              {requests.filter(req => req.status === 'completed').length > 0 ? (
                <Grid container spacing={3}>
                  {requests
                    .filter(req => req.status === 'completed')
                    .map(request => (
                    <Grid item xs={12} key={request.id}>
                      <Card variant="outlined" sx={{ opacity: 0.9 }}>
                        <CardContent>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                            <Typography variant="h6">{request.title}</Typography>
                            <Chip 
                              label="COMPLETED" 
                              size="small" 
                              color="success"
                              icon={<CheckCircleIcon />}
                            />
                          </Box>
                          <Typography variant="body1" paragraph>
                            {request.description}
                          </Typography>
                          <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                              <Typography variant="body2" color="text.secondary">
                                <strong>Completed:</strong> {formatDate(request.completedAt)}
                              </Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <Typography variant="body2" color="text.secondary">
                                <strong>Type:</strong> {request.type.charAt(0).toUpperCase() + request.type.slice(1)}
                              </Typography>
                            </Grid>
                          </Grid>
                          {request.notes && (
                            <Box sx={{ mt: 2, p: 1, bgcolor: 'rgba(0, 0, 0, 0.03)', borderRadius: 1 }}>
                              <Typography variant="body2" color="text.secondary">
                                <strong>Notes:</strong> {request.notes}
                              </Typography>
                            </Box>
                          )}
                          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                            <Button 
                              size="small" 
                              variant="outlined" 
                              color="error" 
                              onClick={() => handleDeleteRequest(request.id)}
                            >
                              Delete
                            </Button>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Alert severity="info" sx={{ mt: 2 }}>No completed requests found.</Alert>
              )}
            </Box>
          )}
        </TabPanel>
      </Paper>

      {/* Confirmation Dialog */}
      <Dialog
        open={confirmDialog.open}
        onClose={cancelDelete}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this request? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelDelete} color="primary">
            Cancel
          </Button>
          <Button onClick={confirmDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default Requests;