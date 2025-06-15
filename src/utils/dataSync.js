// Data synchronization utilities for HMA Dashboard
// Handles data import/export and localStorage management

export const DataSync = {
  // Export all dashboard data to JSON file
  exportAllData: () => {
    const data = {
      exportDate: new Date().toISOString(),
      version: '1.0.0',
      emailAnalytics: JSON.parse(localStorage.getItem('emailAnalyticsData') || '{}'),
      emailCampaigns: JSON.parse(localStorage.getItem('emailCampaigns') || '[]'),
      emailSummaries: JSON.parse(localStorage.getItem('emailSummaries') || '[]'),
      websiteAnalytics: JSON.parse(localStorage.getItem('websiteAnalyticsData') || '{}'),
      linkedinAnalytics: JSON.parse(localStorage.getItem('linkedinAnalyticsData') || '{}'),
      projects: JSON.parse(localStorage.getItem('projectsData') || '[]'),
      contacts: JSON.parse(localStorage.getItem('contactsData') || '[]'),
      team: JSON.parse(localStorage.getItem('teamData') || '[]')
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hma_dashboard_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  },

  // Import data from JSON file
  importData: async (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          
          // Validate data structure
          if (!data.version || !data.exportDate) {
            throw new Error('Invalid backup file format');
          }

          // Import data to localStorage
          if (data.emailAnalytics) {
            localStorage.setItem('emailAnalyticsData', JSON.stringify(data.emailAnalytics));
          }
          if (data.emailCampaigns) {
            localStorage.setItem('emailCampaigns', JSON.stringify(data.emailCampaigns));
          }
          if (data.emailSummaries) {
            localStorage.setItem('emailSummaries', JSON.stringify(data.emailSummaries));
          }
          if (data.websiteAnalytics) {
            localStorage.setItem('websiteAnalyticsData', JSON.stringify(data.websiteAnalytics));
          }
          if (data.linkedinAnalytics) {
            localStorage.setItem('linkedinAnalyticsData', JSON.stringify(data.linkedinAnalytics));
          }
          if (data.projects) {
            localStorage.setItem('projectsData', JSON.stringify(data.projects));
          }
          if (data.contacts) {
            localStorage.setItem('contactsData', JSON.stringify(data.contacts));
          }
          if (data.team) {
            localStorage.setItem('teamData', JSON.stringify(data.team));
          }

          resolve({
            success: true,
            message: `Data imported successfully from backup created on ${new Date(data.exportDate).toLocaleDateString()}`
          });
        } catch (error) {
          reject(new Error(`Failed to import data: ${error.message}`));
        }
      };

      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };

      reader.readAsText(file);
    });
  },

  // Clear all localStorage data
  clearAllData: () => {
    const keys = [
      'emailAnalyticsData',
      'emailCampaigns', 
      'emailSummaries',
      'websiteAnalyticsData',
      'linkedinAnalyticsData',
      'projectsData',
      'contactsData',
      'teamData'
    ];

    keys.forEach(key => localStorage.removeItem(key));
  },

  // Get data summary
  getDataSummary: () => {
    return {
      emailCampaigns: JSON.parse(localStorage.getItem('emailCampaigns') || '[]').length,
      emailSummaries: JSON.parse(localStorage.getItem('emailSummaries') || '[]').length,
      projects: JSON.parse(localStorage.getItem('projectsData') || '[]').length,
      contacts: JSON.parse(localStorage.getItem('contactsData') || '[]').length,
      totalSize: new Blob([JSON.stringify(localStorage)]).size
    };
  },

  // Merge new data with existing data
  mergeEmailData: (newData) => {
    const existing = JSON.parse(localStorage.getItem('emailCampaigns') || '[]');
    
    // Check for duplicates based on campaign name and date
    const merged = [...existing];
    
    newData.forEach(item => {
      const isDuplicate = existing.some(e => 
        e.campaign_name === item.campaign_name && 
        e.date === item.date
      );
      
      if (!isDuplicate) {
        merged.push({
          ...item,
          id: Date.now() + Math.random(),
          imported_at: new Date().toISOString()
        });
      }
    });

    localStorage.setItem('emailCampaigns', JSON.stringify(merged));
    return merged.length - existing.length; // Return number of new items added
  }
};