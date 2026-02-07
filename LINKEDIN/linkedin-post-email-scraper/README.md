# LinkedIn Post Scraper

Automated tool to scrape LinkedIn posts based on search terms and extract email addresses with company name detection.

## 🎯 What it does

1. Logs into LinkedIn using secure credentials (environment variables)
2. Searches for posts using a configurable keyword
3. Filters results to show only Posts
4. Scrolls 30 times to load all posts dynamically
5. Extracts and saves each post to a separate text file
6. Extracts email addresses from saved posts using regex
7. Identifies company names from email domains
8. Saves results to CSV with email and company columns

## 📋 Requirements

- Python 3.7+
- Chrome browser
- Install dependencies: `pip3 install -r requirements.txt`

## 🚀 Installation

1. **Install required Python packages**
   ```bash
   pip install selenium webdriver-manager
   ```

2. **Set up environment variables**
   ```bash
   export LINKEDIN_EMAIL='your_email@example.com'
   export LINKEDIN_PASSWORD='your_password'
   export LINKEDIN_SEARCH_TEXT='qa engineer jobs'  # Optional: defaults to "qa engineer jobs"
   ```

   Or on Windows:
   ```cmd
   set LINKEDIN_EMAIL=your_email@example.com
   set LINKEDIN_PASSWORD=your_password
   set LINKEDIN_SEARCH_TEXT=qa engineer jobs
   ```

## 📖 Usage

### 1. Scrape LinkedIn Posts

```bash
python3 scrape_linkedin_posts.py
```

**Configuration:**
- **Credentials**: Set via environment variables (see Installation step 2)
- **Search Term**: Set `LINKEDIN_SEARCH_TEXT` environment variable or modify default in script
- **Output**: Posts are saved to `linkedin_posts/` directory (existing directory is deleted and recreated)
- **Browser Mode**: Runs in visible mode (non-headless) to allow manual challenge handling
- **Scrolling**: Scrolls 30 times to load all posts dynamically
- **Post Extraction**: Automatically clicks "more" buttons to expand truncated text

### 2. Extract Emails

```bash
python3 extract_emails_from_posts.py
```

**Output:**
- Emails saved to `extracted_emails.csv` (CSV format with `email` and `company` columns)
- Merges with existing CSV file (preserves previous emails)
- Skips duplicate emails automatically
- Extracts company names from email domains
- Identifies personal email providers (Gmail, Yahoo, etc.)
- Provides detailed progress output and summary statistics

## ⚙️ Configuration

### Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `LINKEDIN_EMAIL` | Your LinkedIn email address | Yes | - |
| `LINKEDIN_PASSWORD` | Your LinkedIn password | Yes | - |
| `LINKEDIN_SEARCH_TEXT` | Search keyword for posts | No | "qa engineer jobs" |

### Example Usage with Custom Search

```bash
export LINKEDIN_SEARCH_TEXT="python developer jobs"
python3 scrape_linkedin_posts.py
```

## 📁 Files

- `scrape_linkedin_posts.py` - Main scraper script (Selenium-based LinkedIn automation)
- `extract_emails_from_posts.py` - Email extraction script with company name detection
- `linkedin_posts/` - Directory with saved posts (auto-created, overwritten on each run)
- `extracted_emails.csv` - Extracted emails in CSV format with `email` and `company` columns

## 🔒 Security & Privacy

- **Credentials**: Uses environment variables - never hardcoded
- **Never commit credentials** to version control
- **Data**: Posts and emails are saved locally
- **LinkedIn Terms**: Ensure your usage complies with LinkedIn's Terms of Service

## 📝 Notes

- Runs in **non-headless mode** (browser visible) to allow manual challenge handling
- Scrolls **30 times** to load posts dynamically (configurable in code)
- Handles session timeouts and errors gracefully
- Removes duplicate posts automatically during extraction
- Email extraction uses regex pattern matching: `\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b`
- Company name extraction from email domains (identifies personal vs. business emails)
- CSV output preserves existing emails and only adds new unique ones
- Detailed progress logging for each step of the process
- Automatically expands truncated post text by clicking "more" buttons

## 🐛 Troubleshooting

### Error: "LinkedIn credentials not found!"
- Make sure you've set `LINKEDIN_EMAIL` and `LINKEDIN_PASSWORD` environment variables
- Verify credentials are correct

### No posts found
- Check if search term is correct
- Verify you're logged in successfully
- LinkedIn page structure may have changed

### No emails extracted
- Not all posts contain email addresses
- Check `linkedin_posts/` directory for scraped posts
- Verify email regex pattern matches your needs
- Check if CSV file exists and contains existing emails

### Email extraction features
- **Company Detection**: Automatically identifies company names from email domains
- **Personal Email Detection**: Recognizes common personal email providers (Gmail, Yahoo, Outlook, etc.)
- **Duplicate Prevention**: Skips emails that already exist in the CSV file
- **CSV Format**: Output includes `email` and `company` columns
- **Merge Mode**: Preserves existing emails when adding new ones
