"""
Email Extraction Script
Reads all text files from linkedin_posts directory, extracts emails using regex, and saves to CSV
"""

import os
import re
import csv
from datetime import datetime

def get_company_name_from_email(email):
    """
    Extract company name from email address.
    Returns the company name based on the domain.
    """
    if not email or '@' not in email:
        return "Unknown"
    
    # Extract domain from email
    domain = email.split('@')[1].lower()
    
    # Common personal email providers
    personal_email_providers = [
        'gmail.com', 'yahoo.com', 'yahoo.co.in', 'hotmail.com', 'outlook.com',
        'live.com', 'msn.com', 'aol.com', 'icloud.com', 'mail.com', 'protonmail.com',
        'yandex.com', 'zoho.com', 'rediffmail.com', 'inbox.com', 'gmx.com'
    ]
    
    # Check if it's a personal email provider
    if domain in personal_email_providers:
        return "Personal Email"
    
    # Extract company name from domain
    # Remove common TLDs and subdomains
    domain_parts = domain.split('.')
    
    # Remove TLD (last part) and common prefixes like 'www', 'mail', 'email'
    company_parts = []
    skip_prefixes = ['www', 'mail', 'email', 'smtp', 'pop', 'imap']
    
    for part in domain_parts[:-1]:  # Exclude TLD
        if part not in skip_prefixes:
            company_parts.append(part)
    
    if company_parts:
        # Take the main domain part (usually the first non-skipped part)
        company_name = company_parts[0]
        # Capitalize first letter of each word if it's a compound name
        # Handle camelCase or hyphenated names
        if '-' in company_name:
            company_name = ' '.join(word.capitalize() for word in company_name.split('-'))
        elif any(c.isupper() for c in company_name):
            # Already has capitalization, keep it
            pass
        else:
            # Capitalize first letter
            company_name = company_name.capitalize()
        
        return company_name
    
    return domain  # Fallback to domain if we can't extract company name

def extract_emails_from_posts(posts_dir="linkedin_posts", output_csv="extracted_emails.csv"):
    """Read all text files from posts directory, extract emails using regex, and save to CSV"""
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
    
    # Load existing emails if CSV file exists
    existing_emails = []
    all_emails_set = set()  # To track unique emails
    
    if os.path.exists(output_csv):
        print(f"  → Found existing CSV file: {output_csv}")
        try:
            with open(output_csv, 'r', encoding='utf-8') as f:
                reader = csv.DictReader(f)
                for row in reader:
                    email_addr = row.get("email", "").strip()
                    if email_addr:
                        all_emails_set.add(email_addr)
                        existing_emails.append({
                            "email": email_addr,
                            "company": row.get("company", get_company_name_from_email(email_addr)).strip()
                        })
                print(f"  → Loaded {len(existing_emails)} existing emails from CSV file")
        except Exception as e:
            print(f"  ⚠ Warning: Could not load existing CSV file: {str(e)}")
            print(f"  → Starting fresh")
    
    # List to store all emails (existing + new)
    all_emails_list = existing_emails.copy()
    new_emails_count = 0  # Track how many new emails were added
    extraction_date = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    
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
                        company_name = get_company_name_from_email(email)
                        all_emails_list.append({
                            "email": email,
                            "company": company_name
                        })
                        new_emails_count += 1
                    else:
                        print(f"      → Email '{email}' already exists, skipping...")
            else:
                print(f"    File {idx}/{len(text_files)} ({filename}): No emails found")
                
        except Exception as e:
            print(f"    ✗ ERROR processing file {filename}: {str(e)}")
            continue
    
    # Save to CSV file (overwrites but merges with existing)
    total_unique_emails = len(all_emails_set)
    print(f"\n  → Saving extracted emails to: {output_csv}")
    try:
        with open(output_csv, 'w', encoding='utf-8', newline='') as f:
            writer = csv.DictWriter(f, fieldnames=['email', 'company'])
            writer.writeheader()
            writer.writerows(all_emails_list)
        
        print(f"  ✓ Successfully saved {total_unique_emails} unique emails to '{output_csv}'")
        print(f"  → Processed {len(text_files)} files")
        print(f"  → New emails added: {new_emails_count}")
        print(f"  → Existing emails kept: {len(existing_emails)}")
        
        # Print summary
        print(f"\n" + "="*80)
        print("EMAIL EXTRACTION SUMMARY")
        print("="*80)
        print(f"  → Total files processed: {len(text_files)}")
        print(f"  → Total unique emails: {total_unique_emails}")
        print(f"  → New emails added: {new_emails_count}")
        print(f"  → Existing emails: {len(existing_emails)}")
        print(f"  → Output file: {output_csv}")
        print("="*80)
        
        return True
        
    except Exception as e:
        print(f"  ✗ ERROR saving CSV file: {str(e)}")
        return False

if __name__ == "__main__":
    extract_emails_from_posts()
