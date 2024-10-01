from fatsecret import Fatsecret 
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

# Access variables
consumerKey = os.getenv('CONSUMER_KEY')
consumerSecret = os.getenv('CONSUMER_SECRET')

fs = Fatsecret(consumerKey, consumerSecret)

def get_food_data(food):
    nutrition_dict = {}

    food_data = fs.foods_search(food)
    
    # Isolate just the description
    description = food_data[0]['food_description']

    # Split to seperate serving size and nutritional information
    parts = description.split('-')

    # Get the serving size
    serving_size = parts[0].strip()
    nutrition_dict = {'Serving Size': serving_size}

    # Extracting nutritional information
    nutritional_info = parts[1].strip().split('|')

    for info in nutritional_info:
        # Split each info entry by ':'
        key_value = info.split(':')
        if len(key_value) == 2:
            # Strip whitespace and add to dictionary
            key = key_value[0].strip()
            value = key_value[1].strip()
            nutrition_dict[key] = value

    return nutrition_dict # {'Serving Size': 'Per 100g', 'Calories': '89kcal', 'Fat': '0.33g', 'Carbs': '22.84g', 'Protein': '1.09g'}