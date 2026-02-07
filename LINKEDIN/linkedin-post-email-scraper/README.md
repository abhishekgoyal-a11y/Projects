# LinkedIn Post Scraper

Automated tool to scrape LinkedIn posts based on search terms and extract email addresses.

## 🎯 What it does

1. Logs into LinkedIn using secure credentials
2. Searches for posts using a keyword
3. Scrolls to load all posts
4. Extracts and saves each post to a text file
5. Extracts email addresses from saved posts

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
- **Output**: Posts are saved to `linkedin_posts/` directory

### 2. Extract Emails

```bash
python3 extract_emails_from_posts.py
```

**Output:**
- Emails saved to `extracted_emails.json`
- Appends new emails (skips duplicates)
- Includes metadata: extraction date, source file, total count

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

- `scrape_linkedin_posts.py` - Main scraper script
- `extract_emails_from_posts.py` - Email extraction script
- `linkedin_posts/` - Directory with saved posts (auto-created)
- `extracted_emails.json` - Extracted emails in JSON format

## 🔒 Security & Privacy

- **Credentials**: Uses environment variables - never hardcoded
- **Never commit credentials** to version control
- **Data**: Posts and emails are saved locally
- **LinkedIn Terms**: Ensure your usage complies with LinkedIn's Terms of Service

## 📝 Notes

- Runs in **headless mode** by default (browser not visible)
- Scrolls 30 times to load posts (configurable in code)
- Handles session timeouts and errors gracefully
- Removes duplicate posts automatically
- Email extraction uses regex pattern matching

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
