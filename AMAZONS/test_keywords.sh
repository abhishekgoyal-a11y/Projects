#!/bin/bash
# Test script to run scraper with multiple keywords

# Array of keywords to test
keywords=(
    "laptop"
    "smartphone"
    "headphones"
    "smartwatch"
    "tablet"
    "wireless mouse"
    "keyboard"
    "webcam"
)

# Function to get price range for a keyword
get_price_range() {
    local keyword="$1"
    case "$keyword" in
        "laptop")
            echo "20000 80000"
            ;;
        "smartphone")
            echo "5000 50000"
            ;;
        "headphones")
            echo "500 5000"
            ;;
        "smartwatch")
            echo "2000 20000"
            ;;
        "tablet")
            echo "10000 50000"
            ;;
        "wireless mouse")
            echo "300 3000"
            ;;
        "keyboard")
            echo "500 5000"
            ;;
        "webcam")
            echo "1000 10000"
            ;;
        *)
            echo "1000 10000"
            ;;
    esac
}

echo "=========================================="
echo "Testing Amazon Scraper with Multiple Keywords"
echo "=========================================="
echo ""

# Counter for successful runs
success_count=0
fail_count=0

# Loop through each keyword
for keyword in "${keywords[@]}"; do
    echo "----------------------------------------"
    echo "Testing keyword: '$keyword'"
    echo "----------------------------------------"
    
    # Get price range for this keyword
    price_range=($(get_price_range "$keyword"))
    min_price=${price_range[0]}
    max_price=${price_range[1]}
    
    echo "Price range: ₹$min_price - ₹$max_price"
    echo ""
    
    # Run the scraper (all pages)
    if python3 run.py \
        --search-keyword "$keyword" \
        --min-price "$min_price" \
        --max-price "$max_price"; then
        echo "✓ Successfully scraped '$keyword'"
        ((success_count++))
    else
        echo "✗ Failed to scrape '$keyword'"
        ((fail_count++))
    fi
    
    echo ""
    # Small delay between runs to avoid rate limiting
    sleep 2
done

echo "=========================================="
echo "Test Summary"
echo "=========================================="
echo "Total keywords tested: ${#keywords[@]}"
echo "Successful: $success_count"
echo "Failed: $fail_count"
echo "=========================================="
