# HMA Dashboard Data Authenticity Principle

## CRITICAL REQUIREMENT: REAL DATA ONLY

**NEVER use fake, placeholder, or made-up data in the HMA Dashboard.**

All data displayed must be authentic HMA business metrics from real sources.

## Data Sources

### Primary Analytics Source
- **Location**: `/analytics/` directory
- **Contains**: Real HMA website and email analytics data
- **Formats**: CSV files, Excel spreadsheets, PDF reports

### Current Data Files
- **Email Analytics**: Real email campaign performance, open rates, click-through rates
- **Website Analytics**: Actual Google Analytics data, traffic metrics, page views
- **LinkedIn Analytics**: Real LinkedIn engagement metrics
- **Contact Data**: Actual client information and engagement history
- **Project Data**: Real HMA projects with actual timelines and status

## Data Processing Scripts

### Real Data Processor
- **File**: `scripts/process_real_hma_data.js`
- **Purpose**: Processes only real HMA data from analytics directory
- **Verification**: Includes authenticity checks to detect fake data

### Data Update System
- **File**: `scripts/update_dashboard_data.js` 
- **Purpose**: Updates dashboard while preserving historical real data
- **Backup**: Creates timestamped backups of all real data

## Verification Commands

```bash
# Verify data authenticity
node scripts/process_real_hma_data.js --verify-only

# Process new real data
node scripts/process_real_hma_data.js

# Update dashboard with real data
npm run update-data
```

## Data Quality Standards

### Email Metrics (Real HMA Performance)
- Open rates: 20-25% (industry standard for professional services)
- Click-through rates: 35-45% (strong engagement)
- Campaign data from actual newsletters

### Website Metrics (Real HMA Traffic)
- Monthly visits: 5,000-7,000 range
- Page views: 12,000-17,000 range  
- Session duration: 2:30-2:45
- Bounce rates: 34-38%

### Contact Information
- Real client names and companies
- Actual engagement dates and interactions
- Historical communication records

## Prohibited Data Types

❌ **NEVER USE:**
- Lorem ipsum text
- Example.com domains
- Test email addresses
- Fake company names
- Placeholder percentages
- Generated sample data
- Mock analytics numbers

✅ **ALWAYS USE:**
- Real HMA email campaign results
- Actual Google Analytics data
- Genuine client contact information
- Historical HMA project data
- Authentic engagement metrics

## Implementation Notes

- All dashboard components must pull from real data sources
- Historical trends must be based on actual HMA performance over time
- Project timelines must reflect real HMA project status and deadlines
- Contact engagement must show actual client interaction history

**This principle is non-negotiable and must be maintained across all dashboard updates and enhancements.**