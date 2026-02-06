"""
Output handler for saving data in various formats
"""

import json
import pandas as pd
from pathlib import Path
from typing import Optional, List
from datetime import datetime
from loguru import logger
from utils.helpers import ensure_directory, generate_output_filename, sanitize_filename


class OutputHandler:
    """Handler for saving scraped data to files"""
    
    def __init__(self, output_dir: str = "outputs", include_timestamp: bool = True):
        """
        Initialize output handler
        
        Args:
            output_dir: Directory to save output files
            include_timestamp: Whether to include timestamp in filename
        """
        self.output_dir = ensure_directory(output_dir)
        self.include_timestamp = include_timestamp
    
    def save_csv(self, df: pd.DataFrame, base_name: str = "amazon_products") -> str:
        """
        Save DataFrame to CSV file
        
        Args:
            df: DataFrame to save
            base_name: Base filename without extension
            
        Returns:
            Path to saved file
        """
        if self.include_timestamp:
            filename = generate_output_filename(base_name, "csv", True)
        else:
            filename = f"{base_name}.csv"
        filepath = self.output_dir / filename
        
        # Delete existing file if it exists
        if filepath.exists():
            try:
                filepath.unlink()
                logger.info(f"Deleted existing file: {filepath}")
            except Exception as e:
                logger.warning(f"Could not delete existing file {filepath}: {e}")
        
        try:
            df.to_csv(filepath, index=False, encoding="utf-8")
            logger.info(f"Saved CSV file: {filepath}")
            return str(filepath)
        except Exception as e:
            logger.error(f"Error saving CSV file: {e}")
            raise
    
    def save_json(self, df: pd.DataFrame, base_name: str = "amazon_products") -> str:
        """
        Save DataFrame to JSON file
        
        Args:
            df: DataFrame to save
            base_name: Base filename without extension
            
        Returns:
            Path to saved file
        """
        if self.include_timestamp:
            filename = generate_output_filename(base_name, "json", True)
        else:
            filename = f"{base_name}.json"
        filepath = self.output_dir / filename
        
        # Delete existing file if it exists
        if filepath.exists():
            try:
                filepath.unlink()
                logger.info(f"Deleted existing file: {filepath}")
            except Exception as e:
                logger.warning(f"Could not delete existing file {filepath}: {e}")
        
        try:
            # Convert DataFrame to list of dictionaries
            records = df.to_dict("records")
            
            # Add metadata
            output_data = {
                "metadata": {
                    "scraped_at": datetime.now().isoformat(),
                    "total_products": len(records),
                    "columns": list(df.columns)
                },
                "products": records
            }
            
            with open(filepath, "w", encoding="utf-8") as f:
                json.dump(output_data, f, indent=2, ensure_ascii=False)
            
            logger.info(f"Saved JSON file: {filepath}")
            return str(filepath)
        except Exception as e:
            logger.error(f"Error saving JSON file: {e}")
            raise
    
    def save(self, df: pd.DataFrame, format: str = "csv", base_name: str = "amazon_products") -> List[str]:
        """
        Save DataFrame in specified format(s)
        
        Args:
            df: DataFrame to save
            format: Output format ("csv", "json", or "both")
            base_name: Base filename without extension
            
        Returns:
            List of saved file paths
        """
        saved_files = []
        
        if format.lower() == "csv" or format.lower() == "both":
            saved_files.append(self.save_csv(df, base_name))
        
        if format.lower() == "json" or format.lower() == "both":
            saved_files.append(self.save_json(df, base_name))
        
        return saved_files
