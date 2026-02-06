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
import shutil
import random
from datetime import datetime

# LinkedIn login credentials
EMAIL = "fivverabhishek@gmail.com"
PASSWORD = "abhi1234@1234"
LOGIN_URL = "https://www.linkedin.com/login?fromSignIn=true&trk=guest_homepage-basic_nav-header-signin"

# Search text (modify this to search for different terms)
SEARCH_TEXT = "qa engineer jobs"  # Set this to your desired search term

def setup_driver():
    """Setup Chrome driver with options"""
    print("\n" + "="*80)
    print("STEP 1: Setting up Chrome WebDriver")
    print("="*80)
    print("  → Creating Chrome options...")
    chrome_options = Options()
    # Running in headless mode (without opening browser window)
    chrome_options.add_argument("--headless=new")
    print("  → Adding Chrome options (headless mode, no-sandbox, disable automation detection)...")
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")
    chrome_options.add_argument("--disable-blink-features=AutomationControlled")
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
        return None

def search_linkedin(driver, search_text):
    """Search for text in LinkedIn"""
    if not driver:
        print("  ✗ ERROR: Driver is not available. Please login first.")
        return False
    
    try:
        print("\n" + "="*80)
        print("STEP 3: LinkedIn Search Process")
        print("="*80)
        wait = WebDriverWait(driver, 20)
        
        # Wait for the page to fully load after login
        print("  → Waiting for LinkedIn feed to load (3 seconds)...")
        time.sleep(3)
        print("  ✓ Feed loaded!")
        
        # Try multiple selectors to find the search input
        print(f"\n  → Preparing to search for: '{search_text}'")
        print("  → Looking for search input field...")
        search_input = None
        
        # Try by data-testid first (most reliable)
        print("    → Trying selector: input[data-testid='typeahead-input']")
        try:
            search_input = wait.until(
                EC.presence_of_element_located((By.CSS_SELECTOR, "input[data-testid='typeahead-input']"))
            )
            print("    ✓ Found search input using data-testid selector!")
        except:
            # Try by placeholder
            print("    → Trying selector: input[placeholder='Search']")
            try:
                search_input = wait.until(
                    EC.presence_of_element_located((By.CSS_SELECTOR, "input[placeholder='Search']"))
                )
                print("    ✓ Found search input using placeholder selector!")
            except:
                # Try by class name (partial match)
                print("    → Trying selector: input._6c63f4c4")
                try:
                    search_input = wait.until(
                        EC.presence_of_element_located((By.CSS_SELECTOR, "input._6c63f4c4"))
                    )
                    print("    ✓ Found search input using class selector!")
                except:
                    print("    → Trying alternative selector: input[aria-autocomplete='list']")
                    # Last resort: try to find any input with search-related attributes
                    search_input = wait.until(
                        EC.presence_of_element_located((By.CSS_SELECTOR, "input[aria-autocomplete='list'][autocomplete='off']"))
                    )
                    print("    ✓ Found search input using aria-autocomplete selector!")
        
        # Click on the search input to focus it
        print("\n  → Clicking on search input to focus...")
        search_input.click()
        time.sleep(1)
        print("  ✓ Search input focused!")
        
        # Clear any existing text and enter search term
        print(f"  → Clearing any existing text...")
        search_input.clear()
        print(f"  → Entering search text: '{search_text}'")
        search_input.send_keys(search_text)
        time.sleep(2)
        print("  ✓ Search text entered!")
        
        # Press Enter to submit the search
        print("  → Pressing Enter to submit search...")
        search_input.send_keys(Keys.RETURN)
        print("  ✓ Search submitted!")
        
        # Wait for search results to load
        print("  → Waiting for search results to load (5 seconds)...")
        time.sleep(5)
        
        current_url = driver.current_url
        print(f"  → Current URL after search: {current_url}")
        
        if "search" in current_url.lower():
            print("  ✓ Search completed successfully!")
        else:
            print("  ⚠ Search status unclear. Please check manually.")
        
        return True
        
    except Exception as e:
        print(f"\n  ✗ ERROR: An error occurred during search: {str(e)}")
        import traceback
        traceback.print_exc()
        return False

def click_posts_filter(driver):
    """Click on the Posts filter in search results"""
    if not driver:
        print("  ✗ ERROR: Driver is not available.")
        return False
    
    try:
        print("\n" + "="*80)
        print("STEP 4: Clicking Posts Filter")
        print("="*80)
        wait = WebDriverWait(driver, 20)
        
        print("  → Looking for Posts filter...")
        
        # Try multiple ways to find the Posts label/filter
        posts_filter = None
        
        # Method 1: Find by label text "Posts"
        print("    → Trying to find by text: 'Posts'")
        try:
            posts_filter = wait.until(
                EC.element_to_be_clickable((By.XPATH, "//label[contains(text(), 'Posts')]"))
            )
            print("    ✓ Found Posts filter using text content!")
        except:
            # Method 2: Find by for attribute (if it starts with :r)
            print("    → Trying to find by for attribute...")
            try:
                posts_filter = wait.until(
                    EC.element_to_be_clickable((By.CSS_SELECTOR, "label[for^=':r'][for$=':']"))
                )
                # Verify it contains "Posts" text
                if "Posts" in posts_filter.text:
                    print("    ✓ Found Posts filter using for attribute!")
                else:
                    raise Exception("Found label but text doesn't match")
            except:
                # Method 3: Find by class and text
                print("    → Trying to find by class and text...")
                try:
                    posts_filter = wait.until(
                        EC.element_to_be_clickable((By.XPATH, "//label[contains(@class, '_5718e3be') and contains(text(), 'Posts')]"))
                    )
                    print("    ✓ Found Posts filter using class and text!")
                except:
                    # Method 4: Find any label containing "Posts"
                    print("    → Trying exact text match...")
                    try:
                        posts_filter = wait.until(
                            EC.element_to_be_clickable((By.XPATH, "//label[normalize-space(text())='Posts']"))
                        )
                        print("    ✓ Found Posts filter using exact text match!")
                    except:
                        raise Exception("Could not find Posts filter")
        
        # Scroll into view if needed
        print("  → Scrolling Posts filter into view...")
        driver.execute_script("arguments[0].scrollIntoView({behavior: 'smooth', block: 'center'});", posts_filter)
        time.sleep(1)
        print("  ✓ Posts filter is visible!")
        
        # Click on the Posts filter
        print("  → Clicking on Posts filter...")
        posts_filter.click()
        print("  ✓ Posts filter clicked!")
        
        # Wait for the filter to be applied and results to update
        print("  → Waiting for Posts filter to be applied (3 seconds)...")
        time.sleep(3)
        
        current_url = driver.current_url
        print(f"  → Current URL after clicking Posts: {current_url}")
        
        if "posts" in current_url.lower() or "content" in current_url.lower():
            print("  ✓ Posts filter applied successfully!")
        else:
            print("  ⚠ Posts filter status unclear. Please check manually.")
        
        return True
        
    except Exception as e:
        print(f"\n  ✗ ERROR: An error occurred while clicking Posts filter: {str(e)}")
        import traceback
        traceback.print_exc()
        return False

def extract_and_save_posts(driver, output_dir="linkedin_posts"):
    """Extract all post texts and save each to a separate text file"""
    if not driver:
        print("  ✗ ERROR: Driver is not available.")
        return False
    
    try:
        print("\n" + "="*80)
        print("STEP 5: Extracting and Saving Posts")
        print("="*80)
        wait = WebDriverWait(driver, 20)
        
        # Delete existing directory and create a new one
        print(f"  → Checking output directory: {output_dir}")
        if os.path.exists(output_dir):
            print(f"  → Deleting existing directory: {output_dir}")
            shutil.rmtree(output_dir)
            print(f"  ✓ Deleted existing directory")
        
        print(f"  → Creating new directory: {output_dir}")
        os.makedirs(output_dir)
        print(f"  ✓ Created new directory: {output_dir}")
        
        print("\n  → Waiting for posts to load (3 seconds)...")
        time.sleep(3)
        print("  ✓ Wait complete!")
        
        # Step 1: Scroll to the end of page 50 times to load all posts
        print("\n  → STEP 1: Scrolling to end of page 50 times to load all posts...")
        num_scrolls = 5
        
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
            
            # Wait for content to load (random between 3 and 4 seconds)
            wait_time = round(random.uniform(3, 4), 1)
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
        
        # Step 2: Get all posts after scrolling
        print("\n  → STEP 2: Getting all posts from the page...")
        print("    → Using selector: span[data-testid='expandable-text-box']")
        post_elements = driver.find_elements(By.CSS_SELECTOR, "span[data-testid='expandable-text-box']")
        
        if not post_elements:
            print("    → No posts found with first selector, trying alternative...")
            # Try alternative selector
            print("    → Using selector: div[data-testid='expandable-text-box']")
            post_elements = driver.find_elements(By.CSS_SELECTOR, "div[data-testid='expandable-text-box']")
        
        print(f"  → Found {len(post_elements)} post elements")
        
        # Remove duplicates by checking text content (first 100 chars as identifier)
        print("\n  → Removing duplicate posts...")
        unique_posts = []
        seen_texts = set()
        
        for post in post_elements:
            try:
                # Get first part of text as identifier
                text_preview = post.text.strip()[:100] if post.text.strip() else ""
                if text_preview and text_preview not in seen_texts:
                    seen_texts.add(text_preview)
                    unique_posts.append(post)
            except:
                continue
        
        post_elements = unique_posts
        duplicates_removed = len(post_elements) - len(unique_posts)
        print(f"  ✓ Found {len(post_elements)} unique posts")
        if duplicates_removed > 0:
            print(f"    → Removed {duplicates_removed} duplicate(s)")
        
        if len(post_elements) == 0:
            print("\n  ✗ ERROR: No posts found on the page.")
            return False
        
        # Step 3: Extract and save each post
        print(f"\n  → STEP 3: Extracting and saving {len(post_elements)} posts...")
        saved_count = 0
        
        for idx, post_element in enumerate(post_elements, 1):
            try:
                print(f"\n  Processing Post #{idx}:")
                # Scroll element into view
                print("    → Scrolling post into view...")
                driver.execute_script("arguments[0].scrollIntoView({behavior: 'smooth', block: 'center'});", post_element)
                time.sleep(0.5)
                
                # Check if there's a "more" button to expand the text
                print("    → Checking for 'more' button to expand text...")
                try:
                    more_button = post_element.find_element(By.CSS_SELECTOR, "button[data-testid='expandable-text-button']")
                    # Check if button contains "more" text
                    button_text = more_button.text.lower()
                    if "more" in button_text or "…" in button_text:
                        print("    → Found 'more' button, clicking to expand...")
                        # Click the "more" button to expand
                        driver.execute_script("arguments[0].click();", more_button)
                        time.sleep(1)
                        print("    ✓ Text expanded!")
                    else:
                        print("    → No 'more' button needed")
                except:
                    # No "more" button, text is already fully visible
                    print("    → No 'more' button found (text already fully visible)")
                
                # Get the text content
                print("    → Extracting text content...")
                post_text = post_element.text.strip()
                
                if post_text:
                    # Create filename with timestamp and index
                    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
                    filename = f"post_{idx:03d}_{timestamp}.txt"
                    filepath = os.path.join(output_dir, filename)
                    
                    # Save to file
                    print(f"    → Saving to file: {filename}")
                    with open(filepath, 'w', encoding='utf-8') as f:
                        f.write(f"Post #{idx}\n")
                        f.write("=" * 80 + "\n\n")
                        f.write(post_text)
                        f.write("\n")
                    
                    saved_count += 1
                    print(f"    ✓ Saved! ({len(post_text)} characters)")
                else:
                    print(f"    ⚠ Post has no text content, skipping...")
                    
            except Exception as e:
                print(f"    ✗ ERROR processing post: {str(e)}")
                continue
        
        print(f"\n" + "="*80)
        print(f"✓ EXTRACTION AND SAVING COMPLETE!")
        print(f"  → Successfully saved {saved_count} out of {len(post_elements)} posts")
        print(f"  → Output directory: {output_dir}")
        print("="*80)
        return True
        
    except Exception as e:
        print(f"\n  ✗ ERROR: An error occurred while extracting posts: {str(e)}")
        import traceback
        traceback.print_exc()
        return False

def scrape_linkedin_posts(search_text=""):
    """Login to LinkedIn, search, filter posts, and extract all posts"""
    driver = None
    try:
        print("\n" + "="*80)
        print("STARTING LINKEDIN AUTOMATION")
        print("="*80)
        
        # Login first (don't close browser, we need it for search)
        driver = login_to_linkedin(close_browser=False)
        
        if driver and search_text:
            # Perform search if search text is provided
            search_success = search_linkedin(driver, search_text)
            if search_success:
                # Click on Posts filter after search
                click_posts_filter(driver)
                # Extract and save all posts
                extract_and_save_posts(driver)
                # Keep browser open to see results
                print("\n  → Keeping browser open for 10 seconds to view results...")
                time.sleep(10)
        elif driver:
            print("\n  → No search text provided. Logged in successfully.")
            print("  → Keeping browser open for 10 seconds...")
            time.sleep(10)
        
    except Exception as e:
        print(f"\n  ✗ ERROR: An error occurred: {str(e)}")
        import traceback
        traceback.print_exc()
        
    finally:
        if driver:
            print("\n  → Closing browser...")
            driver.quit()
            print("  ✓ Browser closed!")
            print("\n" + "="*80)
            print("AUTOMATION COMPLETE")
            print("="*80)

if __name__ == "__main__":
    # SEARCH_TEXT is defined at the top of the file
    scrape_linkedin_posts(SEARCH_TEXT)
