import React, { useState, useEffect } from 'react';
import {
  Card, CardContent, Typography, List, ListItem, ListItemText,
  CircularProgress, Alert, Box, Link as MuiLink, ListItemButton,
  Tabs, Tab, Button, Grid, Paper
} from '@mui/material'; 
import { getContacts, getEngagementEvents } from '../apiClient'; // Import API functions

const ContactEngagement = () => {
  const [tabValue, setTabValue] = useState(0);
  const [selectedReportUrl, setSelectedReportUrl] = useState(null);
  const [contacts, setContacts] = useState([]); 
  const [selectedContact, setSelectedContact] = useState(null);
  const [selectedContactEvents, setSelectedContactEvents] = useState([]);
  const [isLoadingContacts, setIsLoadingContacts] = useState(false);
  const [isLoadingEvents, setIsLoadingEvents] = useState(false);
  const [errorContacts, setErrorContacts] = useState(null);
  const [errorEvents, setErrorEvents] = useState(null);
  const [showFullEngagementReport, setShowFullEngagementReport] = useState(false);

  // Available reports
  const contactReports = [
    {
      id: 'complete',
      name: 'Complete Contact Report (April 2025)',
      url: `${process.env.PUBLIC_URL}/reports/contact_engagement_april_2025/april25complete-contact-report.html`
    },
    {
      id: 'unengaged',
      name: 'Unengaged Contacts Report (April 2025)',
      url: `${process.env.PUBLIC_URL}/reports/contact_engagement_april_2025/April25unengaged-contacts-report.html`
    },
    {
      id: 'engagement',
      name: 'Contact Engagement Report (May 2025)',
      url: `/contact-engagement-report.html`
    }
  ];

  // Engagement stats for summary cards
  const engagementStats = [
    { label: "Total Unique Contacts", value: "1,152", description: "Received at least one email" },
    { label: "Active Engagers", value: "705", description: "61.2% opened or clicked emails" },
    { label: "High Clickers", value: "108", description: "9.4% clicked on emails" },
    { label: "Multi-Campaign Engagers", value: "66", description: "5.7% engaged with multiple campaigns" }
  ];

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setSelectedReportUrl(null); // Reset embedded report when switching tabs
    setShowFullEngagementReport(false); // Reset full report view
  };

  // Handle viewing a report
  const handleViewReport = (reportUrl) => {
    setSelectedReportUrl(reportUrl);
  };

  // Handle viewing the full engagement report
  const handleViewFullEngagementReport = () => {
    setShowFullEngagementReport(true);
  };

  const handleContactClick = async (contact) => {
    if (selectedContact?.id === contact.id) {
      // Deselect if clicking the same contact again
      setSelectedContact(null);
      setSelectedContactEvents([]);
      setErrorEvents(null);
    } else {
      setSelectedContact(contact);
      setSelectedContactEvents([]); // Clear previous events
      setErrorEvents(null);
      setIsLoadingEvents(true);
      try {
        const events = await getEngagementEvents(contact.id);
        setSelectedContactEvents(events);
      } catch (err) {
        console.error("Error fetching engagement events:", err);
        setErrorEvents(err.message || 'Failed to fetch engagement events.');
      } finally {
        setIsLoadingEvents(false);
      }
    }
  };

  // Fetch contacts
  useEffect(() => {
    const fetchContacts = async () => {
      setIsLoadingContacts(true);
      setErrorContacts(null);
      setSelectedContact(null);
      setSelectedContactEvents([]);

      try {
        const data = await getContacts();
        setContacts(data);
      } catch (err) {
        console.error('Error fetching contacts:', err);
        setErrorContacts(err.message || 'Failed to fetch contacts.');
      } finally {
        setIsLoadingContacts(false);
      }
    };

    // Only fetch contacts when on the Individual tab
    if (tabValue === 2) {
      fetchContacts();
    }
  }, [tabValue]);

  // Helper to format timestamp
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'N/A';
    try {
      return new Date(timestamp).toLocaleString();
    } catch (e) {
      return timestamp;
    }
  };

  const renderContactList = (contacts) => (
    <List dense>
      {contacts.length > 0 ? (
        contacts.map((contact) => (
          <ListItemButton
            key={contact.id}
            onClick={() => handleContactClick(contact)}
            selected={selectedContact?.id === contact.id}
            sx={{ borderBottom: '1px solid #eee' }}
          >
            <ListItemText
              primary={contact.name}
              secondary={contact.email || 'No email'}
            />
          </ListItemButton>
        ))
      ) : (
        <ListItem>
          <ListItemText primary="No contacts to display" />
        </ListItem>
      )}
    </List>
  );

  const renderEventDetails = () => (
    <Box sx={{ mt: 2, p: 2, border: '1px solid #ccc', borderRadius: 1 }}>
      <Typography variant="h6" gutterBottom>
        Engagement History for {selectedContact?.name}
      </Typography>
      {isLoadingEvents && <CircularProgress size={24} sx={{ display: 'block', margin: 'auto' }} />}
      {errorEvents && <Alert severity="error">{errorEvents}</Alert>}
      {!isLoadingEvents && !errorEvents && (
        selectedContactEvents.length > 0 ? (
          <List dense>
            {selectedContactEvents.map((event) => (
              <ListItem key={event.id} sx={{ borderBottom: '1px dashed #eee', alignItems: 'flex-start' }}>
                <ListItemText
                  primary={`${event.type || 'Engagement'} - ${formatTimestamp(event.date)}`}
                  secondary={
                    <>
                      <Typography component="span" variant="body2" color="text.primary">
                        Details: {event.details || 'N/A'}
                      </Typography>
                    </>
                  }
                />
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography>No engagement events found for this contact.</Typography>
        )
      )}
    </Box>
  );

  // Render summary tab
  const renderSummaryTab = () => (
    <Box sx={{ mt: 2 }}>
      {showFullEngagementReport ? (
        // Embedded full report view
        <Box sx={{ mb: 2 }}>
          <Button 
            variant="outlined" 
            size="small" 
            onClick={() => setShowFullEngagementReport(false)}
            sx={{ mb: 1 }}
          >
            ← Back to Summary
          </Button>
          <Box sx={{ border: '1px solid #ddd', height: 'calc(100vh - 250px)', borderRadius: 1, overflow: 'hidden' }}>
            <iframe
              src="/contact-engagement-report.html"
              title="Contact Engagement Report"
              width="100%"
              height="100%"
              style={{ border: 'none' }}
            />
          </Box>
        </Box>
      ) : (
        // Summary view
        <>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            {engagementStats.map((stat, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Paper 
                  elevation={1} 
                  sx={{ 
                    p: 2, 
                    textAlign: 'center',
                    backgroundColor: '#e8f2ed',
                    borderTop: '4px solid #105938',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center'
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    {stat.label}
                  </Typography>
                  <Typography variant="h3" sx={{ my: 1, color: '#105938', fontWeight: 'bold' }}>
                    {stat.value}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {stat.description}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>

          <Typography variant="h6" gutterBottom>
            Top Engaged Contacts
          </Typography>
          
          <Box sx={{ mb: 3, overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#e8f2ed' }}>
                  <th style={{ padding: '10px', textAlign: 'left', color: '#105938', borderBottom: '1px solid #ddd' }}>Name</th>
                  <th style={{ padding: '10px', textAlign: 'left', color: '#105938', borderBottom: '1px solid #ddd' }}>Email</th>
                  <th style={{ padding: '10px', textAlign: 'left', color: '#105938', borderBottom: '1px solid #ddd' }}>Opens</th>
                  <th style={{ padding: '10px', textAlign: 'left', color: '#105938', borderBottom: '1px solid #ddd' }}>Clicks</th>
                  <th style={{ padding: '10px', textAlign: 'left', color: '#105938', borderBottom: '1px solid #ddd' }}>Most Engaged Campaign</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid #ddd' }}>
                  <td style={{ padding: '10px' }}>Brian Casper</td>
                  <td style={{ padding: '10px' }}>brian.casper@bluecg.com</td>
                  <td style={{ padding: '10px' }}>14</td>
                  <td style={{ padding: '10px' }}>9</td>
                  <td style={{ padding: '10px' }}>RSVP: June 18 Double Header</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #ddd' }}>
                  <td style={{ padding: '10px' }}>Andrew Rosenheim</td>
                  <td style={{ padding: '10px' }}>akr_only@hotmail.com</td>
                  <td style={{ padding: '10px' }}>12</td>
                  <td style={{ padding: '10px' }}>7</td>
                  <td style={{ padding: '10px' }}>RSVP: June 18 Double Header</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #ddd' }}>
                  <td style={{ padding: '10px' }}>Michelle Schultz</td>
                  <td style={{ padding: '10px' }}>mmschultz8@gmail.com</td>
                  <td style={{ padding: '10px' }}>10</td>
                  <td style={{ padding: '10px' }}>6</td>
                  <td style={{ padding: '10px' }}>April Newsletter</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #ddd' }}>
                  <td style={{ padding: '10px' }}>Tom Smith</td>
                  <td style={{ padding: '10px' }}>t.smith@compass.com</td>
                  <td style={{ padding: '10px' }}>8</td>
                  <td style={{ padding: '10px' }}>5</td>
                  <td style={{ padding: '10px' }}>RSVP: June 18 Double Header</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #ddd' }}>
                  <td style={{ padding: '10px' }}>Rita Johnson</td>
                  <td style={{ padding: '10px' }}>johnson1949@sbcglobal.net</td>
                  <td style={{ padding: '10px' }}>13</td>
                  <td style={{ padding: '10px' }}>5</td>
                  <td style={{ padding: '10px' }}>Re: RSVP: June 18 Double Header</td>
                </tr>
              </tbody>
            </table>
          </Box>

          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={handleViewFullEngagementReport}
              sx={{ px: 4 }}
            >
              View Full Contact Engagement Report
            </Button>
          </Box>
        </>
      )}
    </Box>
  );

  // Render reports tab
  const renderReportsTab = () => (
    <Box sx={{ mt: 2 }}>
      {selectedReportUrl ? (
        // Embedded report view
        <Box sx={{ mb: 2 }}>
          <Button 
            variant="outlined" 
            size="small" 
            onClick={() => setSelectedReportUrl(null)}
            sx={{ mb: 1 }}
          >
            ← Back to Reports List
          </Button>
          <Box sx={{ border: '1px solid #ddd', height: 'calc(100vh - 250px)', borderRadius: 1, overflow: 'hidden' }}>
            <iframe
              src={selectedReportUrl}
              title="Contact Engagement Report"
              width="100%"
              height="100%"
              style={{ border: 'none' }}
            />
          </Box>
        </Box>
      ) : (
        // Reports list
        <List>
          {contactReports.map((report) => (
            <ListItemButton
              key={report.id}
              onClick={() => handleViewReport(report.url)}
              sx={{ 
                border: '1px solid #e0e0e0', 
                borderRadius: 1,
                mb: 1,
                '&:hover': {
                  backgroundColor: '#f5f5f5',
                }
              }}
            >
              <ListItemText 
                primary={report.name}
                secondary="Click to view the full interactive report"
              />
            </ListItemButton>
          ))}
          <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
            Note: These reports provide a comprehensive view of contact engagement across all email campaigns.
            Click on any report to view it in the embedded viewer, or use the direct links below to open in a new tab.
          </Typography>
          
          <Alert severity="info" sx={{ mt: 2, mb: 2 }}>
            <strong>Download Feature (Coming Soon)</strong> - PDF and Excel downloads will be available when backend functionality is implemented.
            Currently, reports can only be viewed in-browser.
          </Alert>
          
          <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            {contactReports.map((report) => (
              <Button
                key={`external-${report.id}`}
                variant="outlined"
                size="small"
                component="a"
                href={report.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                Open {report.name} in New Tab
              </Button>
            ))}
          </Box>
        </List>
      )}
    </Box>
  );

  // Render individual engagement view
  const renderIndividualTab = () => (
    <Box sx={{ mt: 2 }}>
      <Alert severity="info" sx={{ mb: 3 }}>
        <strong>Individual Engagement Tracking (Coming Soon)</strong> - This feature requires backend integration to load real contact data and engagement history. 
        Currently showing static demo data for UI demonstration purposes.
      </Alert>

      {isLoadingContacts && <CircularProgress sx={{ display: 'block', margin: '20px auto' }} />}
      {errorContacts && <Alert severity="error" sx={{ mt: 2 }}>{errorContacts}</Alert>}

      {!isLoadingContacts && !errorContacts && (
        <Box sx={{ display: 'flex', mt: 2, gap: 2 }}>
          {/* Contact List Column */}
          <Box sx={{ width: '40%', maxHeight: '60vh', overflowY: 'auto', borderRight: '1px solid #ccc', pr: 1 }}>
            <Typography variant="h6">
              Contacts (Sample Data)
            </Typography>
            {renderContactList(contacts)}
          </Box>

          {/* Event Details Column */}
          <Box sx={{ width: '60%' }}>
            {selectedContact ? (
              renderEventDetails()
            ) : (
              <Typography sx={{ mt: 2, color: 'text.secondary' }}>
                Select a contact from the list to view their engagement history.
              </Typography>
            )}
          </Box>
        </Box>
      )}
    </Box>
  );

  return (
    <Card sx={{ mt: 3 }}>
      <CardContent>
        <Typography variant="h5" component="div" gutterBottom>
          Contact Engagement
        </Typography>

        <Tabs 
          value={tabValue} 
          onChange={handleTabChange}
          sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}
        >
          <Tab label="Summary" />
          <Tab label="Engagement Reports" />
          <Tab label="Individual Engagement" />
        </Tabs>

        {tabValue === 0 && renderSummaryTab()}
        {tabValue === 1 && renderReportsTab()}
        {tabValue === 2 && renderIndividualTab()}
      </CardContent>
    </Card>
  );
};

export default ContactEngagement;
