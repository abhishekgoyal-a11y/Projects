"""
Helper utility functions
"""

import re
from datetime import datetime
from pathlib import Path
from typing import Dict, Any, Optional
from fake_useragent import UserAgent


def get_user_agent() -> str:
    """
    Get a random user agent string
    
    Returns:
        Random user agent string
    """
    try:
        ua = UserAgent()
        return ua.random
    except Exception:
        # Fallback user agents
        return "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"


def clean_text(text: str) -> Optional[str]:
    """
    Clean and normalize text
    
    Args:
        text: Raw text string
        
    Returns:
        Cleaned text or None
    """
    if not text:
        return None
    
    # Remove extra whitespace
    text = re.sub(r"\s+", " ", str(text).strip())
    
    # Remove special characters that might cause issues
    text = text.replace("\n", " ").replace("\r", " ").replace("\t", " ")
    
    return text if text else None


def extract_asin_from_url(url: str) -> Optional[str]:
    """
    Extract ASIN from Amazon product URL
    
    Args:
        url: Amazon product URL
        
    Returns:
        ASIN string or None
    """
    if not url:
        return None
    
    # Pattern: /dp/ASIN or /gp/product/ASIN
    patterns = [
        r"/dp/([A-Z0-9]{10})",
        r"/gp/product/([A-Z0-9]{10})",
        r"/product/([A-Z0-9]{10})",
        r"/([A-Z0-9]{10})(?:[/?]|$)"
    ]
    
    for pattern in patterns:
        match = re.search(pattern, url, re.IGNORECASE)
        if match:
            return match.group(1).upper()
    
    return None


def get_timestamp() -> str:
    """
    Get current timestamp in ISO format
    
    Returns:
        Timestamp string
    """
    return datetime.now().isoformat()


def ensure_directory(path: str) -> Path:
    """
    Ensure directory exists, create if it doesn't
    
    Args:
        path: Directory path
        
    Returns:
        Path object
    """
    dir_path = Path(path)
    dir_path.mkdir(parents=True, exist_ok=True)
    return dir_path


def sanitize_filename(text: str) -> str:
    """
    Sanitize text for use in filenames
    
    Args:
        text: Text to sanitize
        
    Returns:
        Sanitized filename-safe string
    """
    if not text:
        return "products"
    
    # Replace spaces with underscores
    text = text.replace(" ", "_")
    
    # Remove special characters, keep only alphanumeric and underscores
    import re
    text = re.sub(r"[^a-zA-Z0-9_]", "", text)
    
    # Limit length
    if len(text) > 50:
        text = text[:50]
    
    return text.lower() if text else "products"


def generate_output_filename(base_name: str, extension: str, include_timestamp: bool = True) -> str:
    """
    Generate output filename with optional timestamp
    
    Args:
        base_name: Base filename without extension
        extension: File extension (without dot)
        include_timestamp: Whether to include timestamp
        
    Returns:
        Generated filename
    """
    if include_timestamp:
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        return f"{base_name}_{timestamp}.{extension}"
    return f"{base_name}.{extension}"


def validate_product_data(product: Dict[str, Any]) -> bool:
    """
    Validate that product data has minimum required fields
    
    Args:
        product: Product data dictionary
        
    Returns:
        True if valid, False otherwise
    """
    required_fields = ["product_title", "current_price", "product_url"]
    
    for field in required_fields:
        if not product.get(field):
            return False
    
    return True


def normalize_product_data(product: Dict[str, Any]) -> Dict[str, Any]:
    """
    Normalize product data structure
    
    Args:
        product: Raw product data dictionary
        
    Returns:
        Normalized product data dictionary
    """
    normalized = {
        "product_title": clean_text(product.get("product_title")),
        "current_price": product.get("current_price"),
        "mrp": product.get("mrp"),
        "discount_percentage": product.get("discount_percentage"),
        "rating": product.get("rating"),
        "reviews_count": product.get("reviews_count"),
        "stock_status": clean_text(product.get("stock_status")),
        "product_url": product.get("product_url"),
        "asin": product.get("asin") or extract_asin_from_url(product.get("product_url", "")),
        "product_variants": product.get("product_variants"),
        "timestamp": product.get("timestamp") or get_timestamp()
    }
    
    return normalized
