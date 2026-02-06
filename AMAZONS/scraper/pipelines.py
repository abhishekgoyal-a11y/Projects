"""
Data processing pipelines
Handles data cleaning, normalization, and deduplication
"""

import pandas as pd
from typing import List, Dict, Any
from loguru import logger
from utils.helpers import normalize_product_data, validate_product_data


class DataPipeline:
    """Pipeline for processing and cleaning scraped product data"""
    
    def __init__(self, deduplicate: bool = True):
        """
        Initialize data pipeline
        
        Args:
            deduplicate: Whether to remove duplicate products
        """
        self.deduplicate = deduplicate
    
    def process(self, products: List[Dict[str, Any]]) -> pd.DataFrame:
        """
        Process and clean product data
        
        Args:
            products: List of raw product dictionaries
            
        Returns:
            Cleaned DataFrame
        """
        logger.info(f"Processing {len(products)} products...")
        
        # Normalize each product
        normalized_products = []
        for product in products:
            try:
                normalized = normalize_product_data(product)
                if validate_product_data(normalized):
                    normalized_products.append(normalized)
            except Exception as e:
                logger.warning(f"Error normalizing product: {e}")
                continue
        
        logger.info(f"Normalized {len(normalized_products)} products")
        
        # Convert to DataFrame
        if not normalized_products:
            logger.warning("No valid products to process")
            return pd.DataFrame()
        
        df = pd.DataFrame(normalized_products)
        
        # Deduplicate if enabled
        if self.deduplicate:
            initial_count = len(df)
            df = self._deduplicate(df)
            removed = initial_count - len(df)
            if removed > 0:
                logger.info(f"Removed {removed} duplicate products")
        
        # Additional cleaning
        df = self._clean_dataframe(df)
        
        logger.info(f"Pipeline processing complete. Final count: {len(df)} products")
        return df
    
    def _deduplicate(self, df: pd.DataFrame) -> pd.DataFrame:
        """
        Remove duplicate products
        
        Args:
            df: Product DataFrame
            
        Returns:
            Deduplicated DataFrame
        """
        # Try to deduplicate by ASIN first (most reliable)
        if "asin" in df.columns:
            df = df.drop_duplicates(subset=["asin"], keep="first")
        
        # Then by URL
        if "product_url" in df.columns:
            df = df.drop_duplicates(subset=["product_url"], keep="first")
        
        # Finally by title similarity (basic)
        if "product_title" in df.columns:
            df = df.drop_duplicates(subset=["product_title"], keep="first")
        
        return df
    
    def _clean_dataframe(self, df: pd.DataFrame) -> pd.DataFrame:
        """
        Additional DataFrame cleaning
        
        Args:
            df: Product DataFrame
            
        Returns:
            Cleaned DataFrame
        """
        # Ensure numeric columns are properly typed
        numeric_columns = ["current_price", "mrp", "discount_percentage", "rating", "reviews_count"]
        for col in numeric_columns:
            if col in df.columns:
                df[col] = pd.to_numeric(df[col], errors="coerce")
        
        # Sort by price (ascending) by default
        if "current_price" in df.columns:
            df = df.sort_values("current_price", na_position="last")
        
        # Reset index
        df = df.reset_index(drop=True)
        
        return df
