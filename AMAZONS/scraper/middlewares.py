"""
Middleware for request handling, retries, and delays
"""

import time
import random
from typing import Optional
from loguru import logger


class RequestMiddleware:
    """Middleware for handling requests with delays and retries"""
    
    def __init__(self, delay_between_requests: float = 2.0, delay_between_pages: float = 3.0):
        """
        Initialize request middleware
        
        Args:
            delay_between_requests: Delay between individual requests (seconds)
            delay_between_pages: Delay between page navigations (seconds)
        """
        self.delay_between_requests = delay_between_requests
        self.delay_between_pages = delay_between_pages
        self.last_request_time = 0
    
    def wait_before_request(self):
        """Wait before making a request to avoid rate limiting"""
        current_time = time.time()
        time_since_last = current_time - self.last_request_time
        
        if time_since_last < self.delay_between_requests:
            wait_time = self.delay_between_requests - time_since_last
            # Add small random variation
            wait_time += random.uniform(0, 0.5)
            time.sleep(wait_time)
        
        self.last_request_time = time.time()
    
    def wait_before_page(self):
        """Wait before navigating to a new page"""
        time.sleep(self.delay_between_pages + random.uniform(0, 1))


class RetryHandler:
    """Handler for retrying failed operations"""
    
    def __init__(self, max_retries: int = 3, backoff_factor: float = 2.0):
        """
        Initialize retry handler
        
        Args:
            max_retries: Maximum number of retry attempts
            backoff_factor: Exponential backoff factor
        """
        self.max_retries = max_retries
        self.backoff_factor = backoff_factor
    
    def retry(self, func, *args, **kwargs):
        """
        Retry a function call with exponential backoff
        
        Args:
            func: Function to retry
            *args: Positional arguments for function
            **kwargs: Keyword arguments for function
            
        Returns:
            Function result
            
        Raises:
            Exception: If all retries fail
        """
        last_exception = None
        
        for attempt in range(self.max_retries):
            try:
                return func(*args, **kwargs)
            except Exception as e:
                last_exception = e
                if attempt < self.max_retries - 1:
                    wait_time = self.backoff_factor ** attempt
                    logger.warning(f"Attempt {attempt + 1} failed: {e}. Retrying in {wait_time}s...")
                    time.sleep(wait_time)
                else:
                    logger.error(f"All {self.max_retries} attempts failed")
        
        raise last_exception
