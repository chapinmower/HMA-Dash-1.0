#!/usr/bin/env python3
"""
Calculate actual May 2025 email metrics from Clout CSV data
"""

import csv
import json
from collections import defaultdict

def calculate_email_metrics(csv_file):
    """Calculate email metrics from CSV data"""
    
    # Initialize counters
    total_sent = 0
    total_opens = 0
    total_clicks = 0
    campaigns = defaultdict(lambda: {
        'sent': 0,
        'opens': 0, 
        'clicks': 0,
        'engagement_score_sum': 0
    })
    
    # Read CSV file
    with open(csv_file, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        
        for row in reader:
            campaign_name = row.get('Campaign Name', '').strip()
            open_status = row.get('Open', '').strip().lower()
            click_status = row.get('Click', '').strip().lower()
            engagement_score = row.get('engagement score', '0').strip()
            
            # Count total sent
            total_sent += 1
            campaigns[campaign_name]['sent'] += 1
            
            # Count opens
            if open_status == 'yes':
                total_opens += 1
                campaigns[campaign_name]['opens'] += 1
            
            # Count clicks
            if click_status == 'yes':
                total_clicks += 1
                campaigns[campaign_name]['clicks'] += 1
            
            # Sum engagement scores
            try:
                engagement_val = float(engagement_score)
                campaigns[campaign_name]['engagement_score_sum'] += engagement_val
            except (ValueError, TypeError):
                pass
    
    # Calculate rates
    open_rate = (total_opens / total_sent * 100) if total_sent > 0 else 0
    click_rate = (total_clicks / total_sent * 100) if total_sent > 0 else 0
    click_to_open_rate = (total_clicks / total_opens * 100) if total_opens > 0 else 0
    
    # Calculate average engagement score
    total_engagement = sum(camp['engagement_score_sum'] for camp in campaigns.values())
    avg_engagement = total_engagement / total_sent if total_sent > 0 else 0
    
    # Create metrics summary
    metrics = {
        "period": "May 2025",
        "opens": total_opens,
        "clicks": total_clicks,
        "clickThroughRate": f"{click_to_open_rate:.1f}%",
        "openRate": f"{open_rate:.1f}%",
        "customEngagement": total_clicks,  # Using clicks as engagement metric
        "totalSent": total_sent,
        "clickRate": f"{click_rate:.1f}%",
        "avgEngagementScore": round(avg_engagement, 1),
        "lastUpdated": "2025-05-31T18:30:00.000Z"
    }
    
    # Campaign breakdown
    campaign_details = []
    for name, data in campaigns.items():
        if data['sent'] > 0:  # Only include campaigns that were actually sent
            campaign_open_rate = (data['opens'] / data['sent'] * 100) if data['sent'] > 0 else 0
            campaign_click_rate = (data['clicks'] / data['sent'] * 100) if data['sent'] > 0 else 0
            campaign_cto_rate = (data['clicks'] / data['opens'] * 100) if data['opens'] > 0 else 0
            avg_engagement = data['engagement_score_sum'] / data['sent'] if data['sent'] > 0 else 0
            
            campaign_details.append({
                "name": name,
                "sent": data['sent'],
                "opens": data['opens'],
                "clicks": data['clicks'],
                "openRate": f"{campaign_open_rate:.1f}%",
                "clickRate": f"{campaign_click_rate:.1f}%",
                "clickToOpenRate": f"{campaign_cto_rate:.1f}%",
                "avgEngagement": round(avg_engagement, 1)
            })
    
    return metrics, campaign_details

if __name__ == "__main__":
    csv_file = "/Volumes/Crispy Memes LLC/HMA_Marketing_Dashboard/HMA-Dash-1.0/reports/Data hma dash/Clout/May 2025 Clout Data.csv"
    
    try:
        metrics, campaigns = calculate_email_metrics(csv_file)
        
        print("=== MAY 2025 EMAIL METRICS ===")
        print(f"Total Sent: {metrics['totalSent']}")
        print(f"Total Opens: {metrics['opens']}")
        print(f"Total Clicks: {metrics['clicks']}")
        print(f"Open Rate: {metrics['openRate']}")
        print(f"Click Rate: {metrics['clickRate']}")
        print(f"Click-to-Open Rate: {metrics['clickThroughRate']}")
        print(f"Avg Engagement Score: {metrics['avgEngagementScore']}")
        
        print("\n=== CAMPAIGN BREAKDOWN ===")
        for campaign in campaigns:
            print(f"\nCampaign: {campaign['name']}")
            print(f"  Sent: {campaign['sent']}")
            print(f"  Opens: {campaign['opens']} ({campaign['openRate']})")
            print(f"  Clicks: {campaign['clicks']} ({campaign['clickRate']})")
            print(f"  Click-to-Open: {campaign['clickToOpenRate']}")
            print(f"  Avg Engagement: {campaign['avgEngagement']}")
        
        # Save JSON for dashboard
        output_data = {
            "may_2025_summary": metrics,
            "campaigns": campaigns
        }
        
        with open("may_2025_real_email_metrics.json", "w") as f:
            json.dump(output_data, f, indent=2)
        
        print(f"\n✅ Metrics saved to may_2025_real_email_metrics.json")
        
    except Exception as e:
        print(f"Error calculating metrics: {e}")