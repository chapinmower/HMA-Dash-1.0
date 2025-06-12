# HMA Marketing Dashboard - Build & Update Guide

## 🎯 Overview

This guide shows you how to build, update, and maintain the HMA Marketing Dashboard with historical data preservation and periodic updates.

## 🏗️ Build Setup

### 1. Development Environment

```bash
# Switch to main branch for development
git checkout main

# Install React dependencies
cp react-package.json package.json
npm install

# Start development server
npm start
```

### 2. Production Build

```bash
# Build for production
npm run build

# Deploy to GitHub Pages
npm run deploy
```

## 📊 Data Update System

### Automated Updates

The dashboard includes a sophisticated data update system that:
- ✅ Preserves historical data automatically
- ✅ Creates versioned backups before updates
- ✅ Generates trend data from historical information
- ✅ Maintains data consistency and validation

### Manual Data Updates

#### Quick Update (Recommended)
```bash
# Update with sample data for testing
node scripts/update_dashboard_data.js --sample

# Deploy updated data
npm run deploy-data
```

#### Email Analytics Update
```javascript
const updates = {
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
  }
};
```

#### Website Analytics Update
```javascript
const updates = {
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
      { url: "/about", views: 923, change: "+4.1%" }
    ]
  }
};
```

#### Project Progress Updates
```javascript
const updates = {
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
          status: "In Progress", 
          progress: 75
        }
      ]
    }
  ]
};
```

### Data Update Workflow

1. **Backup Current Data**: System automatically creates timestamped backups
2. **Archive Historical Data**: Previous month's data moves to historical records
3. **Update Current Data**: New data becomes the current period
4. **Generate Trends**: System calculates trends from historical data
5. **Validate Data**: Consistency checks ensure data integrity
6. **Deploy**: Updated data is deployed to production

## 📈 New Dashboard Features

### 1. Historical Trends Analytics
- **Location**: `/trends` route
- **Features**: 
  - 12-month trend visualization
  - Email, website, and LinkedIn performance tracking
  - Month-over-month comparison
  - Interactive charts with detailed tooltips

### 2. Project Progress Tracker
- **Location**: `/project-tracker` route  
- **Features**:
  - Real-time project status tracking
  - Visual progress indicators
  - Task completion monitoring
  - Due date and overdue alerts

### 3. Data Management Center
- **Location**: `/data-management` route
- **Features**:
  - Data freshness monitoring
  - Manual update interfaces
  - Bulk data import/export
  - Historical data access

## 🔄 Periodic Update Schedule

### Weekly Updates (Recommended)
```bash
# Every Monday morning
node scripts/update_dashboard_data.js
npm run deploy-data
```

### Monthly Updates (Comprehensive)
1. Update email analytics with monthly summary
2. Update website analytics with Google Analytics data
3. Update LinkedIn analytics with platform insights
4. Review and update project statuses
5. Generate monthly trend reports

### Quarterly Updates
1. Review historical data accuracy
2. Update project timelines and goals
3. Refresh marketing materials
4. Backup full dataset

## 🚀 GitHub Actions Automation

The dashboard includes automated workflows:

### Automatic Deployment
- **Trigger**: Push to main branch
- **Actions**: Build, test, deploy to GitHub Pages

### Weekly Data Updates
- **Trigger**: Every Monday at 9 AM
- **Actions**: Update data, commit changes, deploy

### Data Quality Checks
- **Trigger**: Pull requests
- **Actions**: Validate JSON, check data consistency

## 📁 Data File Structure

```
public/data/
├── email_analytics.json          # Current email metrics
├── website_analytics.json        # Current website metrics  
├── linkedin_analytics.json       # Current LinkedIn metrics
├── projects.json                  # Active projects
├── contacts.json                  # Contact database
├── team.json                      # Team information
├── trend_data.json               # Generated trend data
├── last_updated.json             # Update timestamps
├── historical/                    # Historical data archive
│   ├── email_historical.json
│   ├── website_historical.json
│   └── linkedin_historical.json
└── backups/                      # Timestamped backups
    └── [timestamp]/
        └── *.json
```

## 🔧 Maintenance Tasks

### Daily
- [ ] Check dashboard accessibility
- [ ] Monitor data freshness indicators

### Weekly  
- [ ] Update current period data
- [ ] Review project progress
- [ ] Check for overdue tasks

### Monthly
- [ ] Archive previous month's data
- [ ] Update trend visualizations
- [ ] Review historical data accuracy
- [ ] Generate monthly reports

### Quarterly
- [ ] Full data backup
- [ ] Review dashboard performance
- [ ] Update documentation
- [ ] Plan feature enhancements

## 🎨 Customization

### Adding New Metrics
1. Update data schemas in `scripts/update_dashboard_data.js`
2. Create new visualization components
3. Add routes to `App.jsx`
4. Update navigation in `Sidebar.jsx`

### Modifying Visualizations
- Components use Recharts library
- Styling follows Material-UI theme
- Colors use HMA brand palette (#105938)

### Data Source Integration
- Replace static JSON with API calls in `apiClient.js`
- Implement real-time data fetching
- Add authentication if needed

## 🐛 Troubleshooting

### Build Issues
```bash
# Clear node modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear React build cache
rm -rf build
npm run build
```

### Data Issues
```bash
# Validate JSON files
node -e "console.log(JSON.parse(require('fs').readFileSync('public/data/email_analytics.json')))"

# Restore from backup
cp public/data/backups/[timestamp]/email_analytics.json public/data/
```

### Deployment Issues
```bash
# Force redeploy
npm run build
npm run deploy
```

## 📞 Support

For issues or questions:
1. Check the build logs in GitHub Actions
2. Validate data files using the Data Management interface
3. Review console errors in browser developer tools
4. Check this guide for common solutions

---

**🎉 You're ready to build and maintain a dynamic, updateable marketing dashboard with full historical data preservation!**