#!/usr/bin/env python3
"""
Main runner script for E-commerce Product Intelligence Scraper
Entry point for the scraper application
"""

import sys
from pathlib import Path

# Add project root to path
project_root = Path(__file__).parent
sys.path.insert(0, str(project_root))

from config_loader import ConfigLoader
from scraper.spiders.amazon_search_spider import AmazonSearchSpider
from scraper.pipelines import DataPipeline
from scraper.output_handler import OutputHandler
from utils.logger import setup_logger
from loguru import logger


def main():
    """Main execution function"""
    # Parse CLI arguments
    parser = ConfigLoader.create_cli_parser()
    args = parser.parse_args()
    
    # Load configuration
    try:
        config = ConfigLoader.load_yaml(args.config)
    except FileNotFoundError:
        logger.warning(f"Config file not found: {args.config}. Using defaults.")
        config = {}
    
    # Merge CLI arguments
    config = ConfigLoader.merge_cli_args(config, args)
    
    # Validate required fields
    if not config.get("search_keyword"):
        logger.error("search_keyword is required. Provide via config file or --search-keyword argument.")
        sys.exit(1)
    
    if not config.get("min_price") and not config.get("max_price"):
        logger.warning("No price filters specified. Scraping all products.")
    
    # Setup logger
    logging_config = config.get("logging", {})
    setup_logger(
        log_level=logging_config.get("level", "INFO"),
        log_file=logging_config.get("log_file"),
        console_output=logging_config.get("console_output", True)
    )
    
    logger.info("=" * 60)
    logger.info("E-commerce Product Intelligence Scraper")
    logger.info("=" * 60)
    
    # Initialize spider
    spider = None
    try:
        spider = AmazonSearchSpider(config)
        spider.start()
        
        # Scrape products
        products = spider.scrape_search_results()
        
        if not products:
            logger.warning("No products found. Exiting.")
            return
        
        # Process data
        output_config = config.get("output", {})
        pipeline = DataPipeline(deduplicate=output_config.get("deduplicate", True))
        df = pipeline.process(products)
        
        if df.empty:
            logger.warning("No valid products after processing. Exiting.")
            return
        
        # Save output
        # Generate filename from keyword: {keyword}_products.csv
        search_keyword = config.get("search_keyword", "products")
        from utils.helpers import sanitize_filename
        keyword_sanitized = sanitize_filename(search_keyword)
        base_filename = f"{keyword_sanitized}_products"
        
        output_handler = OutputHandler(
            output_dir=output_config.get("output_dir", "outputs"),
            include_timestamp=False  # No timestamp, use keyword-based filename
        )
        
        output_format = output_config.get("format", "csv")
        saved_files = output_handler.save(df, format=output_format, base_name=base_filename)
        
        logger.info("=" * 60)
        logger.info("Scraping completed successfully!")
        logger.info(f"Total products scraped: {len(df)}")
        logger.info(f"Output files:")
        for file_path in saved_files:
            logger.info(f"  - {file_path}")
        logger.info("=" * 60)
    
    except KeyboardInterrupt:
        logger.warning("Scraping interrupted by user")
        sys.exit(1)
    
    except Exception as e:
        logger.error(f"Fatal error: {e}", exc_info=True)
        sys.exit(1)
    
    finally:
        if spider:
            spider.stop()


if __name__ == "__main__":
    main()
