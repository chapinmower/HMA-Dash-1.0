#!/usr/bin/env python3
"""
Simple PDF Data Extractor for HMA Dashboard
Manually extract data from PDFs and convert to JSON
"""

import json
from datetime import datetime

# STEP 1: Look at your PDFs and fill in these numbers
# Just copy the numbers from the PDF reports into these dictionaries

# EMAIL NEWSLETTER DATA
email_data = {
    "february_2025": {
        "period": "February 2025",
        "totalSent": 520,
        "totalOpened": 373,
        "openRate": 0.585,  # 58.5%
        "totalClicked": 45,
        "clickRate": 0.071,  # 7.1%
        "clickToOpenRate": 0.121,  # 12.1%
        "highEngagers": 45,
        "mediumEngagers": 328,
        "lowEngagers": 265,
        "engagementScore": 6.8
    },
    "march_2025": {
        "period": "March 2025",
        "totalSent": 520,
        "totalOpened": 315,
        "openRate": 0.606,  # 60.6%
        "totalClicked": 62,
        "clickRate": 0.119,  # 11.9%
        "clickToOpenRate": 0.197,  # 19.7%
        "highEngagers": 62,
        "mediumEngagers": 253,
        "lowEngagers": 205,
        "engagementScore": 8.2
    },
    "april_2025": {
        "period": "April 2025",
        "totalSent": 531,
        "totalOpened": 319,
        "openRate": 0.601,  # 60.1%
        "totalClicked": 33,
        "clickRate": 0.062,  # 6.2%
        "clickToOpenRate": 0.103,  # 10.3%
        "highEngagers": 33,
        "mediumEngagers": 286,
        "lowEngagers": 212,
        "engagementScore": 6.2
    },
    "may_2025": {
        "period": "May 2025",
        "totalSent": 533,
        "totalOpened": 305,
        "openRate": 0.572,  # 57.2%
        "totalClicked": 23,
        "clickRate": 0.043,  # 4.3%
        "clickToOpenRate": 0.075,  # 7.5%
        "highEngagers": 23,
        "mediumEngagers": 282,
        "lowEngagers": 228,
        "engagementScore": 6.5
    }
}

# WEBSITE ANALYTICS DATA
website_data = {
    "january_2025": {
        "period": "January 2025",
        "totalSessions": 537,
        "uniqueUsers": 444,
        "newUsers": 415,
        "engagementRate": 0.54,  # 54.0%
        "pagesPerSession": 2.00,
        "avgSessionDuration": "00:00:36",
        "totalImpressions": 3465,
        "totalClicks": 116,
        "avgCTR": 0.033  # 3.3%
    },
    "february_2025": {
        "period": "February 2025",
        "totalSessions": 539,
        "uniqueUsers": 426,
        "newUsers": 388,
        "engagementRate": 0.529,  # 52.9%
        "pagesPerSession": 1.63,
        "avgSessionDuration": "00:00:52",
        "totalImpressions": 3400,
        "totalClicks": 114,
        "avgCTR": 0.034  # 3.4%
    },
    "march_2025": {
        "period": "March 2025",
        "totalSessions": 627,
        "uniqueUsers": 483,
        "newUsers": 432,
        "engagementRate": 0.491,  # 49.1%
        "pagesPerSession": 1.80,
        "avgSessionDuration": "00:00:51",
        "totalImpressions": 2985,
        "totalClicks": 103,
        "avgCTR": 0.034  # 3.4%
    },
    "april_2025": {
        "period": "April 2025",
        "totalSessions": 531,
        "uniqueUsers": 438,
        "newUsers": 396,
        "engagementRate": 0.411,  # 41.1%
        "pagesPerSession": 2.03,
        "avgSessionDuration": "00:00:36",
        "totalImpressions": 3292,
        "totalClicks": 91,
        "avgCTR": 0.028  # 2.8%
    },
    "may_2025": {
        "period": "May 2025",
        "totalSessions": 473,
        "uniqueUsers": 364,
        "newUsers": 328,
        "engagementRate": 0.503,  # 50.3%
        "pagesPerSession": 1.98,
        "avgSessionDuration": "00:00:44",
        "totalImpressions": 3805,
        "totalClicks": 85,
        "avgCTR": 0.022  # 2.2%
    }
}

# STEP 2: Create JSON files
output_dir = "/Volumes/Crispy Memes LLC/HMA_Marketing_Dashboard/HMA-Dash-1.0/data/extracted/"

# Save email metrics
for month, data in email_data.items():
    filename = f"{month}_email_metrics.json"
    filepath = output_dir + filename
    
    # Add metadata
    data["campaignCount"] = 1
    data["uniqueContacts"] = data["totalSent"]
    data["dataSource"] = f"HMA Newsletter Report - {data['period']}"
    data["extractedDate"] = datetime.now().strftime("%Y-%m-%d")
    
    with open(filepath, 'w') as f:
        json.dump(data, f, indent=2)
    print(f"Created: {filename}")

# Save website metrics
for month, data in website_data.items():
    filename = f"{month}_website_metrics.json"
    filepath = output_dir + filename
    
    # Add metadata
    data["topPages"] = []  # Add manually if needed
    data["dataSource"] = f"HMA Website Analytics Report - {data['period']}"
    data["extractedDate"] = datetime.now().strftime("%Y-%m-%d")
    
    with open(filepath, 'w') as f:
        json.dump(data, f, indent=2)
    print(f"Created: {filename}")

print("\n✅ All JSON files created successfully!")
print(f"📁 Files saved to: {output_dir}")
