import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  CircularProgress,
  Alert,
  Tooltip as MuiTooltip // Alias Tooltip to avoid conflict with chart.js Tooltip
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import apiClient from '../apiClient';

// Helper to format date string
const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    // Add time component to avoid timezone issues with toLocaleDateString
    return new Date(dateString + 'T00:00:00').toLocaleDateString();
};

function EmailSummaryManager({ onEdit }) { // Accept onEdit prop
  const [summaries, setSummaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteStatus, setDeleteStatus] = useState({ id: null, loading: false, error: null });

  const fetchSummaries = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get('/api/email-summaries');
      setSummaries(response.data || []);
    } catch (err) {
      console.error("Error fetching email summaries:", err);
      setError(err.response?.data?.details || err.message || 'Failed to load email summaries.');
      setSummaries([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummaries();
  }, []); // Fetch on initial mount

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this summary? This action cannot be undone.')) {
      return;
    }
    setDeleteStatus({ id: id, loading: true, error: null });
    try {
      await apiClient.delete(`/api/email-summaries/${id}`);
      setDeleteStatus({ id: null, loading: false, error: null });
      // Refetch summaries after successful deletion
      fetchSummaries();
    } catch (err) {
      console.error(`Error deleting summary ${id}:`, err);
      const errorMsg = err.response?.data?.details || err.message || 'Failed to delete summary.';
      setDeleteStatus({ id: id, loading: false, error: errorMsg });
      // Optionally clear error after a few seconds
      setTimeout(() => setDeleteStatus(prev => ({ ...prev, error: null })), 5000);
    }
  };

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}><CircularProgress /></Box>;
  }

  if (error) {
    return <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>;
  }

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" gutterBottom>Manage Entered Email Summaries</Typography>
      {summaries.length === 0 ? (
        <Typography>No summaries entered yet.</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table size="small" aria-label="email summaries table">
            <TableHead>
              <TableRow sx={{ '& th': { fontWeight: 'bold' } }}>
                <TableCell>Campaign Name</TableCell>
                <TableCell>Period Type</TableCell>
                <TableCell>Start Date</TableCell>
                <TableCell>End Date</TableCell>
                <TableCell align="right">Recipients</TableCell>
                <TableCell align="right">Opens</TableCell>
                <TableCell align="right">Clicks</TableCell>
                <TableCell align="right">Total Clicks</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {summaries.map((row) => (
                <TableRow key={row.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell component="th" scope="row">{row.campaign_name}</TableCell>
                  <TableCell>{row.period_type}</TableCell>
                  <TableCell>{formatDate(row.period_start_date)}</TableCell>
                  <TableCell>{formatDate(row.period_end_date)}</TableCell>
                  <TableCell align="right">{row.unique_recipients?.toLocaleString() ?? '-'}</TableCell>
                  <TableCell align="right">{row.unique_opens?.toLocaleString() ?? '-'}</TableCell>
                  <TableCell align="right">{row.unique_clicks?.toLocaleString() ?? '-'}</TableCell>
                  <TableCell align="right">{row.total_clicks?.toLocaleString() ?? '-'}</TableCell>
                  <TableCell align="center">
                    <MuiTooltip title="Edit (Re-submit form)">
                      {/* Edit button calls the onEdit prop passed from parent */}
                      <IconButton size="small" onClick={() => onEdit(row)} aria-label="edit">
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </MuiTooltip>
                    <MuiTooltip title="Delete">
                       {/* Disable delete button while deleting this specific row */}
                       <span> {/* Span needed for tooltip when button is disabled */}
                         <IconButton
                           size="small"
                           onClick={() => handleDelete(row.id)}
                           disabled={deleteStatus.id === row.id && deleteStatus.loading}
                           aria-label="delete"
                           color="error"
                         >
                           {deleteStatus.id === row.id && deleteStatus.loading
                             ? <CircularProgress size={16} color="inherit" />
                             : <DeleteIcon fontSize="small" />
                           }
                         </IconButton>
                       </span>
                    </MuiTooltip>
                    {/* Display delete error specific to this row */}
                    {deleteStatus.id === row.id && deleteStatus.error && (
                       <Typography variant="caption" color="error" display="block">
                         {deleteStatus.error}
                       </Typography>
                     )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}

export default EmailSummaryManager;
