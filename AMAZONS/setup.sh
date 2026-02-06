#!/bin/bash
# Setup script for E-commerce Product Intelligence Scraper

echo "Setting up E-commerce Product Intelligence Scraper..."
echo ""

# Create virtual environment
echo "Creating virtual environment..."
python3 -m venv venv

# Activate virtual environment
echo "Activating virtual environment..."
source venv/bin/activate

# Install dependencies
echo "Installing dependencies..."
pip install --upgrade pip
pip install -r requirements.txt

# Install Playwright browsers
echo "Installing Playwright browsers..."
playwright install chromium

# Create necessary directories
echo "Creating output and log directories..."
mkdir -p outputs
mkdir -p logs

echo ""
echo "Setup complete!"
echo ""
echo "To activate the virtual environment, run:"
echo "  source venv/bin/activate"
echo ""
echo "To run the scraper, use:"
echo "  python run.py --search-keyword 'laptop' --min-price 20000 --max-price 80000"
