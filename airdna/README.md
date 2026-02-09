# AirDNA Market Data Scraper

Automated Python script using Selenium to extract market data from AirDNA. The script logs in, navigates through multiple markets, and extracts comprehensive data including market scores, revenue, listings, and submarket information.

## Features

- **Automated Login**: Handles AirDNA login process automatically
- **Market Discovery**: Finds and processes up to 20 markets automatically
- **Comprehensive Data Extraction**:
  - Market overview data (score, revenue, revenue growth)
  - Listings data (count, growth rate)
  - Top submarkets data (location names and scores)
- **CSV Export**: Saves all extracted data in CSV format matching the sample structure
- **Incremental Saves**: Saves data after each market to prevent data loss
- **Error Handling**: Includes screenshots and detailed logging for debugging
- **Headless Mode**: Runs in headless mode by default (browser window not visible)

## Setup

### Prerequisites

- Python 3.9 or higher
- Chrome browser installed
- Internet connection

### Installation

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. The script uses `webdriver-manager` for automatic ChromeDriver management, so no manual ChromeDriver setup is required.

## Usage

Run the script:
```bash
python3 airdna_login_improved.py
```

### Credentials

The script uses hardcoded credentials:
- Email: `fivverabhishek@gmail.com`
- Password: `9wg!tgkZ!X5xV5b`

**Note**: To use different credentials, modify the script at lines 773 and 795.

## How It Works

The script performs the following steps:

1. **Initialization**: Sets up Chrome browser in headless mode with appropriate options
2. **Login Process**:
   - Opens `https://app.airdna.co/data`
   - Clicks "Log in" link
   - Fills in email and password
   - Submits the login form
3. **Market Discovery**:
   - Clicks "Find a Market" or navigates directly to market list
   - Waits for market links to load (handles dynamic content)
   - Finds up to 20 market links on the page
4. **Data Extraction** (for each market):
   - **Overview Page**: Extracts market score, annual revenue, and revenue growth percentage
   - **Listings Page**: Extracts total active listings count and growth rate
   - **Top Submarkets Page**: Extracts submarket count and all submarket locations with their scores
5. **Data Saving**: Saves data to CSV file after each market (incremental saves)

## Output Format

### CSV File Structure

The script generates `extracted_data.csv` with the following format:

| Type | Market | Sub-Market | Type of Data | Data | URL |
|------|--------|------------|--------------|------|-----|
| Market | Montgomery | n/a | Market Score | 100 | https://app.airdna.co/data/us/airdna-314/overview |
| Market | Montgomery | n/a | Annual Revenue | 29047 | https://app.airdna.co/data/us/airdna-314/overview |
| Market | Montgomery | n/a | Annual Revenue Growth | +10% | https://app.airdna.co/data/us/airdna-314/overview |
| Market | Montgomery | n/a | Total Active Listings | 518 | https://app.airdna.co/data/us/airdna-314/listings |
| Market | Montgomery | n/a | Total Active Listings; Growth Rate | +5% | https://app.airdna.co/data/us/airdna-314/listings |
| Sub-Market | Montgomery | Montgomery | Market Score | 100 | https://app.airdna.co/data/us/airdna-314/top-submarkets |

### Sample CSV Data

See [extracted_data.csv](extracted_data.csv) for sample output data.

### Data Fields Explained

**Market-Level Data:**
- **Market Score**: Overall market score (0-100)
- **Annual Revenue**: Annual revenue in numeric format (e.g., 29047 for $29,047 or 106000 for $106K)
- **Annual Revenue Growth**: Percentage change (e.g., +10%, -3%)
- **Total Active Listings**: Number of active listings
- **Total Active Listings; Growth Rate**: Percentage change in listings

**Sub-Market Data:**
- **Location**: Sub-market location name
- **Market Score**: Sub-market score (0-100 or "--" if not available)

## Important Points

### Configuration

- **Headless Mode**: Script runs in headless mode by default. To see the browser, remove `chrome_options.add_argument("--headless")` at line 642.
- **Market Count**: Default is 20 markets. To change, modify `count=20` at line 982.
- **Wait Times**: Script includes multiple wait strategies for dynamic content loading. Adjust wait times if needed based on your internet speed.

### Error Handling

- **Screenshots**: Error screenshots are saved as `error_screenshot.png` and `no_markets_error.png` for debugging
- **Incremental Saves**: Data is saved after each market, so partial data is preserved if the script stops
- **Detailed Logging**: All operations are logged with `[DEBUG]` and `[ERROR]` prefixes

### Browser Permissions

The script attempts to handle browser permission dialogs automatically, but some dialogs may still appear. The script will continue execution even if permission dialogs appear.

### Dynamic Content Loading

The script includes robust waiting strategies for:
- Page load completion
- Dynamic content rendering
- Market link appearance
- Loading spinner disappearance

## File Structure

```
airdna/
├── airdna_login_improved.py  # Main script
├── extracted_data.csv         # Output CSV file (generated)
├── error_screenshot.png       # Error screenshots (generated)
├── no_markets_error.png       # Error screenshots (generated)
├── requirements.txt           # Python dependencies
└── README.md                  # This file
```

## Dependencies

- `selenium>=4.15.0` - Web automation framework
- `webdriver-manager>=4.0.0` - Automatic ChromeDriver management

## Notes

- The script keeps the browser open for 10 seconds at the end for verification
- All operations include detailed debug logging
- CSV file is saved incrementally after each market to prevent data loss
- Revenue amounts are automatically converted to numeric format (removes $, commas, handles K suffix)
