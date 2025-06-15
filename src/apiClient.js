// Static Data API Client for GitHub Pages
// This version uses local JSON files instead of real API calls

// Utility function to load data from static JSON files
export const loadStaticData = async (dataFile) => {
  try {
    const response = await fetch(`${process.env.PUBLIC_URL}/data/${dataFile}`);
    if (!response.ok) {
      console.warn(`Failed to load ${dataFile}, using fallback data`);
      return null;
    }
    return await response.json();
  } catch (error) {
    console.error(`Error loading static data from ${dataFile}:`, error);
    return null;
  }
};

// --- Task Request API Functions ---

export const getTaskRequests = async () => {
  const data = await loadStaticData('projects.json');
  return data?.projects || [];
};

export const createTaskRequest = async (requestData) => {
  console.log('In static mode, createTaskRequest is simulated', requestData);
  return { 
    id: Date.now(), 
    ...requestData, 
    status: 'New',
    created_at: new Date().toISOString()
  };
};

export const updateTaskRequestStatus = async (requestId, status) => {
  console.log(`In static mode, updateTaskRequestStatus for ID ${requestId} to ${status}`);
  return { id: requestId, status };
};

export const updateTaskRequest = async (requestId, updateData) => {
  console.log(`In static mode, updateTaskRequest for ID ${requestId}`, updateData);
  return { id: requestId, ...updateData };
};

export const getTaskRequestDetails = async (requestId) => {
  const data = await loadStaticData('projects.json');
  const project = (data?.projects || []).find(p => p.id === parseInt(requestId));
  return project || { id: requestId, error: 'Project not found' };
};

export const getTeamMembers = async () => {
  const data = await loadStaticData('team.json');
  return data?.members || [
    { id: 1, name: "Jane Doe", role: "Marketing Manager" },
    { id: 2, name: "John Smith", role: "Content Specialist" }
  ];
};

// --- Contact & Engagement API Functions ---

export const getContacts = async (status) => {
  const data = await loadStaticData('contacts.json');
  let contacts = data?.contacts || [];
  
  if (status) {
    contacts = contacts.filter(contact => contact.status === status);
  }
  
  return contacts;
};

export const getEngagementEvents = async (contactId) => {
  if (!contactId) {
    console.error("getEngagementEvents: contactId is required.");
    return []; 
  }

  const data = await loadStaticData('contacts.json');
  return data?.engagementEvents?.[contactId] || [];
};

// --- Analytics API Functions ---

export const getWebsiteAnalyticsSummary = async (params = {}) => {
  const data = await loadStaticData('website_analytics.json');
  return data?.summaries?.[0] || {
    period: "March 2025",
    visits: 5623,
    pageViews: 12478,
    avgSessionDuration: "2:45",
    bounceRate: "38.2%"
  };
};

export const getEmailAnalyticsSummary = async (params = {}) => {
  const data = await loadStaticData('email_analytics.json');
  return data?.summaries?.[0] || {
    period: "March 2025",
    opens: 1234,
    clicks: 567,
    clickThroughRate: "45.9%",
    openRate: "20.1%",
    customEngagement: 789
  };
};

export const getLinkedInAnalyticsSummary = async (params = {}) => {
  const data = await loadStaticData('linkedin_analytics.json');
  return data?.summaries?.[0] || {
    period: "March 2025",
    impressions: 3245,
    engagements: 567,
    followers: 1243,
    clickThroughRate: "2.8%"
  };
};

// Create a mock apiClient with common methods for backward compatibility
const apiClient = {
  get: async (url, config = {}) => {
    console.log(`Static apiClient.get called for: ${url}`);
    // Return mock response based on URL pattern
    if (url.includes('/api/requests')) {
      return { data: await getTaskRequests() };
    }
    if (url.includes('/api/contacts')) {
      return { data: await getContacts() };
    }
    if (url.includes('/api/analytics/website-summary')) {
      return { data: await getWebsiteAnalyticsSummary() };
    }
    if (url.includes('/api/analytics/email-summary')) {
      return { data: await getEmailAnalyticsSummary() };
    }
    if (url.includes('/api/analytics/linkedin-summary')) {
      return { data: await getLinkedInAnalyticsSummary() };
    }
    return { data: [] };
  },
  post: async (url, data) => {
    console.log(`Static apiClient.post called for: ${url}`, data);
    if (url.includes('/api/requests')) {
      return { data: await createTaskRequest(data) };
    }
    if (url.includes('/api/submit/email-summary')) {
      // For static deployment, save to localStorage as a workaround
      try {
        const existingSummaries = JSON.parse(localStorage.getItem('emailSummaries') || '[]');
        const newSummary = {
          id: Date.now(),
          ...data,
          created_at: new Date().toISOString()
        };
        existingSummaries.push(newSummary);
        localStorage.setItem('emailSummaries', JSON.stringify(existingSummaries));
        return { data: newSummary };
      } catch (error) {
        console.error('Error saving email summary:', error);
        throw error;
      }
    }
    return { data: { id: Date.now(), ...data } };
  },
  put: async (url, data) => {
    console.log(`Static apiClient.put called for: ${url}`, data);
    if (url.includes('/api/requests/')) {
      const id = url.split('/').pop();
      return { data: await updateTaskRequest(id, data) };
    }
    return { data: { id: Date.now(), ...data } };
  }
};

export default apiClient;
