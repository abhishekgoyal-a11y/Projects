# LinkedIn Login and Search Automation

This project automates LinkedIn login and search functionality using Python and Selenium.

## Prerequisites

1. Python 3.7 or higher
2. Chrome browser installed
3. ChromeDriver (will be managed automatically if using webdriver-manager)

## Installation

1. Install the required packages:
```bash
pip3 install -r requirements.txt
```

## Usage

### Basic Login Only

Run the script without search:
```bash
python3 linkedin_login.py
```
When prompted, press Enter to skip search.

### Login and Search

**Option 1:** Set search text in the script
Edit `linkedin_login.py` and set the `SEARCH_TEXT` variable at the top:
```python
SEARCH_TEXT = "Python developer"
```

Then run:
```bash
python3 linkedin_login.py
```

**Option 2:** Enter search term when prompted
```bash
python3 linkedin_login.py
```
When prompted, enter your search term.

### Programmatic Usage

You can also use the functions programmatically:

```python
from linkedin_login import login_to_linkedin, search_linkedin, login_and_search

# Login and search in one go
login_and_search("Python developer")

# Or login first, then search
driver = login_to_linkedin(close_browser=False)
if driver:
    search_linkedin(driver, "Python developer")
    driver.quit()
```

## Features

The script will:
1. Open Chrome browser
2. Navigate to LinkedIn login page
3. Enter your email and password
4. Click the Sign in button
5. Wait for login to complete
6. (Optional) Search for the specified term
7. Display search results

## Notes

- The script uses Chrome browser by default
- Make sure ChromeDriver is compatible with your Chrome version
- LinkedIn may show CAPTCHA or require additional verification
- The search function uses multiple selectors to reliably find the search input field
- Browser stays open for a few seconds after operations to view results
