# 🚀 Web Scraping Projects Collection

A collection of production-ready web scraping tools for e-commerce and social media data extraction. These projects automate data collection from Amazon and LinkedIn, transforming raw web data into structured, business-ready formats.

---

## 📋 Projects Overview

### 1. 🛒 [Amazon Product Intelligence Scraper](./AMAZONS/)
**Enterprise-grade Amazon product data collection system**

A comprehensive Python automation tool that scrapes Amazon product listings based on search queries and filters. Perfect for market research, price monitoring, and competitive analysis.

**Key Features:**
- 🔍 Multi-criteria filtering (price, brand, rating, stock status)
- 📊 Extracts 11+ data fields per product (title, price, rating, reviews, ASIN, variants, etc.)
- 🏗️ Production-ready architecture with error handling and retry logic
- 📁 Multiple output formats (CSV, JSON)
- ⚡ Handles 100k+ products efficiently
- 🛡️ Ethical scraping with rate limiting

**Tech Stack:** Python 3.10+, Playwright, Pandas, YAML config

**Use Cases:**
- Market intelligence and competitor analysis
- Price monitoring and tracking
- Product research and comparison
- Data-driven business insights

**Quick Start:**
```bash
cd AMAZONS
python3 run.py --search-keyword "laptop" --min-price 20000 --max-price 80000
```

📖 **[Full Documentation →](./AMAZONS/README.md)**

---

### 2. 💼 [LinkedIn Company Posts Scraper](./LINKEDIN/linkedin-company-posts-scraper/)
**Automated LinkedIn company post extraction tool**

A Python-based automation tool that scrapes LinkedIn company posts and saves them to CSV format. Automates login, navigation, and data extraction from company LinkedIn pages.

**Key Features:**
- 🔐 Secure login using environment variables
- 🤖 Fully automated post extraction with intelligent scrolling
- 📊 Structured CSV output (post number, time, text, likes)
- ⚠️ Security challenge handling (CAPTCHA support)
- 🎨 Non-headless mode for monitoring and debugging
- 📝 Detailed logging and progress tracking

**Tech Stack:** Python 3.7+, Selenium, WebDriver Manager

**Use Cases:**
- Market research and competitor content analysis
- Social media monitoring and tracking
- Content strategy analysis
- Engagement pattern research
- Business intelligence and reporting

**Quick Start:**
```bash
cd LINKEDIN/linkedin-company-posts-scraper
export LINKEDIN_EMAIL='your_email@example.com'
export LINKEDIN_PASSWORD='your_password'
python3 linkedin_company_post_scraper.py
```

📖 **[Full Documentation →](./LINKEDIN/linkedin-company-posts-scraper/README.md)**

---

### 3. 📧 [LinkedIn Post & Email Scraper](./LINKEDIN/linkedin-post-email-scraper/)
**LinkedIn post scraper with email extraction**

An automated tool that scrapes LinkedIn posts based on search terms and extracts email addresses from the post content. Useful for lead generation and contact discovery.

**Key Features:**
- 🔐 Secure login using environment variables
- 🔍 Keyword-based post search
- 📄 Post content extraction and saving
- 📧 Email address extraction from posts
- 💾 JSON output format for extracted emails
- 🔄 Duplicate email detection
- 📁 Organized file structure

**Tech Stack:** Python 3.7+, Selenium

**Use Cases:**
- Lead generation and prospecting
- Contact discovery from LinkedIn posts
- Email list building
- Social media research

**Quick Start:**
```bash
cd LINKEDIN/linkedin-post-email-scraper
export LINKEDIN_EMAIL='your_email@example.com'
export LINKEDIN_PASSWORD='your_password'
export LINKEDIN_SEARCH_TEXT='qa engineer jobs'  # Optional
python3 scrape_linkedin_posts.py
python3 extract_emails_from_posts.py
```

📖 **[Full Documentation →](./LINKEDIN/linkedin-post-email-scraper/README.md)**

---

### 4. 🏠 [AirDNA Market Data Scraper](./airdna/)
**Automated AirDNA market data extraction tool**

A Python-based automation tool using Selenium to extract comprehensive market data from AirDNA. Automates login, navigates through multiple markets, and extracts market scores, revenue, listings, and submarket information.

**Key Features:**
- 🔐 Automated login process
- 🏙️ Processes up to 20 markets automatically
- 📊 Comprehensive data extraction (overview, listings, submarkets)
- 📁 CSV export matching sample structure
- 💾 Incremental saves after each market
- 🛡️ Error handling with screenshots and detailed logging
- 👻 Headless mode support

**Tech Stack:** Python 3.9+, Selenium, WebDriver Manager

**Use Cases:**
- Real estate market research
- Investment property analysis
- Market intelligence and trends
- Competitive market analysis
- Data-driven investment decisions

**Quick Start:**
```bash
cd airdna
pip install -r requirements.txt
python3 airdna_login_improved.py
```

📖 **[Full Documentation →](./airdna/README.md)**

---

## 🎯 Project Comparison

| Feature | Amazon Scraper | LinkedIn Company Posts | LinkedIn Email Scraper | AirDNA Scraper |
|---------|---------------|------------------------|------------------------|---------------|
| **Platform** | Amazon | LinkedIn | LinkedIn | AirDNA |
| **Data Type** | Product listings | Company posts | Posts + Emails | Market data |
| **Output Format** | CSV, JSON | CSV | JSON | CSV |
| **Authentication** | Not required | Required (env vars) | Required (env vars) | Required (hardcoded) |
| **Browser** | Playwright | Selenium | Selenium | Selenium |
| **Scalability** | High (100k+ products) | Medium (company posts) | Medium (posts) | Medium (20 markets) |
| **Use Case** | E-commerce intelligence | Content analysis | Lead generation | Real estate research |

---

## 🔒 Security & Best Practices

### ✅ Security Features
- **Environment Variables**: All LinkedIn projects use environment variables for credentials
- **No Hardcoded Secrets**: No credentials are hardcoded in any project
- **Rate Limiting**: All projects include delays to respect server resources
- **Ethical Scraping**: Public data only, no private data access

### ⚠️ Security Notes
- **Always use environment variables** for sensitive credentials
- **Never commit credentials** to version control
- **Comply with Terms of Service** for all platforms
- **Validate credentials** before running scripts

---

## 📦 Installation Requirements

### Common Requirements
- **Python 3.7+** (Python 3.10+ recommended for Amazon scraper)
- **Chrome Browser** (for LinkedIn projects)
- **Internet Connection**

### Project-Specific Dependencies

**Amazon Scraper:**
```bash
pip install playwright pandas pyyaml loguru fake-useragent
playwright install chromium
```

**LinkedIn Company Posts:**
```bash
pip install selenium webdriver-manager
```

**LinkedIn Email Scraper:**
```bash
pip install -r requirements.txt
```

**AirDNA Scraper:**
```bash
pip install selenium webdriver-manager
```

---

## 🚀 Quick Start Guide

### 1. Amazon Product Scraper
```bash
cd AMAZONS
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
playwright install chromium
python3 run.py --search-keyword "laptop" --min-price 20000 --max-price 80000
```

### 2. LinkedIn Company Posts Scraper
```bash
cd LINKEDIN/linkedin-company-posts-scraper
pip install selenium webdriver-manager
export LINKEDIN_EMAIL='your_email@example.com'
export LINKEDIN_PASSWORD='your_password'
# Edit COMPANY_NAME in linkedin_company_post_scraper.py
python3 linkedin_company_post_scraper.py
```

### 3. LinkedIn Email Scraper
```bash
cd LINKEDIN/linkedin-post-email-scraper
pip install selenium webdriver-manager
export LINKEDIN_EMAIL='your_email@example.com'
export LINKEDIN_PASSWORD='your_password'
export LINKEDIN_SEARCH_TEXT='qa engineer jobs'  # Optional
python3 scrape_linkedin_posts.py
python3 extract_emails_from_posts.py
```

### 4. AirDNA Market Data Scraper
```bash
cd airdna
pip install -r requirements.txt
# Edit credentials in airdna_login_improved.py (lines 773, 795) if needed
python3 airdna_login_improved.py
```

---

## 📊 Output Examples

### Amazon Scraper Output
```csv
product_title,current_price,mrp,discount_percentage,rating,reviews_count,stock_status,product_url,asin
"Dell Inspiron 15 Laptop",45999.0,59999.0,23.33,4.5,1234,Available,https://amazon.in/dp/B08XYZ1234,B08XYZ1234
```

### LinkedIn Company Posts Output
```csv
post_number,post_time,post_text,likes_count
1,20h,"Learn how winter sports are driving local economies...",55
2,23h,"On 4 February, the National Center for APEC...",23
```

### LinkedIn Email Scraper Output
```json
{
  "emails": [
    "contact@example.com",
    "info@company.com"
  ],
  "total_emails": 2
}
```

### AirDNA Scraper Output
```csv
,Type,Market,Sub-Market,Type of Data,Data,URL
,Market,Montgomery,n/a,Market Score,100,https://app.airdna.co/data/us/airdna-314/overview
,Market,Montgomery,n/a,Annual Revenue,29047,https://app.airdna.co/data/us/airdna-314/overview
,Market,Montgomery,n/a,Annual Revenue Growth,+10%,https://app.airdna.co/data/us/airdna-314/overview
```

---

## ⚖️ Legal & Ethical Considerations

### ⚠️ Important Disclaimers

- **Educational & Legitimate Use Only**: These tools are designed for legitimate business intelligence and research purposes
- **Public Data Only**: All scrapers collect only publicly available information
- **Terms of Service**: Users are responsible for ensuring compliance with platform Terms of Service
- **Rate Limiting**: All projects include delays to respect server resources
- **No Warranty**: Use at your own risk

### ✅ Ethical Practices
- ✅ Public data collection only
- ✅ Built-in rate limiting and delays
- ✅ No authentication bypassing
- ✅ No CAPTCHA solving
- ✅ Transparent logging and audit trails

### 📋 Compliance Checklist
- [ ] Review and comply with platform Terms of Service
- [ ] Use appropriate delays between requests
- [ ] Respect robots.txt guidelines
- [ ] Consider official APIs for commercial use
- [ ] Consult legal counsel for commercial applications

---

## 📁 Project Structure

```
Projects/
├── README.md                                    # This file
├── AMAZONS/                                     # Amazon Product Scraper
│   ├── README.md
│   ├── run.py
│   ├── config/
│   ├── scraper/
│   └── outputs/
├── LINKEDIN/
│   ├── linkedin-company-posts-scraper/         # LinkedIn Company Posts
│   │   ├── README.md
│   │   ├── linkedin_company_post_scraper.py
│   │   └── visa_posts.csv
│   └── linkedin-post-email-scraper/            # LinkedIn Email Scraper
│       ├── README.md
│       ├── scrape_linkedin_posts.py
│       └── extract_emails_from_posts.py
└── airdna/                                      # AirDNA Market Data Scraper
    ├── README.md
    ├── airdna_login_improved.py
    ├── extracted_data.csv
    └── requirements.txt
```

---

## 🛠️ Maintenance & Support

### Common Issues

**Import Errors:**
- Ensure all dependencies are installed: `pip install -r requirements.txt`
- For Playwright: `playwright install chromium`

**Authentication Issues:**
- Verify environment variables are set correctly
- Check credentials are valid
- For LinkedIn: Handle security challenges manually if prompted

**No Data Found:**
- Check internet connection
- Verify search parameters are correct
- Run with visible browser (`--no-headless`) to debug
- Check if website structure has changed

### Getting Help

1. **Check Individual READMEs**: Each project has detailed documentation
2. **Review Logs**: Check log files for detailed error messages
3. **Debug Mode**: Run with visible browser to see what's happening
4. **Test Scripts**: Use provided test scripts for validation

---

## 📝 Notes

- **Browser Visibility**: LinkedIn projects run in non-headless mode for better debugging
- **Data Freshness**: Scraped data reflects the state at the time of scraping
- **Website Changes**: Web scrapers may need updates if website structures change
- **Scalability**: Amazon scraper is optimized for large-scale scraping (100k+ products)

---

## 🎯 Use Case Recommendations

### Choose Amazon Scraper if you need:
- Product price monitoring
- Market research and competitive analysis
- Large-scale product data collection
- Structured product information

### Choose LinkedIn Company Posts Scraper if you need:
- Company content analysis
- Social media monitoring
- Engagement pattern research
- Structured post data export

### Choose LinkedIn Email Scraper if you need:
- Lead generation from LinkedIn
- Contact discovery
- Email list building
- Post content analysis with email extraction

### Choose AirDNA Scraper if you need:
- Real estate market research
- Investment property analysis
- Market intelligence and trends
- Short-term rental market data
- Competitive market analysis

---

## 📄 License & Usage

These projects are provided for **legitimate business and research purposes**.

**Commercial Use**: Ensure compliance with all applicable terms of service and regulations.

**No Warranty**: Use at your own risk. The authors are not responsible for misuse or violations.

---

<div align="center">

**Built for data-driven decision making**

*Transform web data into business intelligence*

</div>
