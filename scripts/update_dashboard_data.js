#!/usr/bin/env node

/**
 * HMA Dashboard Data Update System
 * 
 * This script provides a comprehensive system for updating dashboard data
 * while preserving historical information and maintaining data integrity.
 */

const fs = require('fs').promises;
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'public', 'data');
const HISTORICAL_DIR = path.join(DATA_DIR, 'historical');
const BACKUP_DIR = path.join(DATA_DIR, 'backups');

// Ensure directories exist
async function ensureDirectories() {
  for (const dir of [DATA_DIR, HISTORICAL_DIR, BACKUP_DIR]) {
    try {
      await fs.access(dir);
    } catch {
      await fs.mkdir(dir, { recursive: true });
      console.log(`Created directory: ${dir}`);
    }
  }
}

// Backup current data before updates
async function backupCurrentData() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupDir = path.join(BACKUP_DIR, timestamp);
  
  await fs.mkdir(backupDir, { recursive: true });
  
  const files = await fs.readdir(DATA_DIR);
  const jsonFiles = files.filter(file => file.endsWith('.json'));
  
  for (const file of jsonFiles) {
    const sourcePath = path.join(DATA_DIR, file);
    const backupPath = path.join(backupDir, file);
    
    try {
      const data = await fs.readFile(sourcePath, 'utf8');
      await fs.writeFile(backupPath, data);
    } catch (error) {
      console.warn(`Could not backup ${file}:`, error.message);
    }
  }
  
  console.log(`✅ Backup created: ${backupDir}`);
  return backupDir;
}

// Archive old data to historical records
async function archiveToHistorical(dataType, currentData) {
  const historicalPath = path.join(HISTORICAL_DIR, `${dataType}_historical.json`);
  
  let historical = [];
  try {
    const existingData = await fs.readFile(historicalPath, 'utf8');
    historical = JSON.parse(existingData);
  } catch (error) {
    // File doesn't exist, start fresh
    console.log(`Creating new historical file for ${dataType}`);
  }
  
  // Add current period to historical data
  if (currentData && currentData.period) {
    const existingEntry = historical.find(entry => entry.period === currentData.period);
    if (existingEntry) {
      // Update existing entry
      Object.assign(existingEntry, currentData);
    } else {
      // Add new entry
      historical.push({
        ...currentData,
        archivedAt: new Date().toISOString()
      });
    }
    
    // Sort by period (most recent first)
    historical.sort((a, b) => new Date(b.period) - new Date(a.period));
    
    // Keep only last 24 months of data
    historical = historical.slice(0, 24);
    
    await fs.writeFile(historicalPath, JSON.stringify(historical, null, 2));
    console.log(`📊 Updated historical data for ${dataType}`);
  }
}

// Update email analytics with new data
async function updateEmailAnalytics(newData) {
  const filePath = path.join(DATA_DIR, 'email_analytics.json');
  
  let current = {
    summaries: [],
    campaigns: []
  };
  
  try {
    const existingData = await fs.readFile(filePath, 'utf8');
    current = JSON.parse(existingData);
  } catch (error) {
    console.log('Creating new email analytics file');
  }
  
  // Archive previous month's data
  if (current.summaries.length > 0) {
    await archiveToHistorical('email', current.summaries[0]);
  }
  
  // Add new data
  if (newData.summary) {
    current.summaries.unshift({
      ...newData.summary,
      lastUpdated: new Date().toISOString()
    });
    
    // Keep only current and previous month
    current.summaries = current.summaries.slice(0, 2);
  }
  
  if (newData.campaigns) {
    current.campaigns = newData.campaigns;
  }
  
  await fs.writeFile(filePath, JSON.stringify(current, null, 2));
  console.log('📧 Updated email analytics');
}

// Update website analytics with new data
async function updateWebsiteAnalytics(newData) {
  const filePath = path.join(DATA_DIR, 'website_analytics.json');
  
  let current = {
    summaries: [],
    topPages: [],
    reports: []
  };
  
  try {
    const existingData = await fs.readFile(filePath, 'utf8');
    current = JSON.parse(existingData);
  } catch (error) {
    console.log('Creating new website analytics file');
  }
  
  // Archive previous month's data
  if (current.summaries.length > 0) {
    await archiveToHistorical('website', current.summaries[0]);
  }
  
  // Add new data
  if (newData.summary) {
    current.summaries.unshift({
      ...newData.summary,
      lastUpdated: new Date().toISOString()
    });
    
    // Keep only current and previous month
    current.summaries = current.summaries.slice(0, 2);
  }
  
  if (newData.topPages) {
    current.topPages = newData.topPages;
  }
  
  if (newData.reports) {
    current.reports = newData.reports;
  }
  
  await fs.writeFile(filePath, JSON.stringify(current, null, 2));
  console.log('🌐 Updated website analytics');
}

// Update LinkedIn analytics with new data
async function updateLinkedInAnalytics(newData) {
  const filePath = path.join(DATA_DIR, 'linkedin_analytics.json');
  
  let current = {
    summaries: [],
    posts: []
  };
  
  try {
    const existingData = await fs.readFile(filePath, 'utf8');
    current = JSON.parse(existingData);
  } catch (error) {
    console.log('Creating new LinkedIn analytics file');
  }
  
  // Archive previous month's data
  if (current.summaries.length > 0) {
    await archiveToHistorical('linkedin', current.summaries[0]);
  }
  
  // Add new data
  if (newData.summary) {
    current.summaries.unshift({
      ...newData.summary,
      lastUpdated: new Date().toISOString()
    });
    
    // Keep only current and previous month
    current.summaries = current.summaries.slice(0, 2);
  }
  
  if (newData.posts) {
    current.posts = newData.posts;
  }
  
  await fs.writeFile(filePath, JSON.stringify(current, null, 2));
  console.log('💼 Updated LinkedIn analytics');
}

// Update project timelines and status
async function updateProjects(projectUpdates) {
  const filePath = path.join(DATA_DIR, 'projects.json');
  
  let current = { projects: [] };
  
  try {
    const existingData = await fs.readFile(filePath, 'utf8');
    current = JSON.parse(existingData);
  } catch (error) {
    console.log('Creating new projects file');
  }
  
  if (projectUpdates && Array.isArray(projectUpdates)) {
    for (const update of projectUpdates) {
      const existingProject = current.projects.find(p => p.id === update.id);
      
      if (existingProject) {
        // Update existing project
        Object.assign(existingProject, update, {
          lastUpdated: new Date().toISOString()
        });
      } else if (update.id) {
        // Add new project
        current.projects.push({
          ...update,
          createdAt: new Date().toISOString(),
          lastUpdated: new Date().toISOString()
        });
      }
    }
  }
  
  await fs.writeFile(filePath, JSON.stringify(current, null, 2));
  console.log('📋 Updated project data');
}

// Update last updated timestamp
async function updateLastUpdatedTimestamp() {
  const filePath = path.join(DATA_DIR, 'last_updated.json');
  
  const timestamp = {
    lastUpdated: new Date().toISOString(),
    lastUpdateBy: 'automated-update-system',
    version: '2.0.0'
  };
  
  await fs.writeFile(filePath, JSON.stringify(timestamp, null, 2));
  console.log('⏰ Updated timestamp');
}

// Generate trend data from historical information
async function generateTrendData() {
  const trends = {
    email: [],
    website: [],
    linkedin: [],
    generatedAt: new Date().toISOString()
  };
  
  // Process email trends
  try {
    const emailHistorical = await fs.readFile(
      path.join(HISTORICAL_DIR, 'email_historical.json'), 
      'utf8'
    );
    const emailData = JSON.parse(emailHistorical);
    
    trends.email = emailData.map(entry => ({
      period: entry.period,
      opens: entry.opens || 0,
      clicks: entry.clicks || 0,
      openRate: parseFloat(entry.openRate?.replace('%', '') || 0),
      clickThroughRate: parseFloat(entry.clickThroughRate?.replace('%', '') || 0)
    })).slice(0, 12); // Last 12 months
  } catch (error) {
    console.log('No email historical data found');
  }
  
  // Process website trends
  try {
    const websiteHistorical = await fs.readFile(
      path.join(HISTORICAL_DIR, 'website_historical.json'), 
      'utf8'
    );
    const websiteData = JSON.parse(websiteHistorical);
    
    trends.website = websiteData.map(entry => ({
      period: entry.period,
      visits: entry.visits || 0,
      pageViews: entry.pageViews || 0,
      bounceRate: parseFloat(entry.bounceRate?.replace('%', '') || 0),
      avgSessionDuration: entry.avgSessionDuration || '0:00'
    })).slice(0, 12); // Last 12 months
  } catch (error) {
    console.log('No website historical data found');
  }
  
  // Process LinkedIn trends
  try {
    const linkedinHistorical = await fs.readFile(
      path.join(HISTORICAL_DIR, 'linkedin_historical.json'), 
      'utf8'
    );
    const linkedinData = JSON.parse(linkedinHistorical);
    
    trends.linkedin = linkedinData.map(entry => ({
      period: entry.period,
      impressions: entry.impressions || 0,
      engagements: entry.engagements || 0,
      followers: entry.followers || 0,
      clickThroughRate: parseFloat(entry.clickThroughRate?.replace('%', '') || 0)
    })).slice(0, 12); // Last 12 months
  } catch (error) {
    console.log('No LinkedIn historical data found');
  }
  
  const trendPath = path.join(DATA_DIR, 'trend_data.json');
  await fs.writeFile(trendPath, JSON.stringify(trends, null, 2));
  console.log('📈 Generated trend data');
}

// Main update function
async function updateDashboardData(updates = {}) {
  console.log('🚀 Starting dashboard data update...');
  
  try {
    // Ensure directories exist
    await ensureDirectories();
    
    // Backup current data
    await backupCurrentData();
    
    // Update analytics data
    if (updates.email) {
      await updateEmailAnalytics(updates.email);
    }
    
    if (updates.website) {
      await updateWebsiteAnalytics(updates.website);
    }
    
    if (updates.linkedin) {
      await updateLinkedInAnalytics(updates.linkedin);
    }
    
    // Update projects
    if (updates.projects) {
      await updateProjects(updates.projects);
    }
    
    // Generate trend data
    await generateTrendData();
    
    // Update timestamp
    await updateLastUpdatedTimestamp();
    
    console.log('✅ Dashboard data update completed successfully');
    
  } catch (error) {
    console.error('❌ Error updating dashboard data:', error);
    process.exit(1);
  }
}

// CLI interface
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.includes('--help')) {
    console.log(`
HMA Dashboard Data Update System

Usage:
  node update_dashboard_data.js [--sample]

Options:
  --sample    Update with sample data for testing
  --help      Show this help message

Examples:
  # Update with current month's data
  node update_dashboard_data.js
  
  # Update with sample data for testing
  node update_dashboard_data.js --sample
`);
    process.exit(0);
  }
  
  if (args.includes('--sample')) {
    // Sample data for testing
    const sampleUpdates = {
      email: {
        summary: {
          period: "June 2025",
          opens: 1823,
          clicks: 734,
          clickThroughRate: "40.3%",
          openRate: "24.1%",
          customEngagement: 956
        },
        campaigns: [
          {
            id: 1,
            name: "June Newsletter",
            date: "2025-06-15",
            opens: 823,
            clicks: 334,
            sent: 3456,
            openRate: "23.8%",
            clickThroughRate: "40.6%"
          }
        ]
      },
      website: {
        summary: {
          period: "June 2025",
          visits: 7123,
          pageViews: 17834,
          avgSessionDuration: "2:42",
          bounceRate: "34.2%"
        },
        topPages: [
          { url: "/services", views: 1456, change: "+8.3%" },
          { url: "/about", views: 923, change: "+4.1%" },
          { url: "/contact", views: 734, change: "+2.8%" }
        ]
      },
      linkedin: {
        summary: {
          period: "June 2025",
          impressions: 5234,
          engagements: 723,
          followers: 1387,
          clickThroughRate: "3.8%"
        }
      },
      projects: [
        {
          id: 1,
          completionPercentage: 85,
          status: "In Progress",
          tasks: [
            {
              id: 101,
              status: "Completed",
              progress: 100
            },
            {
              id: 102,
              status: "Completed", 
              progress: 100
            },
            {
              id: 103,
              status: "In Progress",
              progress: 75
            }
          ]
        }
      ]
    };
    
    updateDashboardData(sampleUpdates);
  } else {
    // Update with current data (you would replace this with real data integration)
    updateDashboardData({});
  }
}

module.exports = {
  updateDashboardData,
  updateEmailAnalytics,
  updateWebsiteAnalytics,
  updateLinkedInAnalytics,
  updateProjects,
  generateTrendData
};