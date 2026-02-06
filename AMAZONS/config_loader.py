"""
Configuration loader
Handles loading configuration from YAML files and CLI arguments
"""

import yaml
import argparse
from pathlib import Path
from typing import Dict, Any, Optional
from loguru import logger


class ConfigLoader:
    """Loader for configuration files and CLI arguments"""
    
    @staticmethod
    def load_yaml(config_path: str) -> Dict[str, Any]:
        """
        Load configuration from YAML file
        
        Args:
            config_path: Path to YAML config file
            
        Returns:
            Configuration dictionary
        """
        config_file = Path(config_path)
        
        if not config_file.exists():
            raise FileNotFoundError(f"Config file not found: {config_path}")
        
        try:
            with open(config_file, "r", encoding="utf-8") as f:
                config = yaml.safe_load(f)
            logger.info(f"Loaded configuration from: {config_path}")
            return config or {}
        except Exception as e:
            logger.error(f"Error loading config file: {e}")
            raise
    
    @staticmethod
    def merge_cli_args(config: Dict[str, Any], args: argparse.Namespace) -> Dict[str, Any]:
        """
        Merge CLI arguments into configuration
        
        Args:
            config: Base configuration dictionary
            args: Parsed CLI arguments
            
        Returns:
            Merged configuration dictionary
        """
        # Override with CLI arguments if provided
        if args.marketplace:
            config["marketplace"] = args.marketplace
        if args.region:
            config["region"] = args.region
        if args.search_keyword:
            config["search_keyword"] = args.search_keyword
        if args.min_price:
            config["min_price"] = args.min_price
        if args.max_price:
            config["max_price"] = args.max_price
        
        # Optional filters
        if not config.get("optional_filters"):
            config["optional_filters"] = {}
        
        if args.brand:
            config["optional_filters"]["brand"] = args.brand
        if args.minimum_rating:
            config["optional_filters"]["minimum_rating"] = args.minimum_rating
        if args.in_stock_only:
            config["optional_filters"]["in_stock_only"] = True
        if args.max_pages:
            config["optional_filters"]["max_pages"] = args.max_pages
        
        # Scraping settings
        if not config.get("scraping"):
            config["scraping"] = {}
        
        if args.headless is not None:
            config["scraping"]["headless"] = args.headless
        if args.delay:
            config["scraping"]["delay_between_requests"] = args.delay
        
        # Output settings
        if not config.get("output"):
            config["output"] = {}
        
        if args.output_format:
            config["output"]["format"] = args.output_format
        if args.output_dir:
            config["output"]["output_dir"] = args.output_dir
        
        return config
    
    @staticmethod
    def create_cli_parser() -> argparse.ArgumentParser:
        """
        Create CLI argument parser
        
        Returns:
            Configured ArgumentParser
        """
        parser = argparse.ArgumentParser(
            description="E-commerce Product Intelligence Scraper - Amazon Product Scraper",
            formatter_class=argparse.RawDescriptionHelpFormatter
        )
        
        # Required arguments
        parser.add_argument(
            "--search-keyword",
            type=str,
            help="Search keyword (e.g., 'laptop')"
        )
        
        parser.add_argument(
            "--min-price",
            type=float,
            help="Minimum price filter"
        )
        
        parser.add_argument(
            "--max-price",
            type=float,
            help="Maximum price filter"
        )
        
        # Optional arguments
        parser.add_argument(
            "--config",
            type=str,
            default="config/settings.yaml",
            help="Path to configuration YAML file (default: config/settings.yaml)"
        )
        
        parser.add_argument(
            "--marketplace",
            type=str,
            choices=["amazon"],
            help="Marketplace to scrape (default: amazon)"
        )
        
        parser.add_argument(
            "--region",
            type=str,
            choices=["india", "us", "uk"],
            default="india",
            help="Region/marketplace region (default: india)"
        )
        
        parser.add_argument(
            "--brand",
            type=str,
            help="Filter by brand name"
        )
        
        parser.add_argument(
            "--minimum-rating",
            type=float,
            help="Minimum product rating filter"
        )
        
        parser.add_argument(
            "--in-stock-only",
            action="store_true",
            help="Only scrape products in stock"
        )
        
        parser.add_argument(
            "--max-pages",
            type=int,
            help="Maximum number of pages to scrape"
        )
        
        parser.add_argument(
            "--headless",
            action="store_true",
            default=None,
            help="Run browser in headless mode"
        )
        
        parser.add_argument(
            "--no-headless",
            dest="headless",
            action="store_false",
            help="Run browser with visible window"
        )
        
        parser.add_argument(
            "--delay",
            type=float,
            help="Delay between requests in seconds"
        )
        
        parser.add_argument(
            "--output-format",
            type=str,
            choices=["csv", "json", "both"],
            help="Output format (csv, json, or both)"
        )
        
        parser.add_argument(
            "--output-dir",
            type=str,
            help="Output directory for saved files"
        )
        
        return parser
