# HMA Data Extraction Directory

This directory contains JSON files extracted from official HMA PDF reports for use in the dashboard analytics.

## Email Report Extractions Needed

Save the following files with extracted metrics from PDF reports:

### Monthly Email Reports
- `may_2025_email_metrics.json` - From "May Newsletter Report .pdf"
- `april_2025_email_metrics.json` - From "April Newsletter Report.pdf"
- `march_2025_email_metrics.json` - From "March Newsletter Report.pdf"
- `february_2025_email_metrics.json` - From "February Newsletter Report.pdf"

### YTD Report
- `ytd_2025_email_metrics.json` - From "YTD Newsletter Report.pdf"

### Website Reports
- `may_2025_website_metrics.json` - From website GA reports
- `april_2025_website_metrics.json` - From website GA reports
- (Additional months as available)

## Required JSON Format

```json
{
  "period": "May 2025",
  "totalSent": 0,
  "totalOpened": 0,
  "totalClicked": 0,
  "openRate": 0.0,
  "clickRate": 0.0,
  "clickToOpenRate": 0.0,
  "campaignCount": 0,
  "uniqueContacts": 0,
  "dataSource": "HMA Newsletter Report - May 2025",
  "extractedDate": "2025-06-15"
}
```

## Data Processing

Once extracted, these files will be processed to:
1. Update dashboard analytics tabs with real HMA data
2. Create historical trend visualizations
3. Generate executive-level performance insights
4. Ensure 100% data authenticity throughout the dashboard