import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Grid,
  Typography,
  Alert,
  Paper,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  Chip,
  LinearProgress
} from '@mui/material';
import {
  CloudUpload as UploadIcon,
  CheckCircle as CheckIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  FileUpload as FileUploadIcon
} from '@mui/icons-material';

const EmailDataImporter = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [fileData, setFileData] = useState(null);
  const [parsedData, setParsedData] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errors, setErrors] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');

  const steps = [
    'Upload Email Data File',
    'Review & Edit Data',
    'Import to Dashboard'
  ];

  // Handle file upload
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setErrors([]);
    setUploadProgress(0);

    // Check file type
    if (!file.name.endsWith('.csv') && !file.name.endsWith('.xlsx')) {
      setErrors(['Please upload a CSV or Excel file']);
      return;
    }

    try {
      // Read file content
      const reader = new FileReader();
      reader.onprogress = (e) => {
        if (e.lengthComputable) {
          setUploadProgress((e.loaded / e.total) * 100);
        }
      };

      reader.onload = async (e) => {
        const content = e.target.result;
        setFileData({
          name: file.name,
          size: file.size,
          type: file.type,
          content: content
        });

        // Parse CSV data (simplified version)
        if (file.name.endsWith('.csv')) {
          const parsed = parseCSV(content);
          setParsedData(parsed);
          setActiveStep(1);
        } else {
          setErrors(['Excel file parsing not yet implemented. Please use CSV format.']);
        }
      };

      reader.readAsText(file);
    } catch (error) {
      setErrors([`Error reading file: ${error.message}`]);
    }
  };

  // Parse CSV content
  const parseCSV = (content) => {
    const lines = content.split('\n').filter(line => line.trim());
    if (lines.length < 2) return [];

    const headers = lines[0].split(',').map(h => h.trim());
    const data = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim());
      const row = {};
      
      headers.forEach((header, index) => {
        row[header] = values[index] || '';
      });

      // Map common email fields
      data.push({
        campaign_name: row['Campaign'] || row['Campaign Name'] || '',
        date: row['Date'] || row['Send Date'] || '',
        recipients: parseInt(row['Recipients'] || row['Sent'] || '0'),
        opens: parseInt(row['Opens'] || row['Unique Opens'] || '0'),
        clicks: parseInt(row['Clicks'] || row['Unique Clicks'] || '0'),
        open_rate: parseFloat(row['Open Rate'] || row['Open %'] || '0'),
        click_rate: parseFloat(row['Click Rate'] || row['Click %'] || '0'),
        bounces: parseInt(row['Bounces'] || '0'),
        unsubscribes: parseInt(row['Unsubscribes'] || '0')
      });
    }

    return data;
  };

  // Handle data edit
  const handleDataEdit = (index, field, value) => {
    const updated = [...parsedData];
    updated[index][field] = value;
    setParsedData(updated);
  };

  // Handle data removal
  const handleDataRemove = (index) => {
    const updated = parsedData.filter((_, i) => i !== index);
    setParsedData(updated);
  };

  // Import data to dashboard
  const handleImport = async () => {
    setErrors([]);
    setSuccessMessage('');

    try {
      // Calculate summary statistics
      const summary = {
        period: `${new Date().toLocaleDateString('default', { month: 'long', year: 'numeric' })}`,
        totalCampaigns: parsedData.length,
        totalRecipients: parsedData.reduce((sum, d) => sum + (d.recipients || 0), 0),
        totalOpens: parsedData.reduce((sum, d) => sum + (d.opens || 0), 0),
        totalClicks: parsedData.reduce((sum, d) => sum + (d.clicks || 0), 0),
        avgOpenRate: parsedData.reduce((sum, d) => sum + (d.open_rate || 0), 0) / parsedData.length,
        avgClickRate: parsedData.reduce((sum, d) => sum + (d.click_rate || 0), 0) / parsedData.length,
        campaigns: parsedData
      };

      // Save to localStorage (for static deployment)
      const existingData = JSON.parse(localStorage.getItem('emailAnalyticsData') || '{}');
      existingData[summary.period] = summary;
      localStorage.setItem('emailAnalyticsData', JSON.stringify(existingData));

      // Also save individual campaigns
      const campaigns = JSON.parse(localStorage.getItem('emailCampaigns') || '[]');
      parsedData.forEach(campaign => {
        campaigns.push({
          ...campaign,
          id: Date.now() + Math.random(),
          imported_at: new Date().toISOString()
        });
      });
      localStorage.setItem('emailCampaigns', JSON.stringify(campaigns));

      setSuccessMessage(`Successfully imported ${parsedData.length} email campaigns`);
      setActiveStep(2);

      // Reset after delay
      setTimeout(() => {
        setActiveStep(0);
        setFileData(null);
        setParsedData([]);
        setSuccessMessage('');
      }, 3000);
    } catch (error) {
      setErrors([`Import failed: ${error.message}`]);
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Email Analytics Data Importer
      </Typography>
      
      <Stepper activeStep={activeStep} orientation="vertical" sx={{ mt: 3 }}>
        <Step>
          <StepLabel>Upload Email Data File</StepLabel>
          <StepContent>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" gutterBottom>
                Upload a CSV or Excel file containing your email campaign data.
                The file should include columns for Campaign Name, Date, Recipients, Opens, Clicks, etc.
              </Typography>
              
              <Button
                variant="contained"
                component="label"
                startIcon={<FileUploadIcon />}
                sx={{ mt: 2 }}
              >
                Choose File
                <input
                  type="file"
                  hidden
                  accept=".csv,.xlsx"
                  onChange={handleFileUpload}
                />
              </Button>

              {uploadProgress > 0 && uploadProgress < 100 && (
                <Box sx={{ mt: 2 }}>
                  <LinearProgress variant="determinate" value={uploadProgress} />
                </Box>
              )}

              {fileData && (
                <Card sx={{ mt: 2 }}>
                  <CardContent>
                    <Typography variant="subtitle2">File: {fileData.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Size: {(fileData.size / 1024).toFixed(2)} KB
                    </Typography>
                  </CardContent>
                </Card>
              )}
            </Box>
          </StepContent>
        </Step>

        <Step>
          <StepLabel>Review & Edit Data</StepLabel>
          <StepContent>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" gutterBottom>
                Review the parsed data below. You can edit values or remove rows before importing.
              </Typography>

              <TableContainer component={Paper} sx={{ mt: 2, maxHeight: 400 }}>
                <Table stickyHeader size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Campaign</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell align="right">Recipients</TableCell>
                      <TableCell align="right">Opens</TableCell>
                      <TableCell align="right">Clicks</TableCell>
                      <TableCell align="right">Open Rate %</TableCell>
                      <TableCell align="right">Click Rate %</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {parsedData.map((row, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <TextField
                            size="small"
                            value={row.campaign_name}
                            onChange={(e) => handleDataEdit(index, 'campaign_name', e.target.value)}
                            variant="standard"
                          />
                        </TableCell>
                        <TableCell>{row.date}</TableCell>
                        <TableCell align="right">{row.recipients}</TableCell>
                        <TableCell align="right">{row.opens}</TableCell>
                        <TableCell align="right">{row.clicks}</TableCell>
                        <TableCell align="right">{row.open_rate.toFixed(1)}%</TableCell>
                        <TableCell align="right">{row.click_rate.toFixed(1)}%</TableCell>
                        <TableCell>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleDataRemove(index)}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              <Box sx={{ mt: 2 }}>
                <Button onClick={() => setActiveStep(0)} sx={{ mr: 1 }}>
                  Back
                </Button>
                <Button
                  variant="contained"
                  onClick={handleImport}
                  disabled={parsedData.length === 0}
                >
                  Import {parsedData.length} Campaigns
                </Button>
              </Box>
            </Box>
          </StepContent>
        </Step>

        <Step>
          <StepLabel>Import to Dashboard</StepLabel>
          <StepContent>
            <Box sx={{ mb: 2 }}>
              {successMessage && (
                <Alert severity="success" icon={<CheckIcon />}>
                  {successMessage}
                </Alert>
              )}
            </Box>
          </StepContent>
        </Step>
      </Stepper>

      {errors.length > 0 && (
        <Alert severity="error" sx={{ mt: 2 }}>
          <ul style={{ margin: 0, paddingLeft: 20 }}>
            {errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </Alert>
      )}
    </Paper>
  );
};

export default EmailDataImporter;