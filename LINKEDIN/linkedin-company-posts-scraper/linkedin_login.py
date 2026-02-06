from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.action_chains import ActionChains
from webdriver_manager.chrome import ChromeDriverManager
import time
import os
import csv
import random
from datetime import datetime

# LinkedIn login credentials
EMAIL = "fivverabhishek@gmail.com"
PASSWORD = "abhi1234@1234"
LOGIN_URL = "https://www.linkedin.com/login?fromSignIn=true&trk=guest_homepage-basic_nav-header-signin"

# Company settings
COMPANY_NAME = "visa"  # Company name for CSV file naming

def setup_driver():
    """Setup Chrome driver with options - NON-HEADLESS MODE"""
    print("\n" + "="*80)
    print("STEP 1: Setting up Chrome WebDriver")
    print("="*80)
    print("  → Creating Chrome options...")
    chrome_options = Options()
    # Running in NON-headless mode (browser window will be visible)
    # chrome_options.add_argument("--headless=new")  # COMMENTED OUT FOR NON-HEADLESS MODE
    print("  → Adding Chrome options (no-sandbox, disable automation detection)...")
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")
    chrome_options.add_argument("--disable-blink-features=AutomationControlled")
    chrome_options.add_argument("--disable-gpu")
    chrome_options.add_argument("--window-size=1920,1080")
    chrome_options.add_argument("--user-agent=Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36")
    chrome_options.add_experimental_option("excludeSwitches", ["enable-automation"])
    chrome_options.add_experimental_option('useAutomationExtension', False)
    
    print("  → Installing/Checking ChromeDriver...")
    # Initialize the driver with automatic ChromeDriver management
    service = Service(ChromeDriverManager().install())
    print("  → Initializing Chrome browser...")
    driver = webdriver.Chrome(service=service, options=chrome_options)
    print("  → Maximizing browser window...")
    driver.maximize_window()
    print("  ✓ Chrome driver setup complete!")
    return driver

def login_to_linkedin(close_browser=True):
    """Automate LinkedIn login
    
    Args:
        close_browser: If True, closes browser after login. If False, returns driver for further use.
    """
    driver = None
    try:
        print("\n" + "="*80)
        print("STEP 2: LinkedIn Login Process")
        print("="*80)
        driver = setup_driver()
        
        print(f"\n  → Navigating to LinkedIn login page...")
        print(f"     URL: {LOGIN_URL}")
        driver.get(LOGIN_URL)
        print("  → Page loaded, waiting for elements...")
        
        # Wait for the page to load
        wait = WebDriverWait(driver, 20)
        
        # Wait for and find the email/username input field
        print("  → Looking for email input field (ID: 'username')...")
        email_input = wait.until(
            EC.presence_of_element_located((By.ID, "username"))
        )
        print("  ✓ Email input field found!")
        
        # Enter email
        print(f"  → Clearing email field...")
        email_input.clear()
        print(f"  → Entering email: {EMAIL}")
        email_input.send_keys(EMAIL)
        time.sleep(1)
        print("  ✓ Email entered successfully!")
        
        # Wait for and find the password input field
        print("  → Looking for password input field (ID: 'password')...")
        password_input = wait.until(
            EC.presence_of_element_located((By.ID, "password"))
        )
        print("  ✓ Password input field found!")
        
        # Enter password
        print("  → Clearing password field...")
        password_input.clear()
        print("  → Entering password...")
        password_input.send_keys(PASSWORD)
        time.sleep(1)
        print("  ✓ Password entered successfully!")
        
        # Find and click the Sign in button
        print("  → Looking for Sign in button...")
        signin_button = wait.until(
            EC.element_to_be_clickable((By.CSS_SELECTOR, "button[type='submit'][aria-label='Sign in']"))
        )
        print("  → Clicking Sign in button...")
        signin_button.click()
        print("  ✓ Sign in button clicked!")
        
        print("  → Waiting for login to process (5 seconds)...")
        time.sleep(5)
        
        # Check if login was successful by checking the current URL
        current_url = driver.current_url
        print(f"  → Current URL after login: {current_url}")
        
        if "feed" in current_url or "linkedin.com/in/" in current_url or current_url == "https://www.linkedin.com/":
            print("  ✓ Login successful! Redirected to LinkedIn feed/profile.")
        else:
            print("  ⚠ Login status unclear. Please check manually.")
        
        # Don't close browser here - return driver for further use
        print("  ✓ Login process complete! Ready for next steps.")
        
        if close_browser:
            print("  → Keeping browser open for 10 seconds...")
            time.sleep(10)
            print("  → Closing browser...")
            driver.quit()
            return None
        else:
            return driver
        
    except Exception as e:
        print(f"\n  ✗ ERROR: An error occurred during login: {str(e)}")
        import traceback
        traceback.print_exc()
        if driver:
            print("  → Keeping browser open for 10 seconds to debug...")
            time.sleep(10)
            driver.quit()
        return None

def navigate_to_visa_posts(driver):
    """Navigate directly to Visa company Posts page
    
    Args:
        driver: Selenium WebDriver instance
    """
    if not driver:
        print("  ✗ ERROR: Driver is not available. Please login first.")
        return False
    
    try:
        print("\n" + "="*80)
        print("STEP 3: Navigating to Visa Company Posts Page")
        print("="*80)
        
        # Navigate directly to the Posts URL
        posts_url = "https://www.linkedin.com/company/visa/posts/?feedView=all"
        print(f"  → Navigating directly to Visa Posts page...")
        print(f"     URL: {posts_url}")
        driver.get(posts_url)
        print("  → Page loaded, waiting for content...")
        time.sleep(5)
        
        current_url = driver.current_url
        print(f"  → Current URL: {current_url}")
        
        if "posts" in current_url.lower():
            print("  ✓ Successfully navigated to Posts page!")
        else:
            print("  ⚠ Posts page status unclear. Please check manually.")
        
        return True
        
    except Exception as e:
        print(f"\n  ✗ ERROR: An error occurred while navigating to Posts: {str(e)}")
        import traceback
        traceback.print_exc()
        return False

def extract_post_details(driver, company_name=None):
    """Extract details from all available posts and save to a CSV file
    
    Args:
        driver: Selenium WebDriver instance
        company_name: Company name for CSV file naming (default: uses COMPANY_NAME constant)
    
    Returns:
        List of dictionaries containing post details
    """
    if company_name is None:
        company_name = COMPANY_NAME
    
    csv_filename = f"{company_name}_posts.csv"
    if not driver:
        print("  ✗ ERROR: Driver is not available. Please login first.")
        return []
    
    try:
        print("\n" + "="*80)
        print("STEP 4: Extracting Post Details")
        print("="*80)
        wait = WebDriverWait(driver, 20)
        
        # Wait for posts to load
        print("\n  → Waiting for posts to load (3 seconds)...")
        time.sleep(3)
        print("  ✓ Wait complete!")
        
        # Scroll to load more posts (similar to reference file)
        print("\n  → Scrolling to load more posts...")
        num_scrolls = 3  # Scroll 10 times to ensure we get at least 5 posts
        
        for scroll_num in range(1, num_scrolls + 1):
            print(f"\n    Scroll #{scroll_num}/{num_scrolls}:")
            
            # Get current scroll position and page height
            current_scroll = driver.execute_script("return window.pageYOffset;")
            page_height = driver.execute_script("return document.body.scrollHeight;")
            doc_height = driver.execute_script("return document.documentElement.scrollHeight;")
            window_height = driver.execute_script("return window.innerHeight;")
            
            print(f"      → Current scroll position: {current_scroll}px")
            print(f"      → document.body.scrollHeight: {page_height}px")
            print(f"      → document.documentElement.scrollHeight: {doc_height}px")
            print(f"      → Window height: {window_height}px")
            
            # Try to find scrollable containers (LinkedIn often uses scrollable divs)
            print("      → Looking for scrollable containers...")
            try:
                # Try to find main scrollable container
                scrollable_containers = driver.execute_script("""
                    var containers = [];
                    var allElements = document.querySelectorAll('*');
                    for (var i = 0; i < allElements.length; i++) {
                        var el = allElements[i];
                        var style = window.getComputedStyle(el);
                        if (style.overflowY === 'auto' || style.overflowY === 'scroll' || 
                            style.overflow === 'auto' || style.overflow === 'scroll') {
                            if (el.scrollHeight > el.clientHeight) {
                                containers.push({
                                    element: el,
                                    scrollHeight: el.scrollHeight,
                                    clientHeight: el.clientHeight,
                                    scrollTop: el.scrollTop
                                });
                            }
                        }
                    }
                    return containers;
                """)
                
                if scrollable_containers:
                    print(f"      → Found {len(scrollable_containers)} scrollable container(s)")
                    # Scroll the largest scrollable container
                    largest_container = max(scrollable_containers, key=lambda x: x['scrollHeight'])
                    print(f"      → Largest container: scrollHeight={largest_container['scrollHeight']}px, clientHeight={largest_container['clientHeight']}px")
                    
                    # Scroll within this container
                    driver.execute_script("arguments[0].scrollTop = arguments[0].scrollHeight;", largest_container['element'])
                    time.sleep(0.5)
                    new_scroll_top = driver.execute_script("return arguments[0].scrollTop;", largest_container['element'])
                    print(f"      → Scrolled container to: {new_scroll_top}px")
                else:
                    print("      → No scrollable containers found, using window scroll")
            except Exception as e:
                print(f"      → Error finding containers: {str(e)}")
            
            # Try multiple window scrolling methods
            print("      → Method 1: Scrolling window to document.body.scrollHeight...")
            driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
            time.sleep(0.5)
            
            # Check if we actually scrolled
            new_scroll = driver.execute_script("return window.pageYOffset;")
            if new_scroll == current_scroll:
                print("      → Method 1 didn't work, trying document.documentElement.scrollHeight...")
                driver.execute_script("window.scrollTo(0, document.documentElement.scrollHeight);")
                time.sleep(0.5)
                new_scroll = driver.execute_script("return window.pageYOffset;")
            
            # Try scrolling by window height increments
            if new_scroll == current_scroll:
                print("      → Trying incremental scroll (current + window_height)...")
                scroll_amount = current_scroll + window_height
                driver.execute_script(f"window.scrollTo(0, {scroll_amount});")
                time.sleep(0.5)
                new_scroll = driver.execute_script("return window.pageYOffset;")
            
            # Try using Keys.PAGE_DOWN and END
            if new_scroll == current_scroll:
                print("      → Trying keyboard scrolling (Page Down + End)...")
                body = driver.find_element(By.TAG_NAME, "body")
                body.send_keys(Keys.PAGE_DOWN)
                time.sleep(0.5)
                body.send_keys(Keys.PAGE_DOWN)
                time.sleep(0.5)
                body.send_keys(Keys.END)
                time.sleep(0.5)
                new_scroll = driver.execute_script("return window.pageYOffset;")
            
            # Try ActionChains for more reliable scrolling
            if new_scroll == current_scroll:
                print("      → Trying ActionChains scroll...")
                actions = ActionChains(driver)
                actions.send_keys(Keys.PAGE_DOWN).perform()
                time.sleep(0.5)
                actions.send_keys(Keys.PAGE_DOWN).perform()
                time.sleep(0.5)
                actions.send_keys(Keys.END).perform()
                time.sleep(0.5)
                new_scroll = driver.execute_script("return window.pageYOffset;")
            
            print(f"      → New scroll position: {new_scroll}px")
            print(f"      → Scrolled: {new_scroll - current_scroll}px")
            
            # Wait for content to load (random between 2 and 3 seconds)
            wait_time = round(random.uniform(2, 3), 1)
            print(f"      → Waiting {wait_time} seconds for content to load...")
            time.sleep(wait_time)
            
            # Check new page height after scroll
            new_page_height = driver.execute_script("return document.body.scrollHeight;")
            new_doc_height = driver.execute_script("return document.documentElement.scrollHeight;")
            if new_page_height > page_height or new_doc_height > doc_height:
                print(f"      → Page height increased! body: {page_height}px → {new_page_height}px, docElement: {doc_height}px → {new_doc_height}px")
            else:
                print(f"      → Page height unchanged: body={new_page_height}px, docElement={new_doc_height}px")
            
            print(f"      ✓ Scroll #{scroll_num} complete!")
        
        print(f"\n  ✓ Scroll process complete! Scrolled {num_scrolls} times.")
        print("  → Final wait (2 seconds) to ensure all content is loaded...")
        time.sleep(2)
        
        # Find all post containers after scrolling
        print("\n  → Looking for post containers...")
        print("    → Using selector: div.fie-impression-container")
        post_containers = driver.find_elements(By.CSS_SELECTOR, "div.fie-impression-container")
        
        if not post_containers:
            print("    → No posts found with first selector, trying alternative...")
            # Try alternative selector - sometimes posts are in different containers
            post_containers = driver.find_elements(By.CSS_SELECTOR, "div[class*='fie-impression-container']")
        
        print(f"  → Found {len(post_containers)} post container(s)")
        
        if len(post_containers) == 0:
            print("  ✗ ERROR: No posts found on the page.")
            return []
        
        # Extract all available posts
        posts_to_extract = len(post_containers)
        print(f"  → Extracting details from all {posts_to_extract} post(s)...")
        
        extracted_posts = []
        
        for idx in range(posts_to_extract):
            try:
                print(f"\n  Processing Post #{idx + 1}:")
                container = post_containers[idx]
                
                # Scroll into view
                print("    → Scrolling post into view...")
                driver.execute_script("arguments[0].scrollIntoView({behavior: 'smooth', block: 'center'});", container)
                time.sleep(1)
                
                post_data = {
                    "post_number": idx + 1,
                    "post_time": "",
                    "post_text": "",
                    "likes_count": ""
                }
                
                # Extract post time/details
                print("    → Extracting post time...")
                try:
                    # Try multiple selectors for time
                    time_selectors = [
                        "span.update-components-actor__sub-description",
                        "span[class*='update-components-actor__sub-description']",
                        "span.text-body-xsmall.t-black--light"
                    ]
                    
                    time_element = None
                    for selector in time_selectors:
                        try:
                            time_element = container.find_element(By.CSS_SELECTOR, selector)
                            if time_element and time_element.text.strip():
                                break
                        except:
                            continue
                    
                    if time_element:
                        time_text = time_element.text.strip()
                        # Extract just the time part (e.g., "9h")
                        # The time is usually at the start, before "•"
                        if "•" in time_text:
                            time_text = time_text.split("•")[0].strip()
                        post_data["post_time"] = time_text
                        print(f"      ✓ Found time: {time_text}")
                    else:
                        print("      ⚠ Time not found")
                except Exception as e:
                    print(f"      ⚠ Could not extract time: {str(e)}")
                
                # Extract post text
                print("    → Extracting post text...")
                try:
                    # Try to find the "more" button and click it to expand text
                    try:
                        more_button = container.find_element(By.CSS_SELECTOR, "button.feed-shared-inline-show-more-text__see-more-less-toggle")
                        if more_button and ("more" in more_button.text.lower() or "…" in more_button.text):
                            print("      → Found 'more' button, clicking to expand...")
                            driver.execute_script("arguments[0].click();", more_button)
                            time.sleep(1)
                            print("      ✓ Text expanded!")
                    except:
                        pass  # No "more" button, text is already expanded
                    
                    # Try multiple selectors for post text
                    text_selectors = [
                        "span.break-words.tvm-parent-container",
                        "span[class*='break-words'][class*='tvm-parent-container']",
                        "div.update-components-text",
                        "span[dir='ltr']"
                    ]
                    
                    text_element = None
                    for selector in text_selectors:
                        try:
                            text_element = container.find_element(By.CSS_SELECTOR, selector)
                            if text_element and text_element.text.strip():
                                break
                        except:
                            continue
                    
                    if text_element:
                        post_text = text_element.text.strip()
                        # Clean up the text (remove extra whitespace) but preserve line breaks
                        # Don't join all lines - keep the structure
                        post_data["post_text"] = post_text
                        print(f"      ✓ Found text ({len(post_text)} characters)")
                    else:
                        print("      ⚠ Text not found")
                        post_text = ""
                except Exception as e:
                    print(f"      ⚠ Could not extract text: {str(e)}")
                
                # Extract likes count
                print("    → Extracting likes count...")
                try:
                    likes_selectors = [
                        "span.social-details-social-counts__reactions-count",
                        "span[class*='social-details-social-counts__reactions-count']",
                        "button[aria-label*='reactions'] span"
                    ]
                    
                    likes_element = None
                    for selector in likes_selectors:
                        try:
                            likes_element = container.find_element(By.CSS_SELECTOR, selector)
                            if likes_element and likes_element.text.strip():
                                break
                        except:
                            continue
                    
                    if likes_element:
                        likes_text = likes_element.text.strip()
                        # Extract just the number
                        likes_count = likes_text
                        post_data["likes_count"] = likes_count
                        print(f"      ✓ Found likes: {likes_count}")
                    else:
                        print("      ⚠ Likes count not found")
                except Exception as e:
                    print(f"      ⚠ Could not extract likes: {str(e)}")
                
                # Add post to list (will save to CSV at the end)
                extracted_posts.append(post_data)
                print(f"    ✓ Post #{idx + 1} extraction complete!")
                
            except Exception as e:
                print(f"    ✗ ERROR processing post #{idx + 1}: {str(e)}")
                import traceback
                traceback.print_exc()
                continue
        
        # Save all posts to CSV file (overwrite existing file)
        if extracted_posts:
            print(f"\n  → Saving all posts to CSV file: {csv_filename}")
            print(f"  → Overwriting existing file if it exists...")
            with open(csv_filename, 'w', newline='', encoding='utf-8') as csvfile:
                fieldnames = ['post_number', 'post_time', 'post_text', 'likes_count']
                writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
                
                writer.writeheader()
                for post in extracted_posts:
                    writer.writerow({
                        'post_number': post['post_number'],
                        'post_time': post['post_time'],
                        'post_text': post['post_text'],
                        'likes_count': post['likes_count']
                    })
            
            print(f"  ✓ CSV file saved: {csv_filename}")
            print(f"  → Total posts saved: {len(extracted_posts)}")
        else:
            print("  ⚠ No posts to save to CSV")
        
        print(f"\n" + "="*80)
        print(f"✓ EXTRACTION AND SAVING COMPLETE!")
        print(f"  → Successfully extracted {len(extracted_posts)} post(s)")
        print(f"  → CSV file: {csv_filename}")
        print("="*80)
        
        # Display extracted data summary
        print("\n" + "="*80)
        print("EXTRACTED POST DETAILS SUMMARY")
        print("="*80)
        for post in extracted_posts:
            print(f"\nPost #{post['post_number']}:")
            print(f"  Time: {post['post_time']}")
            print(f"  Likes: {post['likes_count']}")
            print(f"  Text Preview: {post['post_text'][:150]}..." if len(post['post_text']) > 150 else f"  Text: {post['post_text']}")
        
        return extracted_posts
        
    except Exception as e:
        print(f"\n  ✗ ERROR: An error occurred while extracting posts: {str(e)}")
        import traceback
        traceback.print_exc()
        return []

if __name__ == "__main__":
    driver = None
    try:
        print("\n" + "="*80)
        print("LINKEDIN LOGIN AUTOMATION")
        print("="*80)
        print("Running in NON-HEADLESS mode - browser window will be visible")
        print("="*80)
        
        # Login to LinkedIn (don't close browser, we need it for navigation)
        driver = login_to_linkedin(close_browser=False)
        
        if driver:
            # Navigate directly to Visa company Posts page
            navigate_to_visa_posts(driver)
            
            # Extract all available post details and save to CSV
            extract_post_details(driver)
            
            # Keep browser open to see results
            print("\n" + "="*80)
            print("AUTOMATION COMPLETE")
            print("="*80)
            print("  → Keeping browser open for 30 seconds to view results...")
            print("  → You can manually interact with the browser.")
            time.sleep(30)
        else:
            print("\n  ✗ ERROR: Login failed. Cannot proceed to navigation.")
            
    except Exception as e:
        print(f"\n  ✗ ERROR: An error occurred: {str(e)}")
        import traceback
        traceback.print_exc()
        
    finally:
        if driver:
            print("\n  → Closing browser...")
            driver.quit()
            print("  ✓ Browser closed!")
