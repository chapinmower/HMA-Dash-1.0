import React, { useState, useCallback } from 'react';
import { Box, Button, Typography, CircularProgress, Alert } from '@mui/material';
import { useDropzone } from 'react-dropzone';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import apiClient from '../apiClient'; // Import the API client

function EmailCsvUpload() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState({ success: false, error: null });

  const onDrop = useCallback((acceptedFiles) => {
    // Do something with the files
    if (acceptedFiles.length > 0) {
      setSelectedFile(acceptedFiles[0]);
      setUploadStatus({ success: false, error: null }); // Reset status on new file select
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
    },
    multiple: false,
  });

  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadStatus({ success: false, error: 'Please select a CSV file first.' });
      return;
    }

    setIsLoading(true);
    setUploadStatus({ success: false, error: null });

    const formData = new FormData();
    formData.append('emailCsv', selectedFile); // Use 'emailCsv' as the field name expected by Multer

    try {
      console.log('Attempting to upload file:', selectedFile.name);
      const response = await apiClient.post('/upload/email-csv', formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Important for file uploads
        },
      });
      console.log('Upload successful:', response.data);
      setUploadStatus({ success: true, error: null });
      setSelectedFile(null); // Clear selection on success
    } catch (error) {
      console.error('Upload failed:', error.response?.data || error.message);
      // Try to provide a more specific error message from the backend if available
      const errorMessage = error.response?.data?.details || error.response?.data?.error || 'Upload failed. Please check the file format and try again.';
      setUploadStatus({ success: false, error: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box>
      <Box
        {...getRootProps()}
        sx={{
          border: '2px dashed',
          borderColor: isDragActive ? 'primary.main' : 'grey.400',
          borderRadius: 1,
          p: 4,
          textAlign: 'center',
          cursor: 'pointer',
          backgroundColor: isDragActive ? 'action.hover' : 'transparent',
          mb: 2,
        }}
      >
        <input {...getInputProps()} />
        <UploadFileIcon sx={{ fontSize: 40, color: 'grey.600', mb: 1 }} />
        {isDragActive ? (
          <Typography>Drop the CSV file here ...</Typography>
        ) : (
          <Typography>Drag 'n' drop a CSV file here, or click to select file</Typography>
        )}
        {selectedFile && (
          <Typography variant="body2" sx={{ mt: 1, fontWeight: 'bold' }}>
            Selected: {selectedFile.name}
          </Typography>
        )}
      </Box>

      <Button
        variant="contained"
        onClick={handleUpload}
        disabled={!selectedFile || isLoading}
        startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : null}
      >
        {isLoading ? 'Uploading...' : 'Upload Email Data'}
      </Button>

      {uploadStatus.error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {uploadStatus.error}
        </Alert>
      )}
      {uploadStatus.success && (
        <Alert severity="success" sx={{ mt: 2 }}>
          File uploaded successfully!
        </Alert>
      )}
    </Box>
  );
}

export default EmailCsvUpload;
