# LinkedIn Company Posts Scraper

A Python-based automation tool that scrapes LinkedIn company posts and saves them to CSV format. This tool automates the process of logging into LinkedIn, navigating to a company's posts page, extracting post details (time, text, likes), and saving the data in a structured CSV file.

## 🎯 Project Purpose

This project is designed to:
- **Automate LinkedIn post extraction** from company pages
- **Collect post metadata** including publication time, content text, and engagement metrics (likes)
- **Export data to CSV** for further analysis, reporting, or data processing
- **Support research and analytics** on company social media content and engagement patterns

### Use Cases
- **Market Research**: Analyze competitor content strategies and engagement patterns
- **Content Analysis**: Study post frequency, topics, and audience engagement
- **Social Media Monitoring**: Track company announcements and updates
- **Data Collection**: Gather structured data for business intelligence and reporting
- **Trend Analysis**: Monitor industry trends through company posts

## ✨ Features

- 🔐 **Secure Login**: Uses environment variables for credentials
- 🤖 **Automated Scraping**: Fully automated post extraction with intelligent scrolling
- 📊 **Data Export**: Saves posts to CSV format with structured data
- 🔍 **Smart Scrolling**: Automatically scrolls to load more posts
- ⚠️ **Security Challenge Handling**: Manual intervention support for LinkedIn security checks
- 🎨 **Non-Headless Mode**: Visible browser for monitoring and debugging
- 📝 **Detailed Logging**: Comprehensive console output for tracking progress

## 📋 Requirements

### System Requirements
- Python 3.7 or higher
- Google Chrome browser installed
- macOS, Linux, or Windows

### Python Dependencies
```
selenium>=4.0.0
webdriver-manager>=3.8.0
```

## 🚀 Installation

1. **Clone or download this repository**
   ```bash
   cd linkedin-company-posts-scraper
   ```

2. **Install required Python packages**
   ```bash
   pip install selenium webdriver-manager
   ```

3. **Set up environment variables**
   ```bash
   export LINKEDIN_EMAIL='your_email@example.com'
   export LINKEDIN_PASSWORD='your_password'
   ```

   Or on Windows:
   ```cmd
   set LINKEDIN_EMAIL=your_email@example.com
   set LINKEDIN_PASSWORD=your_password
   ```

## 📖 Usage

### Basic Usage

1. **Set your LinkedIn credentials** (see Installation step 3)

2. **Configure the company name** in `linkedin_company_post_scraper.py`:
   ```python
   COMPANY_NAME = "visa"  # Change to your target company
   ```

3. **Run the script**:
   ```bash
   python3 linkedin_company_post_scraper.py
   ```

### What Happens During Execution

1. **Step 1**: Chrome browser opens (non-headless mode)
2. **Step 2**: Automatically logs into LinkedIn using your credentials
3. **Step 3**: Navigates to the company's posts page
4. **Step 4**: Scrolls and extracts all available posts
5. **Step 5**: Saves data to `{company_name}_posts.csv`

### Security Challenge Handling

If LinkedIn shows a security challenge (CAPTCHA, verification, etc.):
- The script will pause and wait for manual intervention
- Complete the security challenge in the browser window
- Press Enter in the terminal to continue
- The script will proceed with post extraction

## 📊 Output Format

The script generates a CSV file named `{company_name}_posts.csv` with the following columns:

| Column | Description | Example |
|--------|-------------|---------|
| `post_number` | Sequential number of the post | `1`, `2`, `3` |
| `post_time` | Time since post was published | `20h`, `2d`, `1w` |
| `post_text` | Full text content of the post | `"Learn how winter sports..."` |
| `likes_count` | Number of likes/reactions | `55`, `158`, `23` |

## 📈 Sample Data

Here's a sample of the extracted data from `visa_posts.csv`:

| post_number | post_time | post_text | likes_count |
|-------------|-----------|-----------|-------------|
| 1 | 20h | Learn how winter sports are driving local economies across Europe: https://lnkd.in/gYxdhZZA | 55 |
| 2 | 23h | On 4 February, the National Center for APEC (NCAPEC) convened the APEC Digital Economy Steering Group (DESG) workshop, "Combatting Online Fraud and Scams," on the margins of APEC SOM1 in Guangzhou.<br><br>With scams growing in scale and sophistication, the discussions underscored a shared urgency for:<br>🔹 Stronger public–private collaboration<br>🔹 Greater government‑to‑government interoperability<br>🔹 Coordinated cross‑border action<br>🔹 Better protection and capacity‑building for consumers and SMEs<br><br>Proud to see Wanjing Ji, Head of Ecosystem Risk at Visa Asia Pacific, contribute alongside leaders from PayPal, Standard Chartered, IMDA Singapore, PIPC Korea, Access Partnership, Meta, and the Global Anti‑Scam Alliance.<br><br>The workshop highlighted APEC's strength as a platform for practical, consensus‑based solutions, bringing together public‑ and private‑sector perspectives—including through engagement with the APEC Business Advisory Council (ABAC).<br><br>Visa remains committed to working closely with APEC economies, ABAC, industry partners, and the broader ecosystem to strengthen digital trust, enhance scam resilience, and protect consumers and businesses across Asia Pacific. | 23 |
| 3 | 2d | From first lift to last run, explore how consumers are spending on their winter breaks: https://lnkd.in/eu22Jrbn | 76 |
| 4 | 1w | Fans across the globe are ready to embrace winter sports like never before, so what does this mean for local economies? Find out: https://lnkd.in/evmeB4PT | 158 |
| 5 | 2d | In the second edition of In Conversation, Kunal Chatterjee, Head of Acceptance Sales for VAS at Visa Asia Pacific spoke with Sisca Margaretta Elliott about what he believes has changed dramatically about payments in the last few years: how people pay, and in turn, how merchants accept payments.<br><br>The way people transact today is diverse and omnichannel: with a tap of their cards, mobile phones, and wearables like smartwatches. Currencies are also evolving with digital currencies, gaming credits, and more becoming part of the fabric of digital transactions. | 89 |

## ⚙️ Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `LINKEDIN_EMAIL` | Your LinkedIn email address | Yes |
| `LINKEDIN_PASSWORD` | Your LinkedIn password | Yes |

### Script Configuration

Edit `linkedin_company_post_scraper.py` to customize:

```python
# Company settings (line 22)
COMPANY_NAME = "visa"  # Change to target company name

# Scrolling settings (line 217)
num_scrolls = 3  # Number of scroll attempts to load more posts
```

## 📁 Project Structure

```
linkedin-company-posts-scraper/
├── linkedin_company_post_scraper.py      # Main script
├── visa_posts.csv         # Sample output file
├── README.md              # This file
└── .gitignore            # Git ignore file
```

## 🔒 Security & Privacy

- **Credentials**: Never commit credentials to version control
- **Environment Variables**: Always use environment variables for sensitive data
- **Data**: CSV files may contain public information; handle responsibly
- **LinkedIn Terms**: Ensure your usage complies with LinkedIn's Terms of Service

## 📝 Notes

- The script runs in **non-headless mode** (browser is visible) for better debugging and security challenge handling
- Posts are extracted from the company's public posts page
- The script overwrites existing CSV files with the same company name
- Scrolling behavior may vary based on LinkedIn's page structure

## 🤝 Contributing

Feel free to submit issues, fork the repository, and create pull requests for any improvements.
