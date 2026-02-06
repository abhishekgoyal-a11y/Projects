"""
Email Extraction Script
Reads all text files from linkedin_posts directory, extracts emails using regex, and saves to JSON
"""

import os
import re
import json
from datetime import datetime

def extract_emails_from_posts(posts_dir="linkedin_posts", output_json="extracted_emails.json"):
    """Read all text files from posts directory, extract emails using regex, and save to JSON"""
    print("\n" + "="*80)
    print("EXTRACTING EMAILS FROM POSTS")
    print("="*80)
    
    if not os.path.exists(posts_dir):
        print(f"  ✗ ERROR: Directory '{posts_dir}' does not exist.")
        return False
    
    # Email regex pattern
    email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
    
    # Get all text files from the directory
    print(f"  → Reading text files from: {posts_dir}")
    text_files = [f for f in os.listdir(posts_dir) if f.endswith('.txt')]
    text_files.sort()  # Sort for consistent ordering
    
    if not text_files:
        print(f"  ✗ ERROR: No text files found in '{posts_dir}' directory.")
        return False
    
    print(f"  → Found {len(text_files)} text files")
    
    # Dictionary to store emails with metadata
    emails_data = {
        "extraction_date": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "total_files_processed": len(text_files),
        "total_unique_emails": 0,
        "emails": []
    }
    
    all_emails_set = set()  # To track unique emails
    
    print(f"\n  → Processing files...")
    for idx, filename in enumerate(text_files, 1):
        filepath = os.path.join(posts_dir, filename)
        
        try:
            # Read the file
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Find all emails in the content
            found_emails = re.findall(email_pattern, content)
            
            # Remove duplicates from this file
            unique_emails_in_file = list(set(found_emails))
            
            if unique_emails_in_file:
                print(f"    File {idx}/{len(text_files)} ({filename}): Found {len(unique_emails_in_file)} email(s)")
                
                for email in unique_emails_in_file:
                    if email not in all_emails_set:
                        all_emails_set.add(email)
                        emails_data["emails"].append({
                            "email": email,
                            "source_file": filename
                        })
            else:
                print(f"    File {idx}/{len(text_files)} ({filename}): No emails found")
                
        except Exception as e:
            print(f"    ✗ ERROR processing file {filename}: {str(e)}")
            continue
    
    # Update total unique emails count
    emails_data["total_unique_emails"] = len(all_emails_set)
    
    # Save to JSON file
    print(f"\n  → Saving extracted emails to: {output_json}")
    try:
        with open(output_json, 'w', encoding='utf-8') as f:
            json.dump(emails_data, f, indent=2, ensure_ascii=False)
        
        print(f"  ✓ Successfully saved {emails_data['total_unique_emails']} unique emails to '{output_json}'")
        print(f"  → Processed {emails_data['total_files_processed']} files")
        
        # Print summary
        print(f"\n" + "="*80)
        print("EMAIL EXTRACTION SUMMARY")
        print("="*80)
        print(f"  → Total files processed: {emails_data['total_files_processed']}")
        print(f"  → Total unique emails found: {emails_data['total_unique_emails']}")
        print(f"  → Output file: {output_json}")
        print("="*80)
        
        return True
        
    except Exception as e:
        print(f"  ✗ ERROR saving JSON file: {str(e)}")
        return False

if __name__ == "__main__":
    extract_emails_from_posts()
