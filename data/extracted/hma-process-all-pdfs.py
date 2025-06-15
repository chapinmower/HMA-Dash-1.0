#!/usr/bin/env python3
"""
Process all HMA PDF Reports and create JSON files
Handles both Email Newsletter and Website Analytics reports
"""

import json
from datetime import datetime
from pathlib import Path

# Configuration
base_dir = Path("/Volumes/Crispy Memes LLC/HMA_Marketing_Dashboard/HMA-Dash-1.0")
output_dir = base_dir / "data" / "extracted"
output_dir.mkdir(parents=True, exist_ok=True)

# Check what JSON files already exist
existing_files = list(output_dir.glob("*.json"))
existing_names = [f.name for f in existing_files]

print("HMA Dashboard PDF Report Processor")
print("="*60)
print(f"\nOutput directory: {output_dir}")
print(f"\nExisting JSON files: {len(existing_files)}")
for f in sorted(existing_names):
    print(f"  ✓ {f}")

# Data templates for each month
# You need to fill in the None values with data from your PDFs

# EMAIL NEWSLETTER DATA
email_data = {
    "february_2025": {
        "period": "February 2025",
        "totalSent": None,  # FILL FROM PDF
        "totalOpened": None,
        "openRate": None,  # Convert % to decimal
        "totalClicked": None,
        "clickRate": None,
        "clickToOpenRate": None,
        "highEngagers": None,
        "mediumEngagers": None,
        "lowEngagers": None,
        "engagementScore": None,
        "campaignCount": 1,
        "uniqueContacts": None
    },
    "march_2025": {
        "period": "March 2025",
        "totalSent": None,  # FILL FROM PDF
        "totalOpened": None,
        "openRate": None,
        "totalClicked": None,
        "clickRate": None,
        "clickToOpenRate": None,
        "highEngagers": None,
        "mediumEngagers": None,
        "lowEngagers": None,
        "engagementScore": None,
        "campaignCount": 1,
        "uniqueContacts": None
    },
    "april_2025": {
        "period": "April 2025",
        "totalSent": None,  # FILL FROM PDF
        "totalOpened": None,
        "openRate": None,
        "totalClicked": None,
        "clickRate": None,
        "clickToOpenRate": None,
        "highEngagers": None,
        "mediumEngagers": None,
        "lowEngagers": None,
        "engagementScore": None,
        "campaignCount": 1,
        "uniqueContacts": None
    },
    "may_2025": {
        "period": "May 2025",
        "totalSent": None,  # FILL FROM PDF
        "totalOpened": None,
        "openRate": None,
        "totalClicked": None,
        "clickRate": None,
        "clickToOpenRate": None,
        "highEngagers": None,
        "mediumEngagers": None,
        "lowEngagers": None,
        "engagementScore": None,
        "campaignCount": 1,
        "uniqueContacts": None
    }
}

# WEBSITE ANALYTICS DATA
website_data = {
    "january_2025": {
        "period": "January 2025",
        "totalSessions": None,  # FILL FROM PDF
        "uniqueUsers": None,
        "newUsers": None,
        "engagementRate": None,
        "pagesPerSession": None,
        "avgSessionDuration": None,  # Format: "00:00:36"
        "totalImpressions": None,
        "totalClicks": None,
        "avgCTR": None,
        "topPages": []
    },
    "february_2025": {
        "period": "February 2025",
        "totalSessions": None,  # FILL FROM PDF
        "uniqueUsers": None,
        "newUsers": None,
        "engagementRate": None,
        "pagesPerSession": None,
        "avgSessionDuration": None,
        "totalImpressions": None,
        "totalClicks": None,
        "avgCTR": None,
        "topPages": []
    },
    "march_2025": {
        "period": "March 2025",
        "totalSessions": None,  # FILL FROM PDF
        "uniqueUsers": None,
        "newUsers": None,
        "engagementRate": None,
        "pagesPerSession": None,
        "avgSessionDuration": None,
        "totalImpressions": None,
        "totalClicks": None,
        "avgCTR": None,
        "topPages": []
    },
    "april_2025": {
        "period": "April 2025",
        "totalSessions": None,  # FILL FROM PDF
        "uniqueUsers": None,
        "newUsers": None,
        "engagementRate": None,
        "pagesPerSession": None,
        "avgSessionDuration": None,
        "totalImpressions": None,
        "totalClicks": None,
        "avgCTR": None,
        "topPages": []
    },
    "may_2025": {
        "period": "May 2025",
        "totalSessions": None,  # FILL FROM PDF
        "uniqueUsers": None,
        "newUsers": None,
        "engagementRate": None,
        "pagesPerSession": None,
        "avgSessionDuration": None,
        "totalImpressions": None,
        "totalClicks": None,
        "avgCTR": None,
        "topPages": []
    }
}

def create_json_files():
    """Create JSON files from the data"""
    created_files = []
    skipped_files = []
    
    print("\n" + "="*60)
    print("PROCESSING EMAIL METRICS")
    print("="*60)
    
    # Process email metrics
    for month_key, data in email_data.items():
        filename = f"{month_key}_email_metrics.json"
        
        # Check if file already exists
        if filename in existing_names:
            print(f"✓ {filename} - Already exists, skipping")
            skipped_files.append(filename)
            continue
        
        # Skip if no data entered
        if data["totalSent"] is None:
            print(f"⚠ {filename} - No data entered, skipping")
            continue
        
        # Add metadata
        data["dataSource"] = f"HMA Newsletter Report - {data['period']}"
        data["extractedDate"] = datetime.now().strftime("%Y-%m-%d")
        
        # Calculate derived values if needed
        if data["totalOpened"] is None and data["totalSent"] and data["openRate"]:
            data["totalOpened"] = int(data["totalSent"] * data["openRate"])
        
        if data["totalClicked"] is None and data["totalSent"] and data["clickRate"]:
            data["totalClicked"] = int(data["totalSent"] * data["clickRate"])
        
        if data["uniqueContacts"] is None:
            data["uniqueContacts"] = data["totalSent"]
        
        # Save file
        filepath = output_dir / filename
        with open(filepath, 'w') as f:
            json.dump(data, f, indent=2)
        
        created_files.append(filename)
        print(f"✅ Created: {filename}")
    
    print("\n" + "="*60)
    print("PROCESSING WEBSITE METRICS")
    print("="*60)
    
    # Process website metrics
    for month_key, data in website_data.items():
        filename = f"{month_key}_website_metrics.json"
        
        # Check if file already exists
        if filename in existing_names:
            print(f"✓ {filename} - Already exists, skipping")
            skipped_files.append(filename)
            continue
        
        # Skip if no data entered
        if data["totalSessions"] is None:
            print(f"⚠ {filename} - No data entered, skipping")
            continue
        
        # Add metadata
        data["dataSource"] = f"HMA Website Analytics Report - {data['period']}"
        data["extractedDate"] = datetime.now().strftime("%Y-%m-%d")
        
        # Save file
        filepath = output_dir / filename
        with open(filepath, 'w') as f:
            json.dump(data, f, indent=2)
        
        created_files.append(filename)
        print(f"✅ Created: {filename}")
    
    return created_files, skipped_files

def show_data_entry_guide():
    """Show guide for entering data from PDFs"""
    print("\n" + "="*60)
    print("DATA ENTRY GUIDE")
    print("="*60)
    
    print("\nFOR EMAIL NEWSLETTERS:")
    print("Look for these metrics in your PDFs:")
    print("- Newsletter Recipients → totalSent")
    print("- Open Rate (convert to decimal, e.g., 58.5% → 0.585)")
    print("- Click Rate (convert to decimal)")
    print("- Click-to-Open Rate (convert to decimal)")
    print("- Engagement breakdown (High/Medium/Low)")
    print("- Engagement Score")
    
    print("\nFOR WEBSITE ANALYTICS:")
    print("Look for these metrics in your PDFs:")
    print("- Sessions → totalSessions")
    print("- Users → uniqueUsers")
    print("- New Users → newUsers")
    print("- Engagement Rate (convert to decimal)")
    print("- Pages per Session")
    print("- Avg Session Duration (format as HH:MM:SS)")
    print("- Search Console: Impressions, Clicks, CTR")
    
    print("\nREMEMBER:")
    print("- Convert all percentages to decimals (divide by 100)")
    print("- Use null for missing values")
    print("- Duration format: '00:00:36' for 36 seconds")

def validate_data():
    """Basic validation of the data"""
    print("\n" + "="*60)
    print("DATA VALIDATION")
    print("="*60)
    
    issues = []
    
    # Validate email data
    for month_key, data in email_data.items():
        if data["totalSent"] is not None:
            # Check percentages
            for field in ["openRate", "clickRate", "clickToOpenRate"]:
                if data.get(field) is not None:
                    if not 0 <= data[field] <= 1:
                        issues.append(f"{month_key} - {field} outside valid range: {data[field]}")
            
            # Check engagement breakdown
            if all(data.get(f) is not None for f in ["highEngagers", "mediumEngagers", "lowEngagers"]):
                total = data["highEngagers"] + data["mediumEngagers"] + data["lowEngagers"]
                if total != data["totalSent"]:
                    issues.append(f"{month_key} - Engagement breakdown ({total}) doesn't match totalSent ({data['totalSent']})")
    
    # Validate website data
    for month_key, data in website_data.items():
        if data["totalSessions"] is not None:
            # Check logical constraints
            if data.get("uniqueUsers") is not None and data["uniqueUsers"] > data["totalSessions"]:
                issues.append(f"{month_key} - uniqueUsers ({data['uniqueUsers']}) > totalSessions ({data['totalSessions']})")
            
            if data.get("newUsers") is not None and data.get("uniqueUsers") is not None:
                if data["newUsers"] > data["uniqueUsers"]:
                    issues.append(f"{month_key} - newUsers ({data['newUsers']}) > uniqueUsers ({data['uniqueUsers']})")
    
    if issues:
        print("⚠ Validation issues found:")
        for issue in issues:
            print(f"  - {issue}")
    else:
        print("✅ All data validation passed!")
    
    return len(issues) == 0

# Main execution
if __name__ == "__main__":
    # Show data entry guide
    show_data_entry_guide()
    
    print("\n" + "="*60)
    print("CURRENT STATUS")
    print("="*60)
    print("\nThis script is ready to create JSON files once you fill in the data.")
    print("Edit this script and replace the None values with data from your PDFs.")
    print("\nSteps:")
    print("1. Open each PDF in Preview")
    print("2. Find the metrics listed in the guide above")
    print("3. Edit this script and fill in the None values")
    print("4. Run the script again to create JSON files")
    
    # Check if any data has been entered
    has_email_data = any(data["totalSent"] is not None for data in email_data.values())
    has_website_data = any(data["totalSessions"] is not None for data in website_data.values())
    
    if has_email_data or has_website_data:
        print("\n" + "="*60)
        print("DATA DETECTED - CREATING JSON FILES")
        print("="*60)
        
        # Validate data
        if validate_data():
            # Create JSON files
            created, skipped = create_json_files()
            
            print("\n" + "="*60)
            print("SUMMARY")
            print("="*60)
            print(f"Created: {len(created)} new JSON files")
            print(f"Skipped: {len(skipped)} existing files")
            print(f"Output directory: {output_dir}")
    else:
        print("\n⚠ No data has been entered yet. Please fill in the data above and run again.")
