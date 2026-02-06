"""
Price parsing and normalization utilities
Handles various price formats from different regions
"""

import re
from typing import Optional, Tuple


def parse_price(price_text: str, region: str = "india") -> Optional[float]:
    """
    Parse price text and convert to float
    
    Args:
        price_text: Raw price text (e.g., "₹45,999", "$299.99", "Rs. 50000")
        region: Region code for currency handling
        
    Returns:
        Parsed price as float, or None if parsing fails
    """
    if not price_text:
        return None
    
    # Remove currency symbols and text
    price_text = str(price_text).strip()
    
    # Common currency symbols and text
    currency_patterns = {
        "india": [r"₹", r"Rs\.?", r"INR", r"rupees?", r"rupee"],
        "us": [r"\$", r"USD", r"dollars?", r"dollar"],
        "uk": [r"£", r"GBP", r"pounds?", r"pound"],
        "eu": [r"€", r"EUR", r"euros?", r"euro"]
    }
    
    # Remove currency symbols based on region
    if region.lower() in currency_patterns:
        for pattern in currency_patterns[region.lower()]:
            price_text = re.sub(pattern, "", price_text, flags=re.IGNORECASE)
    
    # Remove common text
    price_text = re.sub(r"[a-zA-Z\s]+", "", price_text, flags=re.IGNORECASE)
    
    # Remove commas and other separators
    price_text = price_text.replace(",", "").replace(" ", "")
    
    # Extract numeric value
    match = re.search(r"(\d+\.?\d*)", price_text)
    if match:
        try:
            return float(match.group(1))
        except ValueError:
            return None
    
    return None


def parse_discount_percentage(discount_text: str) -> Optional[float]:
    """
    Parse discount percentage from text
    
    Args:
        discount_text: Raw discount text (e.g., "20% off", "Save 15%")
        
    Returns:
        Discount percentage as float, or None if parsing fails
    """
    if not discount_text:
        return None
    
    discount_text = str(discount_text).strip()
    
    # Extract percentage value
    match = re.search(r"(\d+\.?\d*)%", discount_text)
    if match:
        try:
            return float(match.group(1))
        except ValueError:
            return None
    
    return None


def calculate_discount_percentage(mrp: float, current_price: float) -> Optional[float]:
    """
    Calculate discount percentage from MRP and current price
    
    Args:
        mrp: Maximum Retail Price
        current_price: Current selling price
        
    Returns:
        Discount percentage, or None if calculation fails
    """
    if not mrp or not current_price or mrp <= 0:
        return None
    
    if current_price >= mrp:
        return 0.0
    
    discount = ((mrp - current_price) / mrp) * 100
    return round(discount, 2)


def parse_rating(rating_text: str) -> Optional[float]:
    """
    Parse rating from text
    
    Args:
        rating_text: Raw rating text (e.g., "4.5 out of 5", "4.5")
        
    Returns:
        Rating as float (0-5), or None if parsing fails
    """
    if not rating_text:
        return None
    
    rating_text = str(rating_text).strip()
    
    # Extract numeric rating
    match = re.search(r"(\d+\.?\d*)", rating_text)
    if match:
        try:
            rating = float(match.group(1))
            # Normalize to 0-5 scale if needed
            if rating > 5:
                rating = rating / 2  # Assume it's out of 10
            return round(rating, 2)
        except ValueError:
            return None
    
    return None


def parse_review_count(review_text: str) -> Optional[int]:
    """
    Parse review count from text
    
    Args:
        review_text: Raw review text (e.g., "1,234 ratings", "5.2K reviews")
        
    Returns:
        Review count as integer, or None if parsing fails
    """
    if not review_text:
        return None
    
    review_text = str(review_text).strip().lower()
    
    # Remove common text
    review_text = re.sub(r"[a-zA-Z\s]+", "", review_text)
    
    # Handle K, M suffixes
    multiplier = 1
    if "k" in review_text:
        multiplier = 1000
        review_text = review_text.replace("k", "")
    elif "m" in review_text:
        multiplier = 1000000
        review_text = review_text.replace("m", "")
    
    # Remove commas
    review_text = review_text.replace(",", "").replace(" ", "")
    
    # Extract numeric value
    match = re.search(r"(\d+\.?\d*)", review_text)
    if match:
        try:
            count = float(match.group(1)) * multiplier
            return int(count)
        except ValueError:
            return None
    
    return None
