import requests
import os
import time
import random
import json

# Set your Pixabay API key here
PIXABAY_API_KEY = "49059459-6163588d84e5b1dfc43d4e48a"  # Replace with your actual API key

# Create images directory if it doesn't exist
os.makedirs('images', exist_ok=True)

# List of food items to search for
food_items = [
    "Chocolate Chip Cookies",
    "Frozen Yogurt",  # Changed from "Frozen Yogurt Tube" for better results
    "Candy Bar",
    "Breakfast Cereal",
    "Pizza Slice",
    "Hamburger",
    "Potato Chips",
    "Soda",
    "Canned Fruit",
    "Canned Vegetables",
    "Microwave Popcorn",
    "Frozen Lasagna",
    "Pancake Mix",
    "Muffin",
    "Doughnut",
    "Instant Noodles",
    "Fruit Juice Box",
    "Granola Bar",
    "Ice Cream",
    "Energy Drink",
    "Frozen Pizza",
    "Fruit Snacks"
]

def clean_filename(name):
    """Convert food item name to a valid filename"""
    return name.lower().replace(' ', '_').replace('-', '_')

def download_image(food_item):
    """Search for and download an image for a food item using Pixabay API"""
    filename = f"images/{clean_filename(food_item)}.jpg"
    
    # Check if image already exists
    if os.path.exists(filename):
        print(f"Image for {food_item} already exists. Skipping.")
        return True
    
    # Try primary search term
    search_term = food_item
    if not try_download_from_pixabay(search_term, filename):
        # Try alternative search term by adding "food"
        alternative_term = f"{food_item} food"
        if not try_download_from_pixabay(alternative_term, filename):
            # Try more generic term
            generic_term = food_item.split()[-1] + " food"  # Last word + food
            if not try_download_from_pixabay(generic_term, filename):
                print(f"❌ Failed to find suitable image for {food_item}")
                return False
    
    return True

def try_download_from_pixabay(search_term, filename):
    """Try to download an image from Pixabay for the given search term"""
    try:
        print(f"Searching Pixabay for: {search_term}")
        
        # Construct the API URL
        api_url = "https://pixabay.com/api/"
        params = {
            "key": PIXABAY_API_KEY,
            "q": search_term,
            "image_type": "photo",
            "orientation": "horizontal",
            "category": "food",
            "per_page": 3  # Fetch top 3 results to increase chances of finding food
        }
        
        response = requests.get(api_url, params=params)
        
        if response.status_code == 200:
            data = response.json()
            
            if data["totalHits"] > 0:
                # Get the URL of the first image
                img_url = data["hits"][0]["webformatURL"]
                
                # Download the image
                img_response = requests.get(img_url, stream=True)
                if img_response.status_code == 200:
                    with open(filename, 'wb') as f:
                        f.write(img_response.content)
                    print(f"✅ Downloaded image for {search_term}")
                    return True
        
        print(f"ℹ️ No results found for {search_term}")
        return False
        
    except Exception as e:
        print(f"❌ Error downloading image for {search_term}: {e}")
        return False

# Main execution
print("Starting food image download...")
success_count = 0

for food_item in food_items:
    print(f"\nProcessing: {food_item}")
    if download_image(food_item):
        success_count += 1
    
    # Be nice to APIs with a random delay
    delay = random.uniform(1.5, 3.0)
    print(f"Waiting {delay:.2f} seconds before next request...")
    time.sleep(delay)

print(f"\nDownload complete! Successfully downloaded {success_count} out of {len(food_items)} images.")
print("Images are stored in the 'images' directory.")