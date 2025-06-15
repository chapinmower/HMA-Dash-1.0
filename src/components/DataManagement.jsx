import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  IconButton,
  Chip,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tooltip
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  Upload as UploadIcon,
  Download as DownloadIcon,
  History as HistoryIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  ExpandMore as ExpandMoreIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Schedule as ScheduleIcon
} from '@mui/icons-material';
import { loadStaticData } from '../apiClient';
import EmailDataImporter from './EmailDataImporter';
import { DataSync } from '../utils/dataSync';

const DataManagement = () => {
  const [dataFiles, setDataFiles] = useState({});
  const [lastUpdated, setLastUpdated] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updateDialog, setUpdateDialog] = useState(false);
  const [selectedDataType, setSelectedDataType] = useState('');
  const [updateData, setUpdateData] = useState({});
  const [error, setError] = useState(null);
  const [expandedSection, setExpandedSection] = useState(false);
  const [showImporter, setShowImporter] = useState(false);

  const dataTypes = [
    { key: 'email_analytics', name: 'Email Analytics', icon: '📧' },
    { key: 'website_analytics', name: 'Website Analytics', icon: '🌐' },
    { key: 'linkedin_analytics', name: 'LinkedIn Analytics', icon: '💼' },
    { key: 'projects', name: 'Projects', icon: '📋' },
    { key: 'contacts', name: 'Contacts', icon: '👥' },
    { key: 'team', name: 'Team', icon: '🏢' }
  ];

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      setLoading(true);
      const data = {};
      
      // Load all data files
      for (const dataType of dataTypes) {
        try {
          const fileData = await loadStaticData(`${dataType.key}.json`);
          data[dataType.key] = fileData;
        } catch (err) {
          console.warn(`Could not load ${dataType.key}:`, err);
          data[dataType.key] = null;
        }
      }
      
      // Load last updated timestamp
      try {
        const timestamp = await loadStaticData('last_updated.json');
        setLastUpdated(timestamp);
      } catch (err) {
        console.warn('Could not load timestamp:', err);
      }
      
      setDataFiles(data);
      setError(null);
    } catch (err) {
      setError('Failed to load data files');
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  const getDataFreshness = (lastUpdateString) => {
    if (!lastUpdateString) return { status: 'unknown', message: 'Unknown', color: 'default' };
    
    const lastUpdate = new Date(lastUpdateString);
    const now = new Date();
    const hoursDiff = Math.floor((now - lastUpdate) / (1000 * 60 * 60));
    const daysDiff = Math.floor(hoursDiff / 24);
    
    if (hoursDiff < 24) {
      return { 
        status: 'fresh', 
        message: `Updated ${hoursDiff} hours ago`,
        color: 'success' 
      };
    } else if (daysDiff < 7) {
      return { 
        status: 'moderate', 
        message: `Updated ${daysDiff} days ago`,
        color: 'warning' 
      };
    } else {
      return { 
        status: 'stale', 
        message: `Updated ${daysDiff} days ago`,
        color: 'error' 
      };
    }
  };

  const getFreshnessIcon = (status) => {
    switch (status) {
      case 'fresh':
        return <CheckCircleIcon color="success" />;
      case 'moderate':
        return <WarningIcon color="warning" />;
      case 'stale':
        return <ErrorIcon color="error" />;
      default:
        return <ScheduleIcon color="action" />;
    }
  };

  const formatDataSummary = (dataType, data) => {
    if (!data) return 'No data available';
    
    switch (dataType) {
      case 'email_analytics':
        const emailSummary = data.summaries?.[0];
        return emailSummary ? 
          `${emailSummary.opens?.toLocaleString()} opens, ${emailSummary.clicks?.toLocaleString()} clicks (${emailSummary.period})` :
          'No summary data';
      
      case 'website_analytics':
        const websiteSummary = data.summaries?.[0];
        return websiteSummary ? 
          `${websiteSummary.visits?.toLocaleString()} visits, ${websiteSummary.pageViews?.toLocaleString()} page views (${websiteSummary.period})` :
          'No summary data';
      
      case 'linkedin_analytics':
        const linkedinSummary = data.summaries?.[0];
        return linkedinSummary ? 
          `${linkedinSummary.impressions?.toLocaleString()} impressions, ${linkedinSummary.engagements?.toLocaleString()} engagements (${linkedinSummary.period})` :
          'No summary data';
      
      case 'projects':
        const projects = data.projects || [];
        const activeProjects = projects.filter(p => p.status === 'In Progress').length;
        return `${projects.length} total projects, ${activeProjects} active`;
      
      case 'contacts':
        const contacts = data.contacts || [];
        const clients = contacts.filter(c => c.status === 'Client').length;
        return `${contacts.length} total contacts, ${clients} clients`;
      
      case 'team':
        const members = data.members || [];
        return `${members.length} team members`;
      
      default:
        return 'Data loaded';
    }
  };

  const openUpdateDialog = (dataType) => {
    setSelectedDataType(dataType);
    setUpdateData({});
    setUpdateDialog(true);
  };

  const handleUpdate = async () => {
    // In a real implementation, this would make an API call
    console.log('Updating', selectedDataType, 'with data:', updateData);
    
    // Simulate update
    setTimeout(() => {
      setUpdateDialog(false);
      loadAllData(); // Reload data
    }, 1000);
  };

  const DataFileCard = ({ dataType, data }) => {
    const freshness = getDataFreshness(data?.lastUpdated || data?.summaries?.[0]?.lastUpdated);
    
    return (
      <Card>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
            <Box>
              <Typography variant="h6" component="h3" gutterBottom>
                {dataTypes.find(dt => dt.key === dataType)?.icon} {dataTypes.find(dt => dt.key === dataType)?.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {formatDataSummary(dataType, data)}
              </Typography>
            </Box>
            <Box display="flex" alignItems="center" gap={1}>
              {getFreshnessIcon(freshness.status)}
              <Chip 
                label={freshness.message}
                color={freshness.color}
                size="small"
              />
            </Box>
          </Box>
          
          <Box display="flex" gap={1} mt={2}>
            <Button 
              size="small" 
              startIcon={<RefreshIcon />}
              onClick={() => openUpdateDialog(dataType)}
            >
              Update
            </Button>
            {dataType === 'email_analytics' && (
              <Button 
                size="small" 
                startIcon={<UploadIcon />}
                onClick={() => setShowImporter(true)}
                color="primary"
              >
                Import
              </Button>
            )}
            <Button 
              size="small" 
              startIcon={<HistoryIcon />}
              onClick={() => setExpandedSection(expandedSection === dataType ? false : dataType)}
            >
              History
            </Button>
            <Button 
              size="small" 
              startIcon={<DownloadIcon />}
              onClick={() => {
                const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${dataType}.json`;
                a.click();
              }}
            >
              Export
            </Button>
          </Box>
        </CardContent>
      </Card>
    );
  };

  const UpdateDialog = () => (
    <Dialog open={updateDialog} onClose={() => setUpdateDialog(false)} maxWidth="md" fullWidth>
      <DialogTitle>
        Update {dataTypes.find(dt => dt.key === selectedDataType)?.name}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          {selectedDataType === 'email_analytics' && (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Period (e.g., June 2025)"
                  value={updateData.period || ''}
                  onChange={(e) => setUpdateData({...updateData, period: e.target.value})}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Total Opens"
                  type="number"
                  value={updateData.opens || ''}
                  onChange={(e) => setUpdateData({...updateData, opens: parseInt(e.target.value) || 0})}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Total Clicks"
                  type="number"
                  value={updateData.clicks || ''}
                  onChange={(e) => setUpdateData({...updateData, clicks: parseInt(e.target.value) || 0})}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Open Rate (%)"
                  value={updateData.openRate || ''}
                  onChange={(e) => setUpdateData({...updateData, openRate: e.target.value})}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Click-Through Rate (%)"
                  value={updateData.clickThroughRate || ''}
                  onChange={(e) => setUpdateData({...updateData, clickThroughRate: e.target.value})}
                />
              </Grid>
            </Grid>
          )}
          
          {selectedDataType === 'website_analytics' && (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Period (e.g., June 2025)"
                  value={updateData.period || ''}
                  onChange={(e) => setUpdateData({...updateData, period: e.target.value})}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Total Visits"
                  type="number"
                  value={updateData.visits || ''}
                  onChange={(e) => setUpdateData({...updateData, visits: parseInt(e.target.value) || 0})}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Page Views"
                  type="number"
                  value={updateData.pageViews || ''}
                  onChange={(e) => setUpdateData({...updateData, pageViews: parseInt(e.target.value) || 0})}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Bounce Rate (%)"
                  value={updateData.bounceRate || ''}
                  onChange={(e) => setUpdateData({...updateData, bounceRate: e.target.value})}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Avg Session Duration"
                  value={updateData.avgSessionDuration || ''}
                  onChange={(e) => setUpdateData({...updateData, avgSessionDuration: e.target.value})}
                />
              </Grid>
            </Grid>
          )}
          
          {selectedDataType === 'projects' && (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Alert severity="info">
                  Project updates should be made through the Project Timeline page for better tracking.
                </Alert>
              </Grid>
            </Grid>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setUpdateDialog(false)} startIcon={<CancelIcon />}>
          Cancel
        </Button>
        <Button 
          onClick={handleUpdate} 
          variant="contained" 
          startIcon={<SaveIcon />}
          disabled={!updateData.period && selectedDataType.includes('analytics')}
        >
          Update Data
        </Button>
      </DialogActions>
    </Dialog>
  );

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Loading data management interface...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Data Management
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<RefreshIcon />}
          onClick={loadAllData}
        >
          Refresh All
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {lastUpdated && (
        <Card sx={{ mb: 3, bgcolor: 'primary.light', color: 'primary.contrastText' }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              System Status
            </Typography>
            <Typography variant="body1">
              Last system update: {new Date(lastUpdated.lastUpdated).toLocaleString()}
            </Typography>
            <Typography variant="body2">
              Version: {lastUpdated.version} • Updated by: {lastUpdated.lastUpdateBy}
            </Typography>
          </CardContent>
        </Card>
      )}

      <Grid container spacing={3} mb={3}>
        {dataTypes.map(dataType => (
          <Grid item xs={12} md={6} lg={4} key={dataType.key}>
            <DataFileCard 
              dataType={dataType.key} 
              data={dataFiles[dataType.key]} 
            />
          </Grid>
        ))}
      </Grid>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Quick Actions
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <Button 
                fullWidth 
                variant="outlined" 
                startIcon={<UploadIcon />}
                onClick={() => {
                  // Handle bulk data upload
                  const input = document.createElement('input');
                  input.type = 'file';
                  input.accept = '.json';
                  input.onchange = async (e) => {
                    const file = e.target.files[0];
                    if (file) {
                      try {
                        const result = await DataSync.importData(file);
                        alert(result.message);
                        loadAllData(); // Refresh the data display
                      } catch (error) {
                        alert(error.message);
                      }
                    }
                  };
                  input.click();
                }}
              >
                Bulk Upload
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Button 
                fullWidth 
                variant="outlined" 
                startIcon={<DownloadIcon />}
                onClick={() => {
                  // Handle full data export using DataSync
                  DataSync.exportAllData();
                }}
              >
                Export All
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Button 
                fullWidth 
                variant="outlined" 
                startIcon={<HistoryIcon />}
                onClick={() => {
                  // Navigate to historical data view
                  console.log('Historical data view');
                }}
              >
                View History
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Button 
                fullWidth 
                variant="outlined" 
                startIcon={<RefreshIcon />}
                onClick={() => {
                  // Trigger automated data sync
                  console.log('Automated sync triggered');
                }}
              >
                Auto Sync
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <UpdateDialog />

      {/* Email Data Importer Dialog */}
      <Dialog
        open={showImporter}
        onClose={() => setShowImporter(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>
          Import Email Analytics Data
          <IconButton
            onClick={() => setShowImporter(false)}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CancelIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <EmailDataImporter />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default DataManagement;