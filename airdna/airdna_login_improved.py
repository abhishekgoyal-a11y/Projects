from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException
from webdriver_manager.chrome import ChromeDriverManager
import time
import csv
import re

def convert_revenue_to_numeric(revenue_str):
    """
    Convert revenue string like '$29,047' or '$106K' to numeric format like '29047' or '106000'
    """
    if not revenue_str:
        return ""
    
    # Remove $ and commas
    revenue_str = revenue_str.replace('$', '').replace(',', '').strip()
    
    # Handle K suffix (thousands)
    if revenue_str.upper().endswith('K'):
        try:
            num = float(revenue_str[:-1])
            return str(int(num * 1000))
        except:
            return revenue_str
    
    return revenue_str

def save_data_to_csv(extracted_data, csv_file):
    """
    Save extracted data to CSV file in the format matching the sample CSV
    Format: Type, Market, Sub-Market, Type of Data, Data, URL
    """
    try:
        print(f"[DEBUG] Saving data to CSV file: {csv_file}")
        
        with open(csv_file, 'w', newline='', encoding='utf-8') as f:
            writer = csv.writer(f)
            
            # Write empty first row
            writer.writerow(['', '', '', '', '', '', ''])
            
            # Write header row
            writer.writerow(['', 'Type', 'Market', 'Sub-Market', 'Type of Data', 'Data', 'URL'])
            
            # Process each market
            for market in extracted_data.get("markets", []):
                market_name = market.get("market_name", "")
                market_url = market.get("market_url", "")
                score = market.get("score", "")
                revenue_amount = market.get("revenue_amount", "")
                percentage_change = market.get("percentage_change", "")
                listings_count = market.get("listings_count", "")
                listings_percentage_change = market.get("listings_percentage_change", "")
                top_submarkets = market.get("top_submarkets", [])
                
                # Convert revenue to numeric format (remove $, commas, handle K)
                revenue_numeric = convert_revenue_to_numeric(revenue_amount)
                
                # Base URL parts
                base_url = market_url.rstrip('/')
                overview_url = f"{base_url}/overview" if base_url else ""
                listings_url = f"{base_url}/listings" if base_url else ""
                submarkets_url = f"{base_url}/top-submarkets" if base_url else ""
                
                # Write market-level data rows
                # Market Score
                writer.writerow(['', 'Market', market_name, 'n/a', 'Market Score', score, overview_url])
                
                # Annual Revenue
                writer.writerow(['', 'Market', market_name, 'n/a', 'Annual Revenue', revenue_numeric, overview_url])
                
                # Annual Revenue Growth
                writer.writerow(['', 'Market', market_name, 'n/a', 'Annual Revenue Growth', percentage_change, overview_url])
                
                # Total Active Listings
                writer.writerow(['', 'Market', market_name, 'n/a', 'Total Active Listings', listings_count, listings_url])
                
                # Total Active Listings; Growth Rate
                writer.writerow(['', 'Market', market_name, 'n/a', 'Total Active Listings; Growth Rate', listings_percentage_change, listings_url])
                
                # Write sub-market data rows
                for submarket in top_submarkets:
                    submarket_location = submarket.get("location", "")
                    submarket_score = submarket.get("score", "")
                    # Handle empty scores (like "--")
                    if not submarket_score or submarket_score == "--":
                        submarket_score = "--"
                    writer.writerow(['', 'Sub-Market', market_name, submarket_location, 'Market Score', submarket_score, submarkets_url])
        
        print(f"[DEBUG] CSV file saved successfully: {csv_file}")
        return True
    except Exception as e:
        print(f"[ERROR] Failed to save CSV file: {e}")
        return False

def handle_permission_dialog(driver, wait_time=2):
    """
    Helper function to handle browser permission dialogs
    """
    try:
        print("[DEBUG] Checking for permission dialog...")
        time.sleep(wait_time)
        
        # Try to find and click "Allow" button in permission dialog
        # The button might be in a shadow DOM or have different selectors
        try:
            # Try common selectors for permission dialog buttons
            allow_selectors = [
                "button:contains('Allow')",
                "button[data-testid*='allow']",
                "button[aria-label*='Allow']",
                "//button[contains(text(), 'Allow')]",
                "//button[contains(text(), 'Allow local network')]"
            ]
            
            for selector in allow_selectors:
                try:
                    if selector.startswith("//"):
                        # XPath selector
                        allow_button = driver.find_element(By.XPATH, selector)
                    else:
                        # CSS selector
                        allow_button = driver.find_element(By.CSS_SELECTOR, selector)
                    
                    if allow_button.is_displayed():
                        print("[DEBUG] Found permission dialog, clicking Allow...")
                        allow_button.click()
                        time.sleep(1)
                        print("[DEBUG] Permission dialog handled")
                        return True
                except:
                    continue
            
            # Try using JavaScript to find and click Allow button
            try:
                allow_clicked = driver.execute_script("""
                    var buttons = document.querySelectorAll('button');
                    for (var i = 0; i < buttons.length; i++) {
                        var text = buttons[i].textContent || buttons[i].innerText;
                        if (text.toLowerCase().includes('allow')) {
                            buttons[i].click();
                            return true;
                        }
                    }
                    return false;
                """)
                if allow_clicked:
                    print("[DEBUG] Permission dialog handled via JavaScript")
                    return True
            except:
                pass
                
        except Exception as e:
            print(f"[DEBUG] No permission dialog found or error handling it: {e}")
            return False
    except Exception as e:
        print(f"[DEBUG] Error checking for permission dialog: {e}")
        return False
    
    return False

def extract_market_data(driver, wait, market_link_url, market_name):
    """
    Common function to extract data from a market page
    Returns a dictionary with extracted data
    """
    print(f"[DEBUG] ========== Extracting data for {market_name} ==========")
    print(f"[DEBUG] Market URL: {market_link_url}")
    
    market_data = {
        "market_name": market_name,
        "market_url": market_link_url,
        "score": None,
        "revenue_amount": None,
        "percentage_change": None
    }
    
    # Wait for page to load
    print("[DEBUG] Waiting 3 seconds for page to fully load...")
    time.sleep(3)
    print(f"[DEBUG] Current URL: {driver.current_url}")
    
    # Extract h1 element with score "100"
    print("[DEBUG] Extracting h1 element (score)...")
    try:
        # Try exact class match first
        h1_element = wait.until(
            EC.presence_of_element_located((By.XPATH, "//h1[@class='MuiTypography-root MuiTypography-titleXL css-d7gn7b']"))
        )
        score_value = h1_element.text.strip()
        market_data["score"] = score_value
        print(f"[DEBUG] Score extracted: {score_value}")
    except TimeoutException:
        print("[DEBUG] Exact class match failed, trying partial class match...")
        try:
            # Fallback: try with partial class name
            h1_element = wait.until(
                EC.presence_of_element_located((By.XPATH, "//h1[contains(@class, 'MuiTypography-titleXL')]"))
            )
            score_value = h1_element.text.strip()
            market_data["score"] = score_value
            print(f"[DEBUG] Score extracted (fallback): {score_value}")
        except TimeoutException:
            print("[ERROR] Could not find h1 element with score")
            market_data["score"] = None
    
    # Extract p element with "$29,047"
    print("[DEBUG] Extracting p element (revenue amount)...")
    try:
        # Try exact class match first
        p_amount = wait.until(
            EC.presence_of_element_located((By.XPATH, "//p[@class='MuiTypography-root MuiTypography-body1 css-maxmtp']"))
        )
        amount_value = p_amount.text.strip()
        market_data["revenue_amount"] = amount_value
        print(f"[DEBUG] Revenue amount extracted: {amount_value}")
    except TimeoutException:
        print("[DEBUG] Exact class match failed, trying to find by text pattern (starts with $)...")
        try:
            # Fallback: try finding p element with body1 class that contains dollar sign
            p_elements = driver.find_elements(By.XPATH, "//p[contains(@class, 'MuiTypography-body1') and contains(text(), '$')]")
            if p_elements:
                amount_value = p_elements[0].text.strip()
                market_data["revenue_amount"] = amount_value
                print(f"[DEBUG] Revenue amount extracted (fallback): {amount_value}")
            else:
                print("[ERROR] Could not find p element with revenue amount")
                market_data["revenue_amount"] = None
        except Exception as e:
            print(f"[ERROR] Could not find p element with revenue amount: {e}")
            market_data["revenue_amount"] = None
    
    # Extract p element with "+10%"
    print("[DEBUG] Extracting p element (percentage change)...")
    try:
        # Try exact class match first
        p_percentage = wait.until(
            EC.presence_of_element_located((By.XPATH, "//p[@class='MuiTypography-root MuiTypography-body2 css-38xvzn']"))
        )
        percentage_value = p_percentage.text.strip()
        market_data["percentage_change"] = percentage_value
        print(f"[DEBUG] Percentage change extracted: {percentage_value}")
    except TimeoutException:
        print("[DEBUG] Exact class match failed, trying to find by text pattern (contains %)...")
        try:
            # Fallback: try finding p element with body2 class that contains percentage sign
            p_elements = driver.find_elements(By.XPATH, "//p[contains(@class, 'MuiTypography-body2') and contains(text(), '%')]")
            if p_elements:
                percentage_value = p_elements[0].text.strip()
                market_data["percentage_change"] = percentage_value
                print(f"[DEBUG] Percentage change extracted (fallback): {percentage_value}")
            else:
                print("[ERROR] Could not find p element with percentage change")
                market_data["percentage_change"] = None
        except Exception as e:
            print(f"[ERROR] Could not find p element with percentage change: {e}")
            market_data["percentage_change"] = None
    
    print(f"[DEBUG] Data extraction completed for {market_name}")
    return market_data

def extract_listings_data(driver, wait, market_url, market_name):
    """
    Extract listings data from listings page
    Returns dictionary with listings_count and listings_percentage_change
    """
    print(f"[DEBUG] ========== Extracting listings data for {market_name} ==========")
    
    listings_data = {
        "listings_count": None,
        "listings_percentage_change": None
    }
    
    # Navigate to listings page
    listings_url = f"{market_url}/listings"
    print(f"[DEBUG] Navigating to listings page: {listings_url}")
    driver.get(listings_url)
    
    print("[DEBUG] Waiting 5 seconds for listings page to load...")
    time.sleep(5)
    print(f"[DEBUG] Current URL: {driver.current_url}")
    
    # Extract listings count (518)
    print("[DEBUG] Extracting listings count...")
    try:
        # Try exact class match first
        listings_count_element = wait.until(
            EC.presence_of_element_located((By.XPATH, "//p[@class='MuiTypography-root MuiTypography-body1 css-1cd8ssy']"))
        )
        listings_count = listings_count_element.text.strip()
        listings_data["listings_count"] = listings_count
        print(f"[DEBUG] Listings count extracted: {listings_count}")
    except TimeoutException:
        print("[DEBUG] Exact class match failed, trying partial class match...")
        try:
            # Fallback: try with partial class name
            listings_count_element = wait.until(
                EC.presence_of_element_located((By.XPATH, "//p[contains(@class, 'MuiTypography-body1') and contains(@class, 'css-1cd8ssy')]"))
            )
            listings_count = listings_count_element.text.strip()
            listings_data["listings_count"] = listings_count
            print(f"[DEBUG] Listings count extracted (fallback): {listings_count}")
        except TimeoutException:
            print("[ERROR] Could not find listings count element")
            listings_data["listings_count"] = None
    
    # Extract percentage change (+5%)
    print("[DEBUG] Extracting listings percentage change...")
    try:
        # Try exact class match first with shorter timeout (element might not exist)
        wait_short = WebDriverWait(driver, 3)
        try:
            listings_percentage_element = wait_short.until(
                EC.presence_of_element_located((By.XPATH, "//p[@class='MuiTypography-root MuiTypography-body2 css-38xvzn']"))
            )
            listings_percentage = listings_percentage_element.text.strip()
            listings_data["listings_percentage_change"] = listings_percentage
            print(f"[DEBUG] Listings percentage change extracted: {listings_percentage}")
        except TimeoutException:
            print("[DEBUG] Exact class match failed, trying alternative strategies...")
            # Strategy 1: Try finding p element with body2 class that contains percentage sign
            try:
                p_elements = driver.find_elements(By.XPATH, "//p[contains(@class, 'MuiTypography-body2') and contains(@class, 'css-38xvzn') and contains(text(), '%')]")
                if p_elements:
                    listings_percentage = p_elements[0].text.strip()
                    listings_data["listings_percentage_change"] = listings_percentage
                    print(f"[DEBUG] Listings percentage change extracted (strategy 1): {listings_percentage}")
                else:
                    # Strategy 2: Try finding any p element with body2 class near listings count
                    p_elements = driver.find_elements(By.XPATH, "//p[contains(@class, 'MuiTypography-body2') and contains(text(), '%')]")
                    if p_elements:
                        # Filter to find one that's likely related to listings
                        for p_elem in p_elements:
                            text = p_elem.text.strip()
                            if '%' in text and ('+' in text or '-' in text):
                                listings_data["listings_percentage_change"] = text
                                print(f"[DEBUG] Listings percentage change extracted (strategy 2): {text}")
                                break
                    else:
                        print("[DEBUG] Listings percentage change element not found on page (may not exist)")
                        listings_data["listings_percentage_change"] = None
            except Exception as e:
                print(f"[DEBUG] Error finding listings percentage change: {e}")
                listings_data["listings_percentage_change"] = None
    except Exception as e:
        print(f"[ERROR] Could not find listings percentage change element: {e}")
        listings_data["listings_percentage_change"] = None
    
    print(f"[DEBUG] Listings data extraction completed for {market_name}")
    return listings_data

def extract_top_submarkets_data(driver, wait, market_url, market_name):
    """
    Extract top-submarkets data from top-submarkets page
    Returns dictionary with submarkets_count and top_submarkets array
    """
    print(f"[DEBUG] ========== Extracting top-submarkets data for {market_name} ==========")
    
    submarkets_data = {
        "submarkets_count": None,
        "top_submarkets": []
    }
    
    # Navigate to top-submarkets page
    top_submarkets_url = f"{market_url}/top-submarkets"
    print(f"[DEBUG] Navigating to top-submarkets page: {top_submarkets_url}")
    driver.get(top_submarkets_url)
    
    print("[DEBUG] Waiting 5 seconds for top-submarkets page to load...")
    time.sleep(5)
    print(f"[DEBUG] Current URL: {driver.current_url}")
    
    # Extract count
    print("[DEBUG] Extracting count from span element...")
    count_to_extract = None
    try:
        count_element = wait.until(
            EC.presence_of_element_located((By.XPATH, "//span[@class='MuiBox-root css-1vg6q84']"))
        )
        count_text = count_element.text.strip()
        count_to_extract = int(count_text)
        submarkets_data["submarkets_count"] = count_to_extract
        print(f"[DEBUG] Count extracted: {count_to_extract}")
    except TimeoutException:
        print("[DEBUG] Exact class match failed, trying partial class match...")
        try:
            count_element = wait.until(
                EC.presence_of_element_located((By.XPATH, "//span[contains(@class, 'css-1vg6q84')]"))
            )
            count_text = count_element.text.strip()
            count_to_extract = int(count_text)
            submarkets_data["submarkets_count"] = count_to_extract
            print(f"[DEBUG] Count extracted (fallback): {count_to_extract}")
        except Exception as e:
            print(f"[ERROR] Could not extract count: {e}")
            print("[DEBUG] Will extract all available data")
            count_to_extract = None
    
    # Extract location names and scores
    print("[DEBUG] Extracting location names and scores...")
    try:
        # Extract all location names (h6 with titleXXS class)
        location_elements = driver.find_elements(By.XPATH, "//h6[@class='MuiTypography-root MuiTypography-titleXXS css-10uk30h']")
        print(f"[DEBUG] Found {len(location_elements)} location name element(s)")
        
        # Extract all scores (h6 with subtitle2 class)
        score_elements = driver.find_elements(By.XPATH, "//h6[@class='MuiTypography-root MuiTypography-subtitle2 css-181kzsk']")
        print(f"[DEBUG] Found {len(score_elements)} score element(s)")
        
        # Determine how many to extract
        if count_to_extract is not None:
            extract_count = min(count_to_extract, len(location_elements), len(score_elements))
            print(f"[DEBUG] Will extract {extract_count} submarket(s) based on count")
        else:
            extract_count = min(len(location_elements), len(score_elements))
            print(f"[DEBUG] Will extract {extract_count} submarket(s) (all available)")
        
        # Extract only the specified count
        print("[DEBUG] Matching locations with scores...")
        
        # Use sequential matching approach - match location and score elements by index
        # This ensures we get unique pairs
        for i in range(extract_count):
            try:
                if i < len(location_elements) and i < len(score_elements):
                    location_name = location_elements[i].text.strip()
                    score = score_elements[i].text.strip()
                    
                    # Check if we already have this location (avoid duplicates)
                    is_duplicate = any(
                        sub["location"] == location_name and sub["score"] == score 
                        for sub in submarkets_data["top_submarkets"]
                    )
                    
                    if not is_duplicate:
                        submarkets_data["top_submarkets"].append({
                            "location": location_name,
                            "score": score
                        })
                        print(f"[DEBUG] Submarket {len(submarkets_data['top_submarkets'])}: Location={location_name}, Score={score}")
                    else:
                        print(f"[DEBUG] Skipping duplicate: Location={location_name}, Score={score}")
                else:
                    print(f"[DEBUG] Index {i} out of range (locations: {len(location_elements)}, scores: {len(score_elements)})")
                    break
            except Exception as e:
                print(f"[DEBUG] Error matching pair {i+1}: {e}")
                continue
        
        # If sequential matching didn't work well, try container approach as fallback
        if len(submarkets_data["top_submarkets"]) < extract_count:
            print(f"[DEBUG] Sequential matching found {len(submarkets_data['top_submarkets'])} items, trying container approach...")
            try:
                # Find direct parent containers (not nested) - use more specific XPath
                containers = driver.find_elements(By.XPATH, "//div[.//h6[@class='MuiTypography-root MuiTypography-titleXXS css-10uk30h'] and .//h6[@class='MuiTypography-root MuiTypography-subtitle2 css-181kzsk']]")
                print(f"[DEBUG] Found {len(containers)} container(s) with both location and score")
                
                seen_pairs = set()
                for container in containers:
                    if len(submarkets_data["top_submarkets"]) >= extract_count:
                        break
                    try:
                        location_elem = container.find_element(By.XPATH, ".//h6[@class='MuiTypography-root MuiTypography-titleXXS css-10uk30h']")
                        score_elem = container.find_element(By.XPATH, ".//h6[@class='MuiTypography-root MuiTypography-subtitle2 css-181kzsk']")
                        
                        location_name = location_elem.text.strip()
                        score = score_elem.text.strip()
                        
                        # Create unique key to avoid duplicates
                        pair_key = (location_name, score)
                        if pair_key not in seen_pairs:
                            seen_pairs.add(pair_key)
                            submarkets_data["top_submarkets"].append({
                                "location": location_name,
                                "score": score
                            })
                            print(f"[DEBUG] Submarket (container): Location={location_name}, Score={score}")
                    except Exception as e:
                        print(f"[DEBUG] Error extracting from container: {e}")
                        continue
            except Exception as e:
                print(f"[DEBUG] Container approach also failed: {e}")
        
        print(f"[DEBUG] Extracted {len(submarkets_data['top_submarkets'])} submarket(s)")
        
    except Exception as e:
        print(f"[ERROR] Error extracting submarkets data: {e}")
        submarkets_data["top_submarkets"] = []
    
    print(f"[DEBUG] Top-submarkets data extraction completed for {market_name}")
    return submarkets_data

def find_market_links(driver, wait, count=3):
    """
    Find market links on the current page
    Returns a list of (link_element, link_url, market_name) tuples
    """
    print(f"[DEBUG] Finding {count} market links on the page...")
    market_links = []
    
    try:
        # Wait for market links to be present and visible
        print("[DEBUG] Waiting for market links to be present...")
        try:
            wait.until(
                EC.presence_of_element_located((By.XPATH, "//a[contains(@href, '/data/us/airdna-')]"))
            )
            print("[DEBUG] At least one market link is present")
        except TimeoutException:
            print("[DEBUG] Warning: No market links found after explicit wait")
        
        # Additional wait for all links to load
        print("[DEBUG] Waiting 3 seconds for all market links to load...")
        time.sleep(3)
        
        # Find all links that match the pattern /data/us/airdna-XXX
        all_links = driver.find_elements(By.XPATH, "//a[contains(@href, '/data/us/airdna-')]")
        print(f"[DEBUG] Found {len(all_links)} potential market link(s)")
        
        # If no links found, try alternative selectors
        if len(all_links) == 0:
            print("[DEBUG] No links found with primary selector, trying alternative selectors...")
            # Try without the full path
            all_links = driver.find_elements(By.XPATH, "//a[contains(@href, 'airdna-')]")
            print(f"[DEBUG] Alternative selector 1 found {len(all_links)} link(s)")
            
            if len(all_links) == 0:
                # Try finding any links in the market list area
                all_links = driver.find_elements(By.XPATH, "//a[starts-with(@href, '/data/us/')]")
                print(f"[DEBUG] Alternative selector 2 found {len(all_links)} link(s)")
        
        # If still no links found, try scrolling to load more content
        if len(all_links) == 0:
            print("[DEBUG] No links found, trying to scroll page to trigger lazy loading...")
            # Scroll down slowly to trigger lazy loading
            for i in range(3):
                driver.execute_script(f"window.scrollTo(0, {(i+1) * 500});")
                time.sleep(2)
                all_links = driver.find_elements(By.XPATH, "//a[contains(@href, '/data/us/airdna-')]")
                if len(all_links) > 0:
                    print(f"[DEBUG] Found {len(all_links)} link(s) after scroll {i+1}")
                    break
            # Scroll back to top
            driver.execute_script("window.scrollTo(0, 0);")
            time.sleep(2)
            all_links = driver.find_elements(By.XPATH, "//a[contains(@href, '/data/us/airdna-')]")
            print(f"[DEBUG] After scrolling, found {len(all_links)} potential market link(s)")
        
        # Filter to get unique links and extract up to 'count' links
        seen_urls = set()
        for link in all_links:
            try:
                href = link.get_attribute('href')
                if href and href not in seen_urls and '/data/us/airdna-' in href:
                    # Extract market name from h6 element with titleXXS class (location name)
                    market_name = None
                    try:
                        # Try to get the market name from h6 element with titleXXS class
                        # This is the location name like "Montgomery", "Kauai", "Fort Wayne"
                        name_elements = link.find_elements(By.XPATH, ".//h6[contains(@class, 'MuiTypography-titleXXS')]")
                        if name_elements:
                            # Get the text from the h6 element (should be the location name)
                            market_name = name_elements[0].text.strip()
                            print(f"[DEBUG] Extracted market name from h6: '{market_name}'")
                    except Exception as e:
                        print(f"[DEBUG] Could not extract from h6: {e}")
                    
                    # Fallback: try to parse from link text
                    if not market_name or len(market_name) > 50:  # If name is too long, it's probably wrong
                        try:
                            link_text = link.text.strip()
                            # Split by newlines and find the location name
                            lines = [line.strip() for line in link_text.split('\n') if line.strip()]
                            # Usually the format is: Score, Location Name, Type, ...
                            # So we look for a line that's not a number and not a currency/percentage
                            for line in lines:
                                if (not line.replace(',', '').replace('.', '').isdigit() and 
                                    not line.startswith('$') and 
                                    not line.endswith('%') and
                                    len(line) < 30 and  # Reasonable length for a city name
                                    line not in ['Revenue Potential', 'Occupancy', 'Daily Rate', 'Over the last 12 months']):
                                    market_name = line
                                    print(f"[DEBUG] Extracted market name from link text: '{market_name}'")
                                    break
                        except Exception as e:
                            print(f"[DEBUG] Could not parse from link text: {e}")
                    
                    # Final fallback: use href
                    if not market_name:
                        market_name = href.split('/')[-1] if '/' in href else href
                        print(f"[DEBUG] Using href as market name fallback: {market_name}")
                    
                    seen_urls.add(href)
                    market_links.append((link, href, market_name))
                    
                    if len(market_links) >= count:
                        break
            except Exception as e:
                print(f"[DEBUG] Error processing link: {e}")
                continue
        
        print(f"[DEBUG] Selected {len(market_links)} market link(s) to process")
        for i, (link, url, name) in enumerate(market_links):
            print(f"[DEBUG]   Market {i+1}: {name} - {url}")
        
    except Exception as e:
        print(f"[ERROR] Error finding market links: {e}")
    
    return market_links

def login_to_airdna():
    """
    Automated login script for AirDNA with automatic ChromeDriver management
    Steps:
    1. Open https://app.airdna.co/data
    2. Click on 'Log in' link
    3. Fill in email and password
    4. Submit the form
    5. Click on 'Find a Market' element
    6. Find multiple market links (Montgomery + 2 more)
    7. For each market:
       - Click market link
       - Extract overview data (score, revenue amount, percentage change)
       - Navigate to listings page and extract listings data (count, percentage change)
       - Navigate to top-submarkets page and extract submarkets data (count, location names, scores)
       - Save all data to JSON
    8. Take screenshot
    """
    
    # Initialize the driver with automatic ChromeDriver management
    print("[DEBUG] Initializing Chrome driver...")
    
    # Configure Chrome options (headless mode - browser window will not be visible)
    print("[DEBUG] Configuring Chrome options...")
    chrome_options = Options()
    chrome_options.add_argument("--headless")
    chrome_options.add_argument("--window-size=1920,1080")
    chrome_options.add_argument("--disable-gpu")
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")
    
    # Set preferences to automatically allow local network access
    print("[DEBUG] Configuring Chrome preferences to allow local network access...")
    prefs = {
        "profile.default_content_setting_values": {
            "local-network-allow": 1,  # Allow local network access
            "notifications": 1  # Allow notifications
        },
        "profile.default_content_settings.popups": 0,  # Allow popups
        "profile.managed_default_content_settings": {
            "local-network-allow": 1
        }
    }
    chrome_options.add_experimental_option("prefs", prefs)
    
    # Grant permissions for specific origins
    chrome_options.add_experimental_option("excludeSwitches", ["disable-popup-blocking"])
    chrome_options.add_experimental_option("useAutomationExtension", False)
    
    # Additional arguments to handle permissions
    chrome_options.add_argument("--disable-features=IsolateOrigins,site-per-process")
    chrome_options.add_argument("--disable-web-security")
    chrome_options.add_argument("--allow-running-insecure-content")
    
    print("[DEBUG] Chrome options configured: window-size=1920,1080, local network access allowed")
    
    print("[DEBUG] Installing/checking ChromeDriver...")
    driver = webdriver.Chrome(
        service=Service(ChromeDriverManager().install()),
        options=chrome_options
    )
    print("[DEBUG] ChromeDriver initialized successfully")
    
    print("[DEBUG] Maximizing browser window...")
    driver.maximize_window()
    print("[DEBUG] Browser window maximized")
    
    # Set permissions to allow local network access
    print("[DEBUG] Setting Chrome permissions to allow local network access...")
    try:
        # Use Chrome DevTools Protocol to set permissions
        driver.execute_cdp_cmd('Browser.setPermission', {
            'origin': 'https://auth.airdna.co',
            'permission': {
                'name': 'local-network-allow'
            },
            'setting': 'granted'
        })
        print("[DEBUG] Permission set for auth.airdna.co")
    except Exception as perm_error:
        print(f"[DEBUG] Could not set permission via CDP (may not be supported): {perm_error}")
        print("[DEBUG] Will proceed - permission dialog may appear but can be handled")
    
    try:
        # Step 1: Open the URL
        print("[DEBUG] ========== Step 1: Opening URL ==========")
        print("[DEBUG] Navigating to: https://app.airdna.co/data")
        driver.get("https://app.airdna.co/data")
        print("[DEBUG] Page navigation initiated")
        
        # Wait for page to load
        print("[DEBUG] Initializing WebDriverWait with 15 second timeout...")
        wait = WebDriverWait(driver, 15)
        print("[DEBUG] Waiting 2 seconds for page to load...")
        time.sleep(2)
        
        # Handle permission dialog if it appears
        handle_permission_dialog(driver)
        
        print(f"[DEBUG] Current URL after load: {driver.current_url}")
        print("[DEBUG] Page title: " + driver.title)
        
        # Step 2: Click on the "Log in" link
        print("[DEBUG] ========== Step 2: Finding and clicking 'Log in' link ==========")
        print("[DEBUG] Attempting to find login link by LINK_TEXT...")
        
        # Try multiple strategies to find the login link
        try:
            login_link = wait.until(
                EC.element_to_be_clickable((By.LINK_TEXT, "Log in"))
            )
            print("[DEBUG] Login link found using LINK_TEXT strategy")
        except TimeoutException:
            print("[DEBUG] LINK_TEXT strategy failed, trying PARTIAL_LINK_TEXT...")
            # Alternative: find by partial text or class
            login_link = wait.until(
                EC.element_to_be_clickable((By.PARTIAL_LINK_TEXT, "Log in"))
            )
            print("[DEBUG] Login link found using PARTIAL_LINK_TEXT strategy")
        
        print(f"[DEBUG] Login link text: {login_link.text}")
        print(f"[DEBUG] Login link is displayed: {login_link.is_displayed()}")
        print(f"[DEBUG] Login link is enabled: {login_link.is_enabled()}")
        
        # Scroll into view if needed
        print("[DEBUG] Scrolling login link into view...")
        driver.execute_script("arguments[0].scrollIntoView(true);", login_link)
        print("[DEBUG] Waiting 0.5 seconds after scroll...")
        time.sleep(0.5)
        print("[DEBUG] Clicking login link...")
        login_link.click()
        print("[DEBUG] Login link clicked successfully")
        
        # Wait for the login form to appear
        print("[DEBUG] Waiting for login form to load...")
        print(f"[DEBUG] Current URL after clicking login: {driver.current_url}")
        print("[DEBUG] Waiting 3 seconds for login form to appear...")
        time.sleep(3)
        
        # Handle permission dialog if it appears (auth.airdna.co might trigger it)
        handle_permission_dialog(driver)
        print(f"[DEBUG] Current URL after wait: {driver.current_url}")
        print("[DEBUG] Page title: " + driver.title)
        
        # Step 3: Fill in email
        print("[DEBUG] ========== Step 3: Filling in email ==========")
        print("[DEBUG] Waiting for email field (id='loginId') to be present...")
        email_field = wait.until(
            EC.presence_of_element_located((By.ID, "loginId"))
        )
        print("[DEBUG] Email field found")
        print(f"[DEBUG] Email field is displayed: {email_field.is_displayed()}")
        print(f"[DEBUG] Email field is enabled: {email_field.is_enabled()}")
        print("[DEBUG] Clearing email field...")
        email_field.clear()
        print("[DEBUG] Entering email: fivverabhishek@gmail.com")
        email_field.send_keys("fivverabhishek@gmail.com")
        print(f"[DEBUG] Email field value after input: {email_field.get_attribute('value')}")
        
        # Trigger input event to activate validation
        print("[DEBUG] Triggering input event on email field for validation...")
        driver.execute_script("arguments[0].dispatchEvent(new Event('input', { bubbles: true }));", email_field)
        print("[DEBUG] Waiting 1 second for validation...")
        time.sleep(1)
        print("[DEBUG] Email field filled successfully")
        
        # Fill in password
        print("[DEBUG] ========== Filling in password ==========")
        print("[DEBUG] Waiting for password field (id='password') to be present...")
        password_field = wait.until(
            EC.presence_of_element_located((By.ID, "password"))
        )
        print("[DEBUG] Password field found")
        print(f"[DEBUG] Password field is displayed: {password_field.is_displayed()}")
        print(f"[DEBUG] Password field is enabled: {password_field.is_enabled()}")
        print("[DEBUG] Clearing password field...")
        password_field.clear()
        print("[DEBUG] Entering password...")
        password_field.send_keys("9wg!tgkZ!X5xV5b")
        print("[DEBUG] Password entered (value hidden for security)")
        
        # Trigger input event to activate validation
        print("[DEBUG] Triggering input event on password field for validation...")
        driver.execute_script("arguments[0].dispatchEvent(new Event('input', { bubbles: true }));", password_field)
        print("[DEBUG] Waiting 1 second for validation...")
        time.sleep(1)
        print("[DEBUG] Password field filled successfully")
        
        # Wait for button to be enabled (validation happens on input)
        print("[DEBUG] ========== Waiting for submit button to be enabled ==========")
        print("[DEBUG] Checking submit button state...")
        submit_button = wait.until(
            lambda driver: driver.find_element(By.ID, "submit-button").get_attribute("disabled") is None
        )
        print("[DEBUG] Submit button is now enabled")
        submit_button = driver.find_element(By.ID, "submit-button")
        print(f"[DEBUG] Submit button text: {submit_button.text}")
        print(f"[DEBUG] Submit button is displayed: {submit_button.is_displayed()}")
        print(f"[DEBUG] Submit button is enabled: {submit_button.is_enabled()}")
        
        # Step 4: Click submit
        print("[DEBUG] ========== Step 4: Clicking submit button ==========")
        print("[DEBUG] Scrolling submit button into view...")
        driver.execute_script("arguments[0].scrollIntoView(true);", submit_button)
        print("[DEBUG] Waiting 0.5 seconds after scroll...")
        time.sleep(0.5)
        print("[DEBUG] Clicking submit button...")
        submit_button.click()
        print("[DEBUG] Submit button clicked successfully")
        
        # Wait for navigation/loading
        print("[DEBUG] ========== Waiting for login to complete ==========")
        print("[DEBUG] Waiting 5 seconds for login processing...")
        time.sleep(5)
        
        # Check if login was successful (you can add URL check here)
        current_url = driver.current_url
        print(f"[DEBUG] Current URL after login: {current_url}")
        print("[DEBUG] Page title: " + driver.title)
        print("[DEBUG] Login process completed!")
        
        # Step 5: Click on "Find a Market"
        print("[DEBUG] ========== Step 5: Clicking on 'Find a Market' ==========")
        print("[DEBUG] Waiting for page to fully load after login...")
        print("[DEBUG] Waiting for page to be ready (checking document.readyState)...")
        
        # Wait for page to be fully loaded
        wait.until(lambda driver: driver.execute_script("return document.readyState") == "complete")
        print("[DEBUG] Document ready state: complete")
        
        print("[DEBUG] Waiting additional 8 seconds for dynamic content to load...")
        time.sleep(8)
        print(f"[DEBUG] Current URL before finding element: {driver.current_url}")
        print("[DEBUG] Page title: " + driver.title)
        
        # Debug: Try to find any elements with "Find a Market" text
        print("[DEBUG] Searching for any elements containing 'Find a Market' text...")
        try:
            all_elements = driver.find_elements(By.XPATH, "//*[contains(text(), 'Find a Market')]")
            print(f"[DEBUG] Found {len(all_elements)} element(s) containing 'Find a Market' text")
            for i, elem in enumerate(all_elements):
                print(f"[DEBUG]   Element {i+1}: tag={elem.tag_name}, text={elem.text[:50] if elem.text else 'N/A'}")
        except Exception as debug_e:
            print(f"[DEBUG] Error searching for elements: {debug_e}")
        
        # Wait for links to appear (dynamic content loading)
        print("[DEBUG] Waiting for links with '/data/us' to appear on page...")
        try:
            wait.until(lambda driver: len(driver.find_elements(By.XPATH, "//a[contains(@href, '/data/us')]")) > 0)
            print("[DEBUG] Links with '/data/us' found on page!")
        except TimeoutException:
            print("[DEBUG] Warning: No links with '/data/us' found after waiting")
        
        # Debug: Try to find any links with /data/us
        print("[DEBUG] Searching for any links with href containing '/data/us'...")
        try:
            all_links = driver.find_elements(By.XPATH, "//a[contains(@href, '/data/us')]")
            print(f"[DEBUG] Found {len(all_links)} link(s) with href containing '/data/us'")
            for i, link in enumerate(all_links[:10]):  # Show first 10 links
                print(f"[DEBUG]   Link {i+1}: href={link.get_attribute('href')}")
        except Exception as debug_e2:
            print(f"[DEBUG] Error searching for links: {debug_e2}")
        
        # Strategy 1: First try to find the <p> element with max wait of 2 seconds
        print("[DEBUG] Strategy 1: Searching for <p> element with class 'MuiTypography-root MuiTypography-caption MuiListItemText-primary css-14ds26f'...")
        print("[DEBUG] Max wait time: 2 seconds")
        find_market_element = None
        wait_2sec = WebDriverWait(driver, 2)
        
        try:
            # Try to find the <p> element with the specific class
            find_market_element = wait_2sec.until(
                EC.element_to_be_clickable((By.XPATH, "//p[@class='MuiTypography-root MuiTypography-caption MuiListItemText-primary css-14ds26f' and contains(text(), 'Find a Market')]"))
            )
            print("[DEBUG] Strategy 1 succeeded - <p> element found!")
            print(f"[DEBUG] Element tag: {find_market_element.tag_name}")
            print(f"[DEBUG] Element text: {find_market_element.text}")
        except TimeoutException:
            print("[DEBUG] Strategy 1 failed (timeout after 2 seconds)")
            print("[DEBUG] Strategy 2: Searching for <a> element with href='/data/us'...")
            
            # Strategy 2: If <p> not found, try the <a> element
            try:
                find_market_element = wait.until(
                    EC.element_to_be_clickable((By.XPATH, "//a[@href='/data/us' and .//div[@aria-label='Find a Market']]"))
                )
                print("[DEBUG] Strategy 2 succeeded - <a> element found!")
                print(f"[DEBUG] Element tag: {find_market_element.tag_name}")
                print(f"[DEBUG] Element href: {find_market_element.get_attribute('href')}")
            except TimeoutException:
                print("[DEBUG] Strategy 2 failed")
                # Try alternative XPath for the <a> element
                print("[DEBUG] Trying alternative XPath for <a> element...")
                try:
                    find_market_element = wait.until(
                        EC.element_to_be_clickable((By.XPATH, "//a[@href='/data/us']"))
                    )
                    print("[DEBUG] Alternative <a> element found!")
                    print(f"[DEBUG] Element tag: {find_market_element.tag_name}")
                    print(f"[DEBUG] Element href: {find_market_element.get_attribute('href')}")
                except TimeoutException:
                    print("[DEBUG] All strategies failed. Trying direct navigation fallback...")
                    # Fallback: Navigate directly to /data/us if link not found
                    print("[DEBUG] Navigating directly to https://app.airdna.co/data/us...")
                    driver.get("https://app.airdna.co/data/us")
                    print("[DEBUG] Direct navigation completed")
                    find_market_element = None  # Set to None to skip clicking
        
        if find_market_element is None:
            print("[DEBUG] No element found, using direct navigation instead")
            # Already navigated in fallback, just wait for page to load
            print("[DEBUG] Waiting for page to load after direct navigation...")
            time.sleep(3)
        else:
            print(f"[DEBUG] 'Find a Market' element found successfully")
            print(f"[DEBUG] Element is displayed: {find_market_element.is_displayed()}")
            print(f"[DEBUG] Element is enabled: {find_market_element.is_enabled()}")
            
            # Scroll into view if needed
            print("[DEBUG] Scrolling 'Find a Market' element into view...")
            driver.execute_script("arguments[0].scrollIntoView(true);", find_market_element)
            print("[DEBUG] Waiting 0.5 seconds after scroll...")
            time.sleep(0.5)
            print("[DEBUG] Clicking 'Find a Market' element...")
            find_market_element.click()
            print("[DEBUG] 'Find a Market' element clicked successfully")
        
        print("[DEBUG] Waiting 3 seconds for navigation/loading...")
        time.sleep(3)
        print(f"[DEBUG] Current URL after clicking: {driver.current_url}")
        print("[DEBUG] Page title: " + driver.title)
        
        # Step 6 & 7: Process multiple market links and extract data
        print("[DEBUG] ========== Step 6 & 7: Processing multiple markets ==========")
        print("[DEBUG] Waiting for page to fully load and market links to appear...")
        
        # Wait for loading spinner to disappear
        print("[DEBUG] Waiting for loading spinner to disappear...")
        try:
            # Wait for spinner to disappear (if it exists)
            wait.until(lambda driver: len(driver.find_elements(By.XPATH, "//*[contains(@class, 'MuiCircularProgress')]")) == 0 or 
                                 len(driver.find_elements(By.XPATH, "//*[contains(@class, 'spinner')]")) == 0)
            print("[DEBUG] Loading spinner disappeared")
        except:
            print("[DEBUG] No spinner found or already disappeared, continuing...")
        
        # Wait for market links to appear with explicit wait
        print("[DEBUG] Waiting for market links to appear on the page...")
        try:
            # Wait for at least one market link to appear
            wait.until(
                lambda driver: len(driver.find_elements(By.XPATH, "//a[contains(@href, '/data/us/airdna-')]")) > 0
            )
            print("[DEBUG] Market links found on page!")
        except TimeoutException:
            print("[DEBUG] Market links not found after wait, trying longer wait...")
            time.sleep(10)  # Additional wait for slow loading
        
        # Additional wait for dynamic content
        print("[DEBUG] Waiting additional 5 seconds for dynamic content to fully render...")
        time.sleep(5)
        
        print(f"[DEBUG] Current URL before finding market links: {driver.current_url}")
        
        # Find market links (up to 20 markets)
        market_links_list = find_market_links(driver, wait, count=20)
        
        if len(market_links_list) == 0:
            print("[ERROR] No market links found!")
            driver.save_screenshot("no_markets_error.png")
            raise Exception("Failed to find any market links")
        
        # Initialize data structure
        extracted_data = {
            "markets": []
        }
        output_file_csv = "extracted_data.csv"
        
        # Process each market link
        for market_index, (market_link, market_url, market_name) in enumerate(market_links_list):
            print(f"[DEBUG] ========== Processing Market {market_index + 1}: {market_name} ==========")
            
            # Navigate back to market list page if not first iteration
            if market_index > 0:
                print("[DEBUG] Navigating back to market list page...")
                driver.get("https://app.airdna.co/data/us")
                time.sleep(3)
                # Re-find the link (page might have reloaded)
                try:
                    market_link = wait.until(
                        EC.element_to_be_clickable((By.XPATH, f"//a[@href='{market_url.replace('https://app.airdna.co', '')}']"))
                    )
                except:
                    # Try partial match
                    market_link = wait.until(
                        EC.element_to_be_clickable((By.XPATH, f"//a[contains(@href, '{market_url.split('/')[-1]}')]"))
                    )
            
            # Store the link URL
            print(f"[DEBUG] Storing {market_name} link URL: {market_url}")
            
            # Scroll into view if needed
            print(f"[DEBUG] Scrolling {market_name} link into view...")
            driver.execute_script("arguments[0].scrollIntoView(true);", market_link)
            time.sleep(0.5)
            
            # Click the link
            print(f"[DEBUG] Clicking {market_name} link...")
            market_link.click()
            print(f"[DEBUG] {market_name} link clicked successfully")
            
            # Print the stored link URL after clicking
            print(f"[DEBUG] ========== {market_name} Link URL ==========")
            print(f"[DEBUG] Clicked {market_name} link URL: {market_url}")
            print(f"[DEBUG] ==========================================")
            
            # Extract overview data using common function
            market_data = extract_market_data(driver, wait, market_url, market_name)
            
            # Extract listings data for this market
            listings_data = extract_listings_data(driver, wait, market_url, market_name)
            market_data.update(listings_data)
            
            # Extract top-submarkets data for this market
            submarkets_data = extract_top_submarkets_data(driver, wait, market_url, market_name)
            market_data.update(submarkets_data)
            
            # Add to extracted data
            extracted_data["markets"].append(market_data)
            
            # Save after each market (in case script fails)
            try:
                # Save CSV
                save_data_to_csv(extracted_data, output_file_csv)
                print(f"[DEBUG] CSV data saved for {market_name}")
            except Exception as save_error:
                print(f"[ERROR] Failed to save CSV file: {save_error}")
        
        # Final save
        print("[DEBUG] ========== Saving all extracted market data ==========")
        try:
            # Save CSV
            save_data_to_csv(extracted_data, output_file_csv)
            print(f"[DEBUG] All market data saved successfully to {output_file_csv}")
            
            print(f"[DEBUG] Total markets processed: {len(extracted_data['markets'])}")
        except Exception as save_error:
            print(f"[ERROR] Failed to save CSV file: {save_error}")
        
        # Take a screenshot at the end (using last market's top-submarkets page)
        print("[DEBUG] ========== Taking screenshot ==========")
        print("[DEBUG] Saving screenshot to final_success.png...")
        driver.save_screenshot("final_success.png")
        print("[DEBUG] Screenshot saved successfully as final_success.png")
        
        # Keep browser open for verification (you can see the result)
        print("[DEBUG] Browser will stay open for 10 seconds for verification...")
        time.sleep(10)
        print("[DEBUG] Verification period completed")
        
    except TimeoutException as e:
        print(f"[ERROR] ========== Timeout error occurred ==========")
        print(f"[ERROR] Error details: {e}")
        print(f"[ERROR] Current URL: {driver.current_url}")
        print(f"[ERROR] Page title: {driver.title}")
        print("[ERROR] Taking a screenshot for debugging...")
        driver.save_screenshot("error_screenshot.png")
        print("[ERROR] Screenshot saved as error_screenshot.png")
        raise
        
    except Exception as e:
        print(f"[ERROR] ========== An error occurred ==========")
        print(f"[ERROR] Error type: {type(e).__name__}")
        print(f"[ERROR] Error details: {e}")
        print(f"[ERROR] Current URL: {driver.current_url}")
        try:
            print(f"[ERROR] Page title: {driver.title}")
        except:
            print("[ERROR] Could not get page title")
        print("[ERROR] Taking a screenshot for debugging...")
        driver.save_screenshot("error_screenshot.png")
        print("[ERROR] Screenshot saved as error_screenshot.png")
        raise
        
    finally:
        print("[DEBUG] ========== Cleanup ==========")
        print("[DEBUG] Closing browser in 5 seconds...")
        time.sleep(5)
        print("[DEBUG] Quitting browser...")
        driver.quit()
        print("[DEBUG] Browser closed successfully")
        print("[DEBUG] Script execution completed")

if __name__ == "__main__":
    login_to_airdna()
