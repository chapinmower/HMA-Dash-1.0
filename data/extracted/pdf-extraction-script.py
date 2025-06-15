#!/usr/bin/env python3
"""
Automated PDF Data Extraction for HMA Dashboard
Extracts marketing metrics from PDF reports and converts to JSON
"""

import re
import json
from datetime import datetime
from pathlib import Path
import sys

# Install required packages:
# pip install pymupdf pdfplumber

try:
    import fitz  # PyMuPDF
    import pdfplumber
except ImportError:
    print("Please install required packages:")
    print("pip install pymupdf pdfplumber")
    sys.exit(1)

class HMAReportExtractor:
    def __init__(self, output_dir="/Volumes/Crispy Memes LLC/HMA_Marketing_Dashboard/HMA-Dash-1.0/data/extracted/"):
        self.output_dir = Path(output_dir)
        self.output_dir.mkdir(parents=True, exist_ok=True)
        
    def extract_text_from_pdf(self, pdf_path):
        """Extract text from PDF using multiple methods for best results"""
        text = ""
        
        # Method 1: Try PyMuPDF first
        try:
            pdf_document = fitz.open(pdf_path)
            for page_num in range(pdf_document.page_count):
                page = pdf_document[page_num]
                text += page.get_text()
            pdf_document.close()
        except:
            pass
        
        # Method 2: Try pdfplumber as backup
        if not text.strip():
            try:
                with pdfplumber.open(pdf_path) as pdf:
                    for page in pdf.pages:
                        page_text = page.extract_text()
                        if page_text:
                            text += page_text + "\n"
            except:
                pass
        
        return text
    
    def parse_email_metrics(self, text, month_year):
        """Extract email newsletter metrics from text"""
        metrics = {
            "period": month_year,
            "totalSent": None,
            "totalOpened": None,
            "totalClicked": None,
            "openRate": None,
            "clickRate": None,
            "clickToOpenRate": None,
            "campaignCount": 1,
            "uniqueContacts": None,
            "highEngagers": None,
            "mediumEngagers": None,
            "lowEngagers": None,
            "engagementScore": None,
            "dataSource": f"HMA Newsletter Report - {month_year}",
            "extractedDate": datetime.now().strftime("%Y-%m-%d")
        }
        
        # Pattern matching for common metrics
        patterns = {
            "totalSent": [
                r"(\d+)\s*contacts\s*received",
                r"Newsletter Recipients[:\s]+(\d+)",
                r"Total Sent[:\s]+(\d+)"
            ],
            "openRate": [
                r"(\d+\.?\d*)%?\s*open rate",
                r"Open Rate[:\s]+(\d+\.?\d*)%?"
            ],
            "clickRate": [
                r"(\d+\.?\d*)%?\s*click rate",
                r"Click Rate[:\s]+(\d+\.?\d*)%?"
            ],
            "clickToOpenRate": [
                r"(\d+\.?\d*)%?\s*click-to-open",
                r"Click-to-Open Rate[:\s]+(\d+\.?\d*)%?"
            ],
            "engagementScore": [
                r"Engagement Score[:\s]+(\d+\.?\d*)",
                r"engagement score[:\s]+(\d+\.?\d*)"
            ],
            "highEngagers": [
                r"High.*?Engagement.*?(\d+)",
                r"(\d+).*?high engager"
            ],
            "totalOpened": [
                r"(\d+)\s*opens",
                r"Total Opens[:\s]+(\d+)"
            ],
            "totalClicked": [
                r"(\d+)\s*clicks",
                r"Total Clicks[:\s]+(\d+)"
            ]
        }
        
        # Search for each metric
        for metric, pattern_list in patterns.items():
            for pattern in pattern_list:
                match = re.search(pattern, text, re.IGNORECASE)
                if match:
                    value = match.group(1)
                    # Convert percentages to decimals
                    if metric in ["openRate", "clickRate", "clickToOpenRate"]:
                        metrics[metric] = float(value) / 100
                    else:
                        metrics[metric] = int(value) if metric != "engagementScore" else float(value)
                    break
        
        # Calculate derived metrics if needed
        if metrics["totalSent"] and metrics["openRate"] and not metrics["totalOpened"]:
            metrics["totalOpened"] = int(metrics["totalSent"] * metrics["openRate"])
        
        if metrics["totalSent"] and metrics["clickRate"] and not metrics["totalClicked"]:
            metrics["totalClicked"] = int(metrics["totalSent"] * metrics["clickRate"])
        
        # Set uniqueContacts to totalSent if not found
        if not metrics["uniqueContacts"] and metrics["totalSent"]:
            metrics["uniqueContacts"] = metrics["totalSent"]
        
        return metrics
    
    def parse_website_metrics(self, text, month_year):
        """Extract website analytics metrics from text"""
        metrics = {
            "period": month_year,
            "totalSessions": None,
            "uniqueUsers": None,
            "newUsers": None,
            "engagementRate": None,
            "pagesPerSession": None,
            "avgSessionDuration": None,
            "totalImpressions": None,
            "totalClicks": None,
            "avgCTR": None,
            "topPages": [],
            "dataSource": f"HMA Website Analytics Report - {month_year}",
            "extractedDate": datetime.now().strftime("%Y-%m-%d")
        }
        
        # Pattern matching for website metrics
        patterns = {
            "totalSessions": [
                r"(\d+)\s*(?:website\s*)?sessions",
                r"Sessions[:\s]+(\d+)"
            ],
            "uniqueUsers": [
                r"(\d+)\s*unique users",
                r"Users[:\s]+(\d+)"
            ],
            "newUsers": [
                r"(\d+)\s*new users",
                r"New Users[:\s]+(\d+)"
            ],
            "engagementRate": [
                r"(\d+\.?\d*)%?\s*engagement rate",
                r"Engagement Rate[:\s]+(\d+\.?\d*)%?"
            ],
            "pagesPerSession": [
                r"(\d+\.?\d*)\s*pages?/session",
                r"Pages per Session[:\s]+(\d+\.?\d*)"
            ],
            "totalImpressions": [
                r"(\d+)\s*impressions",
                r"Total Impressions[:\s]+(\d+)"
            ],
            "totalClicks": [
                r"Url Clicks[:\s]+(\d+)",
                r"Total Clicks[:\s]+(\d+)"
            ],
            "avgCTR": [
                r"(\d+\.?\d*)%?\s*(?:URL\s*)?CTR",
                r"Average CTR[:\s]+(\d+\.?\d*)%?"
            ]
        }
        
        # Search for each metric
        for metric, pattern_list in patterns.items():
            for pattern in pattern_list:
                match = re.search(pattern, text, re.IGNORECASE)
                if match:
                    value = match.group(1)
                    if metric in ["engagementRate", "avgCTR"]:
                        metrics[metric] = float(value) / 100
                    elif metric == "pagesPerSession":
                        metrics[metric] = float(value)
                    else:
                        metrics[metric] = int(value)
                    break
        
        # Extract session duration
        duration_match = re.search(r"(\d+):(\d+):(\d+)", text)
        if duration_match:
            metrics["avgSessionDuration"] = duration_match.group(0)
        else:
            duration_match = re.search(r"(\d+):(\d+)", text)
            if duration_match:
                metrics["avgSessionDuration"] = f"00:{duration_match.group(0)}"
        
        # Extract top pages (simplified)
        page_pattern = r"(hummermower\.com[^\s]+)\s+(\d+)\s+(\d+\.?\d*)%?\s+(\d+\.?\d*)"
        page_matches = re.findall(page_pattern, text)
        for match in page_matches[:5]:  # Top 5 pages
            metrics["topPages"].append({
                "url": match[0],
                "sessions": int(match[1]),
                "engagementRate": float(match[2]) / 100 if float(match[2]) > 1 else float(match[2]),
                "eventsPerSession": float(match[3])
            })
        
        return metrics
    
    def process_pdf(self, pdf_path, report_type="email", month_year=None):
        """Process a single PDF and extract metrics"""
        print(f"Processing: {pdf_path}")
        
        # Extract text from PDF
        text = self.extract_text_from_pdf(pdf_path)
        
        if not text:
            print(f"Error: Could not extract text from {pdf_path}")
            return None
        
        # Determine month/year if not provided
        if not month_year:
            # Try to extract from filename or text
            month_match = re.search(r"(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{4})", text, re.IGNORECASE)
            if month_match:
                month_year = f"{month_match.group(1)} {month_match.group(2)}"
            else:
                month_year = "Unknown Period"
        
        # Parse metrics based on report type
        if report_type == "email":
            metrics = self.parse_email_metrics(text, month_year)
            filename = f"{month_year.lower().replace(' ', '_')}_email_metrics.json"
        else:
            metrics = self.parse_website_metrics(text, month_year)
            filename = f"{month_year.lower().replace(' ', '_')}_website_metrics.json"
        
        # Save to JSON
        output_path = self.output_dir / filename
        with open(output_path, 'w') as f:
            json.dump(metrics, f, indent=2)
        
        print(f"Saved: {output_path}")
        return metrics
    
    def process_all_pdfs(self, pdf_directory):
        """Process all PDFs in a directory"""
        pdf_dir = Path(pdf_directory)
        results = []
        
        # Process email reports
        email_patterns = ["*Newsletter*.pdf", "*Email*.pdf"]
        for pattern in email_patterns:
            for pdf_path in pdf_dir.glob(pattern):
                result = self.process_pdf(pdf_path, report_type="email")
                if result:
                    results.append(result)
        
        # Process website reports
        website_patterns = ["*Website*.pdf", "*Analytics*.pdf"]
        for pattern in website_patterns:
            for pdf_path in pdf_dir.glob(pattern):
                result = self.process_pdf(pdf_path, report_type="website")
                if result:
                    results.append(result)
        
        return results

# Example usage
if __name__ == "__main__":
    # Initialize extractor
    extractor = HMAReportExtractor()
    
    # Process individual PDFs
    # extractor.process_pdf("February Newsletter Report.pdf", "email", "February 2025")
    # extractor.process_pdf("April Website Analytics.pdf", "website", "April 2025")
    
    # Or process all PDFs in a directory
    # results = extractor.process_all_pdfs("/path/to/pdf/directory")
    
    print("PDF extraction complete!")
