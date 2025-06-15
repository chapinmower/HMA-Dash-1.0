#!/usr/bin/env python3
"""
HMA Dashboard Data Extraction System - Complete Technical Documentation
Run this script to display all system knowledge
"""

def display_knowledge():
    """Display complete HMA Dashboard extraction system documentation"""
    
    documentation = """
================================================================================
HMA DASHBOARD DATA EXTRACTION SYSTEM - TECHNICAL DOCUMENTATION
================================================================================

PROJECT: HMA Marketing Dashboard 1.0
PURPOSE: Extract marketing metrics from PDF reports and convert to JSON format

================================================================================
DIRECTORY STRUCTURE
================================================================================
/Volumes/Crispy Memes LLC/HMA_Marketing_Dashboard/HMA-Dash-1.0/
├── data/
│   ├── extracted/          # JSON output directory
│   │   ├── february_2025_email_metrics.json
│   │   ├── february_2025_website_metrics.json
│   │   └── [month]_[year]_[type]_metrics.json
│   └── raw/               # Original PDF reports
└── scripts/               # Extraction scripts

================================================================================
JSON SCHEMAS - CRITICAL FOR DASHBOARD COMPATIBILITY
================================================================================
"""
    
    # Email metrics schema
    email_schema = {
        "period": "Month Year",              # e.g., "February 2025"
        "totalSent": 520,                    # Newsletter recipients
        "totalOpened": 373,                  # Total opens
        "totalClicked": 45,                  # Total clicks
        "openRate": 0.585,                   # DECIMAL format (58.5% → 0.585)
        "clickRate": 0.071,                  # DECIMAL format
        "clickToOpenRate": 0.121,            # DECIMAL format
        "campaignCount": 1,                  # Number of campaigns
        "uniqueContacts": 520,               # Usually equals totalSent
        "highEngagers": 45,                  # Engagement segmentation
        "mediumEngagers": 328,               # Engagement segmentation
        "lowEngagers": 265,                  # Engagement segmentation
        "engagementScore": 6.8,              # Overall engagement metric
        "dataSource": "HMA Newsletter Report - February 2025",
        "extractedDate": "2025-06-15"        # ISO 8601 format
    }
    
    # Website metrics schema
    website_schema = {
        "period": "Month Year",              # e.g., "April 2025"
        "totalSessions": 531,                # Website sessions
        "uniqueUsers": 438,                  # Unique visitors
        "newUsers": 396,                     # First-time visitors
        "engagementRate": 0.411,             # DECIMAL format
        "pagesPerSession": 2.03,             # Average pages viewed
        "avgSessionDuration": "00:00:36",    # Format: HH:MM:SS
        "totalImpressions": 3292,            # Search Console impressions
        "totalClicks": 91,                   # Search Console clicks
        "avgCTR": 0.028,                     # Click-through rate (DECIMAL)
        "topPages": [                        # Top 5 performing pages
            {
                "url": "/products/hma-500",
                "sessions": 145,
                "engagementRate": 0.52,
                "eventsPerSession": 3.2
            }
        ],
        "dataSource": "HMA Website Analytics Report - April 2025",
        "extractedDate": "2025-06-15"
    }
    
    print(documentation)
    
    print("EMAIL METRICS SCHEMA:")
    import json
    print(json.dumps(email_schema, indent=2))
    
    print("\nWEBSITE METRICS SCHEMA:")
    print(json.dumps(website_schema, indent=2))
    
    print("""

================================================================================
EXTRACTION PATTERNS - USED BY AUTOMATED EXTRACTOR
================================================================================

EMAIL PATTERNS:
- Total Sent: r"(\d+)\s*contacts?\s*received" | r"Newsletter\s*Recipients[:\s]+(\d+)"
- Open Rate: r"(\d+\.?\d*)%?\s*open\s*rate" | r"Open\s*Rate[:\s]+(\d+\.?\d*)%?"
- Click Rate: r"(\d+\.?\d*)%?\s*click\s*rate" | r"Click\s*Rate[:\s]+(\d+\.?\d*)%?"
- Engagement Score: r"Engagement\s*Score[:\s]+(\d+\.?\d*)"

WEBSITE PATTERNS:
- Sessions: r"(\d+)\s*(?:website\s*)?sessions?" | r"Sessions[:\s]+(\d+)"
- Users: r"(\d+)\s*unique\s*users?" | r"Users[:\s]+(\d+)"
- Engagement Rate: r"(\d+\.?\d*)%?\s*engagement\s*rate"
- CTR: r"(\d+\.?\d*)%?\s*(?:URL\s*)?CTR" | r"Average\s*CTR[:\s]+(\d+\.?\d*)%?"

================================================================================
VALIDATION RULES - MUST BE ENFORCED
================================================================================

1. PERCENTAGE VALIDATION:
   - All percentage values MUST be decimals between 0 and 1
   - Convert: 58.5% → 0.585, NOT 58.5

2. LOGICAL CONSTRAINTS:
   - uniqueUsers ≤ totalSessions (users can have multiple sessions)
   - newUsers ≤ uniqueUsers (new users are subset of unique)
   - highEngagers + mediumEngagers + lowEngagers = totalSent

3. REQUIRED FIELDS:
   Email: totalSent, openRate, clickRate
   Website: totalSessions, uniqueUsers

4. MISSING DATA:
   - Use null for missing values, NOT 0 or empty string
   - Dashboard handles null gracefully

================================================================================
DERIVED CALCULATIONS
================================================================================

IF MISSING, CALCULATE:
- totalOpened = totalSent * openRate
- totalClicked = totalSent * clickRate  
- clickToOpenRate = clickRate / openRate (if openRate > 0)
- uniqueContacts = totalSent (if not provided)

================================================================================
CURRENT DATA STATUS
================================================================================

COMPLETED EXTRACTIONS:
✅ february_2025_email_metrics.json
✅ february_2025_website_metrics.json
✅ march_2025_email_metrics.json
✅ march_2025_website_metrics.json
✅ january_2025_website_metrics.json
✅ may_2025_website_metrics.json (partial)

PENDING EXTRACTIONS:
❌ april_2025_email_metrics.json
❌ may_2025_email_metrics.json
❌ april_2025_website_metrics.json

================================================================================
FILE NAMING CONVENTION
================================================================================

FORMAT: {month}_{year}_{type}_metrics.json

EXAMPLES:
- february_2025_email_metrics.json
- april_2025_website_metrics.json

RULES:
- Lowercase month names
- Underscore separators
- Type is either "email" or "website"
- Always end with "_metrics.json"

================================================================================
PYTHON EXTRACTION EXAMPLE
================================================================================
""")
    
    # Show working example
    print("import json")
    print("from datetime import datetime")
    print("from pathlib import Path")
    print()
    print("# Example email metrics structure")
    print("email_metrics = {")
    print('    "period": "April 2025",')
    print('    "totalSent": 531,')
    print('    "totalOpened": 319,')
    print('    "openRate": 0.601,  # 60.1% as decimal')
    print('    "totalClicked": 33,')
    print('    "clickRate": 0.062,  # 6.2% as decimal')
    print('    "clickToOpenRate": 0.103,  # 10.3% as decimal')
    print('    "campaignCount": 1,')
    print('    "uniqueContacts": 531,')
    print('    "highEngagers": 33,')
    print('    "mediumEngagers": 286,')
    print('    "lowEngagers": 212,')
    print('    "engagementScore": 6.2,')
    print('    "dataSource": "HMA Newsletter Report - April 2025",')
    print('    "extractedDate": datetime.now().strftime("%Y-%m-%d")')
    print("}")
    print()
    print("# Save to JSON")
    print('output_dir = Path("/Volumes/Crispy Memes LLC/HMA_Marketing_Dashboard/HMA-Dash-1.0/data/extracted/")')
    print('output_path = output_dir / "april_2025_email_metrics.json"')
    print()
    print("with open(output_path, 'w') as f:")
    print("    json.dump(email_metrics, f, indent=2)")
    
    print("""

================================================================================
DASHBOARD INTEGRATION REQUIREMENTS
================================================================================

1. DATA LOADING:
   - Read all JSON files from /data/extracted/
   - Parse period field for time series analysis
   - Handle missing months gracefully

2. METRIC CALCULATIONS:
   - Month-over-month changes
   - Trend analysis across periods
   - Engagement score tracking

3. ERROR HANDLING:
   - Validate JSON structure on load
   - Check for required fields
   - Log validation errors

================================================================================
TESTING CHECKLIST
================================================================================

Before dashboard integration, verify:
□ All required fields present
□ Percentages in decimal format (0-1)
□ Logical relationships valid
□ JSON properly formatted
□ File naming convention followed
□ Dates in ISO 8601 format
□ Null used for missing values

================================================================================
VALIDATION FUNCTIONS
================================================================================
""")
    
    # Show validation example
    print("def validate_email_metrics(data):")
    print("    # Check required fields")
    print("    required = ['totalSent', 'openRate', 'clickRate', 'period']")
    print("    for field in required:")
    print("        assert field in data and data[field] is not None")
    print("    ")
    print("    # Validate percentages")
    print("    for field in ['openRate', 'clickRate', 'clickToOpenRate']:")
    print("        if data.get(field) is not None:")
    print("            assert 0 <= data[field] <= 1, f'{field} must be between 0 and 1'")
    print("    ")
    print("    # Validate engagement breakdown")
    print("    if all(data.get(f) for f in ['highEngagers', 'mediumEngagers', 'lowEngagers']):")
    print("        total = data['highEngagers'] + data['mediumEngagers'] + data['lowEngagers']")
    print("        assert total == data['totalSent'], 'Engagement breakdown must equal totalSent'")
    print()
    print("def validate_website_metrics(data):")
    print("    # Check required fields")
    print("    required = ['totalSessions', 'uniqueUsers', 'period']")
    print("    for field in required:")
    print("        assert field in data and data[field] is not None")
    print("    ")
    print("    # Logical constraints")
    print("    assert data['uniqueUsers'] <= data['totalSessions']")
    print("    if data.get('newUsers'):")
    print("        assert data['newUsers'] <= data['uniqueUsers']")
    
    print("""

================================================================================
COMMON ISSUES AND SOLUTIONS
================================================================================

ISSUE: PDF text extraction fails
SOLUTION: Use manual entry script with visual PDF inspection

ISSUE: Percentage format confusion  
SOLUTION: Always store as decimals (0.585 not 58.5 or "58.5%")

ISSUE: Missing derived metrics
SOLUTION: Calculate from base metrics using formulas above

ISSUE: Engagement breakdown mismatch
SOLUTION: Verify high + medium + low = totalSent

================================================================================
QUICK COMMANDS
================================================================================

# Check existing JSON files
ls -la "/Volumes/Crispy Memes LLC/HMA_Marketing_Dashboard/HMA-Dash-1.0/data/extracted/"

# Validate JSON structure
python -m json.tool "/Volumes/Crispy Memes LLC/HMA_Marketing_Dashboard/HMA-Dash-1.0/data/extracted/february_2025_email_metrics.json"

# Run extraction scripts
python pdf-extraction-script.py
python pdf-to-json-converter.py

================================================================================
CRITICAL REMINDERS FOR DEVELOPMENT
================================================================================

1. NEVER change field names - dashboard expects exact schema
2. ALWAYS convert percentages to decimals
3. USE null for missing data, not 0
4. MAINTAIN ISO 8601 date format
5. VALIDATE all data before saving
6. TEST with actual dashboard after changes
7. PRESERVE metric precision (don't round)
8. FOLLOW file naming convention exactly

================================================================================
END OF DOCUMENTATION
================================================================================
""")
    
    print("\nOutput directory: /Volumes/Crispy Memes LLC/HMA_Marketing_Dashboard/HMA-Dash-1.0/data/extracted/")
    print("\nThis documentation contains all knowledge about the HMA Dashboard data extraction system.")

if __name__ == "__main__":
    display_knowledge()
