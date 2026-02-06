# E-commerce Product Intelligence Scraper

A production-ready Python automation system for collecting publicly available product data from Amazon based on search keywords and filters. The system automatically cleans, structures, and outputs data in business-ready formats (CSV, JSON).

## 🎯 Features

- **Intelligent Search & Filtering**: Programmatically search Amazon with customizable filters (price range, brand, rating, stock status)
- **Comprehensive Data Extraction**: Extracts product title, price, MRP, discount, rating, reviews, seller info, stock status, ASIN, variants, and more
- **Scalable Architecture**: Built to handle 100k+ products with efficient pagination and data processing
- **Multiple Output Formats**: Export data as CSV or JSON with timestamped filenames
- **Production-Ready**: Includes error handling, retry logic, rate limiting, and comprehensive logging
- **Configurable**: YAML-based configuration with CLI argument override support
- **Ethical Scraping**: Respects rate limits, uses rotating user agents, no captcha bypassing

## 📋 Requirements

- Python 3.10 or higher
- Playwright browser automation
- Internet connection

## 🚀 Installation

### 1. Clone or Download the Project

```bash
cd /path/to/AMAZONS
```

### 2. Create Virtual Environment

```bash
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Install Playwright Browsers

```bash
playwright install chromium
```

### 5. Verify Setup (Optional)

```bash
python verify_setup.py
```

This will check if all dependencies are installed correctly.

## ⚙️ Configuration

### Configuration File (`config/settings.yaml`)

The scraper uses a YAML configuration file for default settings:

```yaml
marketplace: amazon
region: india
search_keyword: "laptop"
min_price: 20000
max_price: 80000

optional_filters:
  brand: null  # e.g., "Dell", "HP", "Lenovo"
  minimum_rating: null  # e.g., 4.0
  in_stock_only: false
  max_pages: null  # null means scrape all pages

scraping:
  delay_between_requests: 2  # seconds
  delay_between_pages: 3  # seconds
  max_retries: 3
  timeout: 30  # seconds
  headless: true
  use_playwright: true

output:
  format: csv  # csv, json, both
  output_dir: outputs
  include_timestamp: true
  deduplicate: true

logging:
  level: INFO
  log_file: logs/scraper.log
  console_output: true
```

### CLI Arguments

You can override any config file setting using CLI arguments:

```bash
python run.py --search-keyword "laptop" --min-price 20000 --max-price 80000
```

## 📖 Usage

### Basic Usage

```bash
# Using config file
python run.py

# Using CLI arguments
python run.py --search-keyword "laptop" --min-price 20000 --max-price 80000

# With optional filters
python run.py \
  --search-keyword "laptop" \
  --min-price 20000 \
  --max-price 80000 \
  --brand "Dell" \
  --minimum-rating 4.0 \
  --in-stock-only \
  --max-pages 5
```

### Example: Scrape Laptops Under ₹80,000

```bash
python run.py \
  --search-keyword "laptop" \
  --min-price 20000 \
  --max-price 80000 \
  --region india \
  --output-format csv
```

### Advanced Options

```bash
# Run with visible browser (for debugging)
python run.py --search-keyword "laptop" --no-headless

# Custom output directory
python run.py --search-keyword "laptop" --output-dir my_outputs

# Output in both CSV and JSON
python run.py --search-keyword "laptop" --output-format both
```

## 📊 Output Schema

The scraper extracts the following fields for each product:

| Field | Description | Example |
|-------|-------------|---------|
| `product_title` | Full product name | "Dell Inspiron 15 3000 Laptop" |
| `current_price` | Current selling price | 45999.0 |
| `mrp` | Maximum Retail Price | 59999.0 |
| `discount_percentage` | Discount percentage | 23.33 |
| `rating` | Product rating (0-5) | 4.5 |
| `reviews_count` | Number of reviews | 1234 |
| `seller_name` | Seller name | "Amazon" |
| `stock_status` | Stock availability | "In stock" |
| `product_url` | Product page URL | "https://amazon.in/dp/..." |
| `asin` | Amazon Standard Identification Number | "B08XYZ1234" |
| `product_variants` | Variants (RAM, Storage, Color) | {"ram": "8 GB", "storage": "512 GB SSD"} |
| `timestamp` | Scraping timestamp | "2026-02-06T10:30:45" |

## 📁 Project Structure

```
AMAZONS/
├── config/
│   └── settings.yaml          # Configuration file
├── scraper/
│   ├── spiders/
│   │   └── amazon_search_spider.py  # Main spider
│   ├── parsers/
│   │   └── product_parser.py        # Product data parser
│   ├── pipelines.py                 # Data processing pipeline
│   ├── output_handler.py            # Output file handler
│   └── middlewares.py                # Request middleware
├── utils/
│   ├── logger.py                     # Logging utility
│   ├── price_parser.py               # Price parsing utilities
│   └── helpers.py                    # Helper functions
├── outputs/                          # Output directory (created automatically)
├── logs/                             # Log files (created automatically)
├── requirements.txt                  # Python dependencies
├── config_loader.py                  # Configuration loader
├── run.py                            # Main entry point
└── README.md                         # This file
```

## 🔧 Development

### Running Tests

```bash
# Example: Test with a small scrape
python run.py --search-keyword "laptop" --max-pages 1 --no-headless
```

### Debugging

1. Set `headless: false` in config or use `--no-headless` flag
2. Set logging level to `DEBUG` in config
3. Check log files in `logs/` directory

## ⚠️ Legal & Ethical Disclaimer

**IMPORTANT**: This scraper is designed for educational and legitimate business intelligence purposes only.

- **Public Data Only**: The scraper only collects publicly available product information
- **Rate Limiting**: Built-in delays and rate limiting to respect server resources
- **No Bypassing**: Does not attempt to bypass CAPTCHAs or security measures
- **Terms of Service**: Users are responsible for ensuring their use complies with Amazon's Terms of Service
- **Legal Compliance**: Users must comply with all applicable laws and regulations in their jurisdiction
- **No Warranty**: Use at your own risk. The authors are not responsible for any misuse

**Recommendations**:
- Use reasonable delays between requests
- Don't overload servers with excessive requests
- Respect robots.txt guidelines
- Consider using official APIs when available
- Consult legal counsel for commercial use

## 🐛 Troubleshooting

### Common Issues

1. **Playwright not found**
   ```bash
   playwright install chromium
   ```

2. **No products found**
   - Check internet connection
   - Verify search keyword is correct
   - Try running with `--no-headless` to see what's happening
   - Check if Amazon has changed their HTML structure

3. **Rate limiting / Blocked**
   - Increase delays in config (`delay_between_requests`, `delay_between_pages`)
   - Reduce `max_pages` to scrape fewer pages
   - Wait before retrying

4. **Import errors**
   ```bash
   pip install -r requirements.txt
   ```

## 📝 License

This project is provided as-is for educational and legitimate business purposes. Users are responsible for ensuring compliance with all applicable laws and terms of service.

## 🤝 Contributing

This is a production-ready commercial project. For improvements or bug fixes, please ensure:
- Code follows PEP 8 style guidelines
- Error handling is comprehensive
- Logging is informative
- Documentation is updated

## 📧 Support

For issues or questions:
1. Check the troubleshooting section
2. Review log files in `logs/`
3. Run with `--no-headless` for debugging

---

**Built with ❤️ for data-driven decision making**
