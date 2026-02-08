from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException
import time

def login_to_airdna():
    """
    Automated login script for AirDNA
    Steps:
    1. Open https://app.airdna.co/data
    2. Click on 'Log in' link
    3. Fill in email and password
    4. Submit the form
    5. Click on 'Find a Market' element
    """
    
    # Initialize the driver (using Chrome in non-headless mode - browser window will be visible)
    print("Initializing Chrome driver...")
    chrome_options = Options()
    chrome_options.add_argument("--window-size=1920,1080")
    
    driver = webdriver.Chrome(options=chrome_options)
    driver.maximize_window()
    
    try:
        # Step 1: Open the URL
        print("Step 1: Opening https://app.airdna.co/data...")
        driver.get("https://app.airdna.co/data")
        
        # Wait a bit for page to load
        time.sleep(2)
        
        # Step 2: Click on the "Log in" link
        print("Step 2: Clicking on 'Log in' link...")
        wait = WebDriverWait(driver, 10)
        
        # Find the login link by partial link text or by class
        login_link = wait.until(
            EC.element_to_be_clickable((By.LINK_TEXT, "Log in"))
        )
        login_link.click()
        
        # Wait for the login form to appear
        print("Waiting for login form to load...")
        time.sleep(3)
        
        # Step 3: Fill in email
        print("Step 3: Filling in email...")
        email_field = wait.until(
            EC.presence_of_element_located((By.ID, "loginId"))
        )
        email_field.clear()
        email_field.send_keys("fivverabhishek@gmail.com")
        
        # Wait a moment for validation
        time.sleep(1)
        
        # Fill in password
        print("Filling in password...")
        password_field = wait.until(
            EC.presence_of_element_located((By.ID, "password"))
        )
        password_field.clear()
        password_field.send_keys("9wg!tgkZ!X5xV5b")
        
        # Wait for button to be enabled (validation happens on input)
        print("Waiting for submit button to be enabled...")
        submit_button = wait.until(
            EC.element_to_be_clickable((By.ID, "submit-button"))
        )
        
        # Step 4: Click submit
        print("Step 4: Clicking submit button...")
        submit_button.click()
        
        # Wait for navigation/loading
        print("Waiting for login to complete...")
        time.sleep(5)
        
        print("Login process completed!")
        
        # Step 5: Click on "Find a Market"
        print("Step 5: Clicking on 'Find a Market'...")
        time.sleep(3)  # Wait for page to fully load after login
        
        # Try multiple strategies to find the "Find a Market" element
        try:
            # Strategy 1: Find by XPath with text content
            find_market_element = wait.until(
                EC.element_to_be_clickable((By.XPATH, "//p[contains(text(), 'Find a Market')]"))
            )
        except TimeoutException:
            try:
                # Strategy 2: Find by CSS class and text
                find_market_element = wait.until(
                    EC.element_to_be_clickable((By.XPATH, "//p[@class='MuiTypography-root MuiTypography-caption MuiListItemText-primary css-14ds26f' and contains(text(), 'Find a Market')]"))
                )
            except TimeoutException:
                # Strategy 3: Find by partial class name
                find_market_element = wait.until(
                    EC.element_to_be_clickable((By.XPATH, "//p[contains(@class, 'MuiListItemText-primary') and contains(text(), 'Find a Market')]"))
                )
        
        # Scroll into view if needed
        driver.execute_script("arguments[0].scrollIntoView(true);", find_market_element)
        time.sleep(0.5)
        find_market_element.click()
        
        print("Successfully clicked on 'Find a Market'!")
        time.sleep(3)  # Wait for navigation/loading
        
        # Take a screenshot for verification
        print("Taking screenshot of final page...")
        driver.save_screenshot("find_market_success.png")
        print("Screenshot saved as find_market_success.png")
        
        # Keep browser open for verification (you can see the result)
        print("Browser will stay open for 10 seconds for verification...")
        time.sleep(10)
        
    except TimeoutException as e:
        print(f"Timeout error: {e}")
        print("Taking a screenshot for debugging...")
        driver.save_screenshot("error_screenshot.png")
        
    except Exception as e:
        print(f"An error occurred: {e}")
        driver.save_screenshot("error_screenshot.png")
        
    finally:
        print("Closing browser in 5 seconds...")
        time.sleep(5)
        driver.quit()

if __name__ == "__main__":
    login_to_airdna()
