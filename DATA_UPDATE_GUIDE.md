# HMA Dashboard Data Update Guide

## Overview
This guide explains how to update the HMA Marketing Dashboard with new analytics data from your HTML reports.

## Quick Update Process

### 1. Save Your HTML Reports
Place your HTML analytics reports in the following directories:
```
HMA-Dash-1.0/analytics/Data/HTML Reports/
├── Email/           # Email campaign reports
├── Website/         # Google Analytics reports
└── Widgets/         # Monthly widget reports
```

### 2. Run the Update Script
```bash
cd HMA-Dash-1.0
npm run update-data
```

This script will:
- Process all HTML reports
- Validate the data
- Generate updated JSON files
- Add a timestamp for tracking

### 3. Build and Deploy
```bash
# Option 1: Update, build, and deploy in one command
npm run update-and-deploy

# Option 2: Step by step
npm run build          # Build the dashboard
npm run deploy         # Deploy to GitHub Pages
```

## Data File Locations

### Input Files (Your HTML Reports)
- **Email Reports**: `analytics/Data/HTML Reports/Email/`
- **Website Reports**: `analytics/Data/HTML Reports/Website/`
- **CSV Data**: `analytics/Data/Email/*.csv`

### Output Files (Generated JSON)
- **Email Analytics**: `public/data/email_analytics.json`
- **Website Analytics**: `public/data/website_analytics.json`
- **LinkedIn Analytics**: `public/data/linkedin_analytics.json`
- **Last Updated**: `public/data/last_updated.json`

## Data Validation

The update script automatically validates:
- ✅ Positive numbers for opens, clicks, visits
- ✅ Percentages between 0-100%
- ✅ Logical consistency (clicks ≤ opens)
- ✅ Date formats and ranges

Warnings will be shown for:
- ⚠️ Unusually high/low metrics
- ⚠️ Large month-over-month changes
- ⚠️ Future dates

## Manual Data Entry

If you need to manually update specific metrics:

### Email Analytics
Edit `public/data/email_analytics.json`:
```json
{
  "summaries": [
    {
      "period": "May 2025",
      "opens": 600,
      "clicks": 45,
      "clickThroughRate": "7.5%",
      "openRate": "68.2%",
      "totalSent": 879
    }
  ]
}
```

### Website Analytics
Edit `public/data/website_analytics.json`:
```json
{
  "reports": [
    {
      "name": "May 2025 Google Analytics",
      "url": "/reports/May 2025 GA.pdf",
      "date": "2025-05-31"
    }
  ]
}
```

## Troubleshooting

### "Failed to load dashboard data"
- Check that JSON files exist in `public/data/`
- Run `npm run generate-data` to recreate files

### Data not updating on live site
- Clear browser cache (Cmd+Shift+R on Mac)
- Wait 2-3 minutes for GitHub Pages to update
- Check GitHub Actions for deployment status

### Validation errors
- Review error messages in terminal
- Check that percentages don't exceed 100%
- Ensure clicks don't exceed opens

## Best Practices

1. **Regular Updates**: Update data at least monthly
2. **Backup Data**: Keep copies of HTML reports
3. **Verify Numbers**: Double-check metrics after updates
4. **Test Locally**: Run `npm start` to preview changes
5. **Document Changes**: Note significant metric changes

## Support

For issues or questions:
- Check the console for error messages
- Review this guide's troubleshooting section
- Contact your development team if needed