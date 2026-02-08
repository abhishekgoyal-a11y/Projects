# AirDNA Login Automation

This script automates the login process for AirDNA.

## Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Make sure you have Chrome browser installed and ChromeDriver set up.
   - Download ChromeDriver from https://chromedriver.chromium.org/
   - Or use `webdriver-manager` for automatic driver management (see alternative script below)

## Usage

Run the script:
```bash
python airdna_login.py
```

## Alternative: Using webdriver-manager (Recommended)

If you want automatic ChromeDriver management, install webdriver-manager:
```bash
pip install selenium webdriver-manager
```

Then modify the script to use:
```python
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager

driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()))
```

## Notes

- The script keeps the browser open after completion for verification
- Screenshots are saved on errors for debugging
- Adjust wait times if needed based on your internet speed
