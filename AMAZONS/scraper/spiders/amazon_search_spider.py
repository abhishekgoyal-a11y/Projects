"""
Amazon Search Spider
Main spider for scraping Amazon search results
"""

import time
from typing import List, Dict, Any, Optional
from playwright.sync_api import Page, Browser, sync_playwright
from loguru import logger

from scraper.parsers.product_parser import AmazonProductParser
from scraper.middlewares import RequestMiddleware, RetryHandler
from utils.helpers import get_user_agent


class AmazonSearchSpider:
    """Spider for scraping Amazon search results"""
    
    def __init__(self, config: Dict[str, Any]):
        """
        Initialize Amazon search spider
        
        Args:
            config: Configuration dictionary
        """
        self.config = config
        self.marketplace = config.get("marketplace", "amazon")
        self.region = config.get("region", "india")
        self.search_keyword = config.get("search_keyword", "")
        self.min_price = config.get("min_price")
        self.max_price = config.get("max_price")
        self.optional_filters = config.get("optional_filters", {})
        
        scraping_config = config.get("scraping", {})
        self.delay_between_requests = scraping_config.get("delay_between_requests", 2)
        self.delay_between_pages = scraping_config.get("delay_between_pages", 3)
        self.max_retries = scraping_config.get("max_retries", 3)
        self.timeout = scraping_config.get("timeout", 30)
        self.headless = scraping_config.get("headless", True)
        self.use_playwright = scraping_config.get("use_playwright", True)
        
        self.max_pages = self.optional_filters.get("max_pages")
        self.brand_filter = self.optional_filters.get("brand")
        self.minimum_rating = self.optional_filters.get("minimum_rating")
        self.in_stock_only = self.optional_filters.get("in_stock_only", False)
        
        # Initialize components
        self.parser = AmazonProductParser(region=self.region)
        self.middleware = RequestMiddleware(
            delay_between_requests=self.delay_between_requests,
            delay_between_pages=self.delay_between_pages
        )
        self.retry_handler = RetryHandler(max_retries=self.max_retries)
        
        # Browser instance
        self.browser: Optional[Browser] = None
        self.page: Optional[Page] = None
        
        # Base URL based on region
        self.base_urls = {
            "india": "https://www.amazon.in",
            "us": "https://www.amazon.com",
            "uk": "https://www.amazon.co.uk"
        }
        self.base_url = self.base_urls.get(self.region.lower(), self.base_urls["india"])
    
    def start(self):
        """Start the browser and initialize Playwright"""
        if not self.use_playwright:
            raise ValueError("Playwright is required for Amazon scraping")
        
        playwright = sync_playwright().start()
        self.browser = playwright.chromium.launch(
            headless=self.headless,
            args=["--no-sandbox", "--disable-blink-features=AutomationControlled"]
        )
        
        context = self.browser.new_context(
            user_agent=get_user_agent(),
            viewport={"width": 1920, "height": 1080}
        )
        self.page = context.new_page()
        
        # Set extra headers to appear more like a real browser
        self.page.set_extra_http_headers({
            "Accept-Language": "en-US,en;q=0.9",
            "Accept-Encoding": "gzip, deflate, br",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
            "Connection": "keep-alive",
            "Upgrade-Insecure-Requests": "1"
        })
    
    def stop(self):
        """Close browser and cleanup"""
        if self.page:
            self.page.close()
        if self.browser:
            self.browser.close()
    
    def build_search_url(self, page_number: int = 1) -> str:
        """
        Build Amazon search URL with filters
        
        Args:
            page_number: Page number for pagination
            
        Returns:
            Complete search URL
        """
        from urllib.parse import quote_plus
        
        # Base search URL
        keyword_encoded = quote_plus(self.search_keyword)
        url = f"{self.base_url}/s?k={keyword_encoded}"
        
        # Build filter parameters
        filter_params = []
        
        # Add price filters (Amazon uses price range in smallest currency unit - paise for India)
        if self.min_price or self.max_price:
            # Convert to paise (multiply by 100)
            min_price_paise = int(self.min_price * 100) if self.min_price else None
            max_price_paise = int(self.max_price * 100) if self.max_price else None
            
            if min_price_paise and max_price_paise:
                price_filter = f"p_36:{min_price_paise}-{max_price_paise}"
            elif min_price_paise:
                price_filter = f"p_36:{min_price_paise}-"
            elif max_price_paise:
                price_filter = f"p_36:-{max_price_paise}"
            else:
                price_filter = None
            
            if price_filter:
                filter_params.append(price_filter)
        
        # Add brand filter
        if self.brand_filter:
            brand_encoded = quote_plus(self.brand_filter)
            filter_params.append(f"p_89:{brand_encoded}")
        
        # Combine filters
        if filter_params:
            url += "&rh=" + ",".join(filter_params)
        
        # Add pagination
        if page_number > 1:
            url += f"&page={page_number}"
        
        logger.debug(f"Built search URL: {url}")
        return url
    
    def scrape_search_results(self) -> List[Dict[str, Any]]:
        """
        Scrape all search results across multiple pages
        
        Returns:
            List of product data dictionaries
        """
        all_products = []
        page_number = 1
        
        logger.info(f"Starting scrape for keyword: '{self.search_keyword}'")
        logger.info(f"Price range: ₹{self.min_price} - ₹{self.max_price}")
        
        try:
            while True:
                logger.info(f"Scraping page {page_number}...")
                
                url = self.build_search_url(page_number)
                products = self.retry_handler.retry(self._scrape_page, url)
                
                if not products:
                    logger.warning(f"No products found on page {page_number}. Stopping.")
                    break
                
                # Filter products based on criteria
                filtered_products = self._filter_products(products)
                all_products.extend(filtered_products)
                
                logger.info(f"Found {len(filtered_products)} products on page {page_number} (total: {len(all_products)})")
                
                # Check if we should continue to next page
                if self.max_pages and page_number >= self.max_pages:
                    logger.info(f"Reached max_pages limit ({self.max_pages})")
                    break
                
                # Check if there's a next page
                if not self._has_next_page():
                    logger.info("No more pages available")
                    break
                
                page_number += 1
                self.middleware.wait_before_page()
        
        except Exception as e:
            logger.error(f"Error during scraping: {e}")
            raise
        
        logger.info(f"Scraping completed. Total products: {len(all_products)}")
        return all_products
    
    def _scrape_page(self, url: str) -> List[Dict[str, Any]]:
        """
        Scrape a single page of search results
        
        Args:
            url: URL to scrape
            
        Returns:
            List of product data dictionaries
        """
        self.middleware.wait_before_request()
        
        logger.debug(f"Navigating to: {url}")
        try:
            self.page.goto(url, wait_until="domcontentloaded", timeout=self.timeout * 1000)
        except Exception as e:
            logger.error(f"Error loading page: {e}")
            return []
        
        # Wait for product cards to load - try multiple strategies
        # Wait for common Amazon search result indicators
        wait_selectors = [
            "[data-component-type='s-search-result']",
            "[data-asin]",
            ".s-result-item",
            "#search",
            ".s-main-slot"
        ]
        
        page_loaded = False
        for selector in wait_selectors:
            try:
                self.page.wait_for_selector(selector, timeout=5000, state="attached")
                page_loaded = True
                break
            except Exception:
                continue
        
        if not page_loaded:
            logger.warning("Page may not have loaded correctly")
        
        # Additional wait for dynamic content
        time.sleep(2)
        
        # Check if page loaded correctly (not a CAPTCHA or error page)
        page_title = self.page.title()
        if "captcha" in page_title.lower() or "robot" in page_title.lower():
            logger.warning("Possible CAPTCHA or bot detection page detected")
        
        # Find all product cards - try multiple selectors
        product_selectors = [
            "[data-component-type='s-search-result']",
            "div[data-asin]:not([data-asin=''])",
            ".s-result-item[data-asin]",
            ".s-result-item",
            "div[data-index]",
            "[data-index]"
        ]
        
        product_elements = []
        for selector in product_selectors:
            try:
                # Wait for selector to be available
                self.page.wait_for_selector(selector, timeout=5000, state="attached")
                elements = self.page.query_selector_all(selector)
                # Filter out elements without ASIN (not real products)
                filtered_elements = [el for el in elements if el.get_attribute("data-asin")]
                if filtered_elements:
                    product_elements = filtered_elements
                    logger.info(f"Found {len(product_elements)} product elements using selector: {selector}")
                    break
            except Exception as e:
                logger.debug(f"Selector {selector} failed: {e}")
                continue
        
        if not product_elements:
            # Try to get any elements with data-asin attribute
            try:
                all_elements = self.page.query_selector_all("[data-asin]")
                product_elements = [el for el in all_elements if el.get_attribute("data-asin") and el.get_attribute("data-asin") != ""]
                if product_elements:
                    logger.info(f"Found {len(product_elements)} products using fallback selector")
            except Exception as e:
                logger.debug(f"Fallback selector failed: {e}")
        
        if not product_elements:
            logger.warning("No product elements found on page")
            # Debug: Save page screenshot for inspection
            try:
                self.page.screenshot(path="debug_page.png")
                logger.debug("Saved debug screenshot to debug_page.png")
            except Exception:
                pass
            return []
        
        # Parse each product
        products = []
        for idx, element in enumerate(product_elements):
            try:
                # Skip if no ASIN
                asin = element.get_attribute("data-asin")
                if not asin or asin == "":
                    continue
                
                product_data = self.parser.parse_product_card(element)
                if product_data and product_data.get("product_title"):
                    products.append(product_data)
                else:
                    logger.debug(f"Product {idx + 1} skipped: missing title or invalid data")
            except Exception as e:
                logger.debug(f"Error parsing product element {idx + 1}: {e}")
                continue
        
        logger.info(f"Successfully parsed {len(products)} products from {len(product_elements)} elements")
        return products
    
    def _has_next_page(self) -> bool:
        """
        Check if there's a next page available
        
        Returns:
            True if next page exists, False otherwise
        """
        try:
            next_selectors = [
                "a.s-pagination-next:not(.s-pagination-disabled)",
                ".a-pagination .a-last:not(.a-disabled)",
                "a[aria-label='Go to next page']"
            ]
            
            for selector in next_selectors:
                next_button = self.page.query_selector(selector)
                if next_button:
                    return True
            
            return False
        except Exception:
            return False
    
    def _filter_products(self, products: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        Filter products based on criteria
        
        Args:
            products: List of product dictionaries
            
        Returns:
            Filtered list of products
        """
        filtered = []
        
        for product in products:
            # Price filter
            price = product.get("current_price")
            if price:
                if self.min_price and price < self.min_price:
                    continue
                if self.max_price and price > self.max_price:
                    continue
            
            # Rating filter
            if self.minimum_rating:
                rating = product.get("rating")
                if not rating or rating < self.minimum_rating:
                    continue
            
            # Stock filter
            if self.in_stock_only:
                stock_status = product.get("stock_status", "").lower()
                if "out of stock" in stock_status or "unavailable" in stock_status:
                    continue
            
            filtered.append(product)
        
        return filtered
