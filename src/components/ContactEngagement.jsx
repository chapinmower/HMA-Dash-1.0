import React, { useState, useEffect } from 'react';
import {
  Card, CardContent, Typography, List, ListItem, ListItemText,
  CircularProgress, Alert, Box, Link as MuiLink, ListItemButton,
  Tabs, Tab, Button
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
    }
  ];

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setSelectedReportUrl(null); // Reset embedded report when switching tabs
  };

  // Handle viewing a report
  const handleViewReport = (reportUrl) => {
    setSelectedReportUrl(reportUrl);
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
    if (tabValue === 1) {
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
          <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
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
      {isLoadingContacts && <CircularProgress sx={{ display: 'block', margin: '20px auto' }} />}
      {errorContacts && <Alert severity="error" sx={{ mt: 2 }}>{errorContacts}</Alert>}

      {!isLoadingContacts && !errorContacts && (
        <Box sx={{ display: 'flex', mt: 2, gap: 2 }}>
          {/* Contact List Column */}
          <Box sx={{ width: '40%', maxHeight: '60vh', overflowY: 'auto', borderRight: '1px solid #ccc', pr: 1 }}>
            <Typography variant="h6">
              Contacts ({contacts.length})
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
          <Tab label="Engagement Reports" />
          <Tab label="Individual Engagement" />
        </Tabs>

        {tabValue === 0 && renderReportsTab()}
        {tabValue === 1 && renderIndividualTab()}
      </CardContent>
    </Card>
  );
};

export default ContactEngagement;
