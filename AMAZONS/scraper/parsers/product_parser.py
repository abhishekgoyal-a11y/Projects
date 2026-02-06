"""
Product data parser for Amazon
Extracts product information from HTML elements
"""

import re
from typing import Dict, Any, Optional, List
from loguru import logger
from utils.price_parser import (
    parse_price, parse_discount_percentage, parse_rating, 
    parse_review_count, calculate_discount_percentage
)
from utils.helpers import clean_text, extract_asin_from_url, get_timestamp


class AmazonProductParser:
    """Parser for extracting product data from Amazon search results"""
    
    def __init__(self, region: str = "india"):
        """
        Initialize Amazon product parser
        
        Args:
            region: Region code for price parsing
        """
        self.region = region
    
    def parse_product_card(self, product_element) -> Optional[Dict[str, Any]]:
        """
        Parse a single product card from search results
        
        Args:
            product_element: Playwright element handle or BeautifulSoup element
            
        Returns:
            Product data dictionary or None if parsing fails
        """
        try:
            product_data = {}
            
            # Extract ASIN first (most reliable identifier)
            asin = None
            if hasattr(product_element, "get_attribute"):
                asin = product_element.get_attribute("data-asin")
            product_data["asin"] = asin
            
            # Extract product title - improved selectors
            title_selectors = [
                "h2 a span",
                "h2 span",
                ".s-title-instructions-style h2 a span",
                "[data-cy='title-recipe'] span",
                "h2 a",
                ".a-text-normal span",
                "span.a-text-normal",
                "a.a-link-normal span"
            ]
            product_data["product_title"] = self._extract_text(product_element, title_selectors)
            
            # Extract product URL - improved selectors
            url_selectors = [
                "h2 a",
                "h2 a.a-link-normal",
                "a[href*='/dp/']",
                "a[href*='/gp/product/']",
                "a.a-link-normal[href*='/dp/']",
                "a.a-link-normal[href*='/gp/product/']",
                ".s-link-style a",
                "a[data-component-type='s-product-image']"
            ]
            product_url = self._extract_attribute(product_element, url_selectors, "href")
            
            # If URL not found, try to construct from ASIN
            if not product_url and product_data.get("asin"):
                product_url = f"https://www.amazon.in/dp/{product_data['asin']}"
            
            if product_url:
                # Clean URL
                if product_url.startswith("/"):
                    product_url = f"https://www.amazon.in{product_url}"
                elif not product_url.startswith("http"):
                    product_url = f"https://www.amazon.in/{product_url}"
                # Remove query parameters that might cause issues (but keep ref parameter)
                if "?" in product_url:
                    parts = product_url.split("?")
                    product_url = parts[0]
            product_data["product_url"] = product_url
            
            # Extract ASIN from URL if not already set
            if not product_data.get("asin") and product_url:
                product_data["asin"] = extract_asin_from_url(product_url)
            
            # Extract current price - improved selectors
            price_selectors = [
                ".a-price-whole",
                ".a-price .a-offscreen",
                "span.a-price",
                ".a-price-range .a-price-whole",
                "[data-a-color='price'] span",
                ".a-price[data-a-color='price']",
                "span.a-price-whole",
                ".a-price .a-price-whole"
            ]
            # Try to get price from aria-label or text content
            price_text = self._extract_text(product_element, price_selectors)
            # Also try getting from aria-label
            if not price_text:
                price_elements = product_element.query_selector_all(".a-price, [data-a-color='price']")
                for price_el in price_elements:
                    aria_label = price_el.get_attribute("aria-label") if hasattr(price_el, "get_attribute") else None
                    if aria_label:
                        price_text = aria_label
                        break
            product_data["current_price"] = parse_price(price_text, self.region) if price_text else None
            
            # Extract MRP
            mrp_selectors = [
                ".a-price.a-text-price .a-offscreen",
                ".a-price-was .a-offscreen",
                "span.a-text-price",
                "[data-a-strike='true']"
            ]
            mrp_text = self._extract_text(product_element, mrp_selectors)
            product_data["mrp"] = parse_price(mrp_text, self.region) if mrp_text else None
            
            # Calculate discount if MRP and current price available
            if product_data.get("mrp") and product_data.get("current_price"):
                product_data["discount_percentage"] = calculate_discount_percentage(
                    product_data["mrp"], product_data["current_price"]
                )
            else:
                # Try to extract discount text
                discount_selectors = [
                    ".a-badge-text",
                    ".a-color-price",
                    "[data-a-color='secondary']"
                ]
                discount_text = self._extract_text(product_element, discount_selectors)
                product_data["discount_percentage"] = parse_discount_percentage(discount_text) if discount_text else None
            
            # Extract rating - improved selectors
            rating_selectors = [
                ".a-icon-alt",
                "[aria-label*='stars']",
                "[aria-label*='star']",
                ".a-icon-star-small .a-icon-alt",
                ".a-icon-star .a-icon-alt",
                "i.a-icon-star span.a-icon-alt"
            ]
            rating_text = None
            for selector in rating_selectors:
                try:
                    if hasattr(product_element, "query_selector"):
                        rating_el = product_element.query_selector(selector)
                        if rating_el:
                            # Try aria-label first (most reliable)
                            aria_label = rating_el.get_attribute("aria-label")
                            if aria_label:
                                rating_text = aria_label
                                break
                            # Fallback to text
                            rating_text = rating_el.inner_text() or rating_el.text_content()
                            if rating_text:
                                break
                except Exception:
                    continue
            product_data["rating"] = parse_rating(rating_text) if rating_text else None
            
            # Extract review count - improved selectors
            # Look for specific element: <span id="acrCustomerReviewText" aria-label="4,169 Reviews">(4,169)</span>
            review_selectors = [
                "#acrCustomerReviewText",  # Most reliable - specific ID
                "span#acrCustomerReviewText",
                "span[aria-label*='Reviews']",
                "span[aria-label*='Review']",
                "span[aria-label*='ratings']",
                "span[aria-label*='rating']",
                "a[href*='#customerReviews'] span",
                "a.a-link-normal span",
                ".a-size-base.s-underline-text",
                "span.a-size-base",
                "a span.a-size-base"
            ]
            review_text = None
            
            # First, try the most specific selector (acrCustomerReviewText)
            for selector in review_selectors:
                try:
                    if hasattr(product_element, "query_selector"):
                        review_el = product_element.query_selector(selector)
                        if review_el:
                            # Check aria-label first (most reliable)
                            aria_label = review_el.get_attribute("aria-label") if hasattr(review_el, "get_attribute") else None
                            if aria_label and ("review" in aria_label.lower() or "rating" in aria_label.lower()):
                                review_text = aria_label
                                break
                            
                            # Check text content (often contains number in parentheses like "(4,169)")
                            text = review_el.inner_text() or review_el.text_content()
                            if text:
                                # Extract number from parentheses or text
                                text_clean = text.strip()
                                if "(" in text_clean and ")" in text_clean:
                                    # Extract from parentheses like "(4,169)"
                                    match = re.search(r'\(([\d,]+)\)', text_clean)
                                    if match:
                                        review_text = match.group(1)
                                        break
                                elif text_clean.replace(",", "").replace(".", "").isdigit() or any(char.isdigit() for char in text_clean):
                                    # Direct number or contains digits
                                    review_text = text_clean
                                    break
                        
                        if review_text:
                            break
                except Exception:
                    continue
            
            # If still not found, try query_selector_all for multiple matches
            if not review_text:
                for selector in review_selectors:
                    try:
                        if hasattr(product_element, "query_selector_all"):
                            review_els = product_element.query_selector_all(selector)
                            for review_el in review_els:
                                aria_label = review_el.get_attribute("aria-label") if hasattr(review_el, "get_attribute") else None
                                if aria_label and ("review" in aria_label.lower() or "rating" in aria_label.lower()):
                                    review_text = aria_label
                                    break
                                
                                text = review_el.inner_text() or review_el.text_content()
                                if text and ("review" in text.lower() or "rating" in text.lower() or "(" in text):
                                    review_text = text
                                    break
                            
                            if review_text:
                                break
                    except Exception:
                        continue
            
            # If still not found, try to extract from rating text (often contains count in parentheses)
            if not review_text and rating_text:
                # Look for pattern like "3.8 out of 5 stars (4,169)"
                match = re.search(r'\(([\d,]+)\)', rating_text)
                if match:
                    review_text = match.group(1)
            
            product_data["reviews_count"] = parse_review_count(review_text) if review_text else None
            
            # Seller name extraction removed - not needed
            
            # Extract stock status
            stock_selectors = [
                ".a-color-state",
                ".a-color-success",
                "[aria-label*='stock']"
            ]
            stock_text = self._extract_text(product_element, stock_selectors)
            product_data["stock_status"] = clean_text(stock_text) if stock_text else "Available"
            
            # Extract product variants (RAM, Storage, Color)
            variant_selectors = [
                ".a-size-base.a-color-secondary",
                ".a-text-bold"
            ]
            variants = self._extract_variants(product_element)
            product_data["product_variants"] = variants if variants else None
            
            # Add timestamp
            product_data["timestamp"] = get_timestamp()
            
            return product_data
            
        except Exception as e:
            logger.error(f"Error parsing product card: {e}")
            return None
    
    def _extract_text(self, element, selectors: List[str]) -> Optional[str]:
        """
        Extract text using multiple selector strategies
        
        Args:
            element: Playwright element handle
            selectors: List of CSS selectors to try
            
        Returns:
            Extracted text or None
        """
        for selector in selectors:
            try:
                # Try Playwright-style selection
                if hasattr(element, "query_selector"):
                    found = element.query_selector(selector)
                    if found:
                        # Try inner_text first
                        text = found.inner_text()
                        if text and text.strip():
                            return text.strip()
                        # Fallback to text_content
                        text = found.text_content()
                        if text and text.strip():
                            return text.strip()
                # Try as attribute if element has inner_text
                elif hasattr(element, "inner_text"):
                    text = element.inner_text()
                    if text and text.strip():
                        return text.strip()
                    # Fallback to text_content
                    if hasattr(element, "text_content"):
                        text = element.text_content()
                        if text and text.strip():
                            return text.strip()
            except Exception as e:
                logger.debug(f"Error extracting text with selector '{selector}': {e}")
                continue
        
        return None
    
    def _extract_attribute(self, element, selectors: List[str], attribute: str) -> Optional[str]:
        """
        Extract attribute value using multiple selector strategies
        
        Args:
            element: Playwright element handle
            selectors: List of CSS selectors to try
            attribute: Attribute name to extract
            
        Returns:
            Attribute value or None
        """
        for selector in selectors:
            try:
                if hasattr(element, "query_selector"):
                    found = element.query_selector(selector)
                    if found:
                        value = found.get_attribute(attribute)
                        if value:
                            return value.strip()
            except Exception:
                continue
        
        return None
    
    def _extract_variants(self, element) -> Optional[Dict[str, str]]:
        """
        Extract product variants (RAM, Storage, Color)
        
        Args:
            element: Product element
            
        Returns:
            Dictionary with variant information or None
        """
        variants = {}
        
        try:
            # Try to extract variant information from text
            text = self._extract_text(element, ["*"])
            if text:
                text_lower = text.lower()
                
                # Extract RAM
                ram_patterns = [r"(\d+)\s*gb\s*ram", r"(\d+)\s*gb\s*ddr"]
                for pattern in ram_patterns:
                    match = re.search(pattern, text_lower)
                    if match:
                        variants["ram"] = f"{match.group(1)} GB"
                        break
                
                # Extract Storage
                storage_patterns = [
                    r"(\d+)\s*gb\s*(?:ssd|hdd|storage)",
                    r"(\d+)\s*tb\s*(?:ssd|hdd|storage)"
                ]
                for pattern in storage_patterns:
                    match = re.search(pattern, text_lower)
                    if match:
                        size = match.group(1)
                        unit = "TB" if "tb" in pattern else "GB"
                        variants["storage"] = f"{size} {unit}"
                        break
                
                # Extract Color
                color_keywords = ["black", "white", "silver", "gray", "blue", "red", "gold"]
                for color in color_keywords:
                    if color in text_lower:
                        variants["color"] = color.capitalize()
                        break
        
        except Exception as e:
            logger.debug(f"Error extracting variants: {e}")
        
        return variants if variants else None
