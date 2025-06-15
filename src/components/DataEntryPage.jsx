import React, { useState, useRef } from 'react'; // Import useState and useRef
import { Box, Typography, Paper, Divider } from '@mui/material';
// import EmailCsvUpload from './EmailCsvUpload'; // Remove old import
import EmailSummaryEntryForm from './EmailSummaryEntryForm'; // Import the new form
import EmailSummaryManager from './EmailSummaryManager'; // Import the manager component
import WebsiteAnalyticsEntryForm from './WebsiteAnalyticsEntryForm'; // Keep this component

function DataEntryPage() {
  // State to hold the summary being edited
  const [editingSummary, setEditingSummary] = useState(null);
  // Ref to potentially force re-render or pass methods to child, though passing state might be cleaner
  const emailFormRef = useRef(); // We might not need this if we pass editingSummary as prop

  // Function to be called by Manager when Edit is clicked
  const handleEditSummary = (summary) => {
      console.log("Editing summary:", summary);
      // TODO: Need a way to pass this data to EmailSummaryEntryForm
      // Option 1: Pass editingSummary down as prop and have form handle it
      setEditingSummary(summary);
      // Option 2: Use ref (more complex, less preferred usually)
      // emailFormRef.current?.loadDataForEdit(summary);

      // Scroll to the form?
      // window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Data Entry
      </Typography>
      <Typography variant="subtitle1" gutterBottom sx={{ mb: 3 }}>
        Upload email campaign data or manually enter website analytics summaries.
      </Typography>

      {/* Section for Email Summary Entry */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" component="h2" gutterBottom>
          Enter Email Campaign Summary
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Manually enter the summary statistics for a specific email campaign and period.
        </Typography>
        {/* Pass editingSummary and a function to clear it once editing is done/cancelled */}
        <EmailSummaryEntryForm initialData={editingSummary} onEditComplete={() => setEditingSummary(null)} />

        {/* Add the manager component below the form */}
        <Divider sx={{ my: 4 }} />
        <EmailSummaryManager onEdit={handleEditSummary} />
      </Paper>

      <Divider sx={{ my: 4 }} />

      {/* Section for Website Analytics Manual Entry */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" component="h2" gutterBottom>
          Enter Website Analytics Summary
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Manually enter the key summary metrics from your Google Analytics PDF report for a specific date range.
        </Typography>
        <WebsiteAnalyticsEntryForm />
      </Paper>
    </Box>
  );
}

export default DataEntryPage;
