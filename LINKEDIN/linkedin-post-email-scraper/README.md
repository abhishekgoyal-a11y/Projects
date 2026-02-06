# LinkedIn Post Scraper

Automated tool to scrape LinkedIn posts based on search terms and extract email addresses.

## What it does

1. Logs into LinkedIn
2. Searches for posts using a keyword
3. Scrolls to load all posts
4. Extracts and saves each post to a text file
5. Extracts email addresses from saved posts

## Requirements

- Python 3.7+
- Chrome browser
- Install dependencies: `pip3 install -r requirements.txt`

## Usage

### 1. Scrape LinkedIn Posts

```bash
python3 scrape_linkedin_posts.py
```

**Configuration:**
- Edit `SEARCH_TEXT` in `scrape_linkedin_posts.py` to change search term
- Edit `EMAIL` and `PASSWORD` for your LinkedIn credentials
- Posts are saved to `linkedin_posts/` directory

### 2. Extract Emails

```bash
python3 extract_emails_from_posts.py
```

**Output:**
- Emails saved to `extracted_emails.json`
- Appends new emails (skips duplicates)

## Files

- `scrape_linkedin_posts.py` - Main scraper script
- `extract_emails_from_posts.py` - Email extraction script
- `linkedin_posts/` - Directory with saved posts (auto-created)
- `extracted_emails.json` - Extracted emails in JSON format

## Notes

- Runs in headless mode by default
- Scrolls 50 times to load posts
- Handles session timeouts and errors gracefully
