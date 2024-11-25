"""
This module provides functionality for retrieving and 
processing nutritional data using the FatSecret API.

The module includes:
- Environment variable loading using `dotenv` to manage API keys.
- A utility function to convert strings to camelCase.
- A function to fetch and parse food nutritional data from the FatSecret API.
"""

import os
from fatsecret import Fatsecret
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Access variables
consumerKey = os.getenv("CONSUMER_KEY")
consumerSecret = os.getenv("CONSUMER_SECRET")

fs = Fatsecret(consumerKey, consumerSecret)


def to_camel_case(s):
    """
    Converts a string to camelCase format.

    Args:
        s (str): The input string to convert.

    Returns:
        str: The string converted to camelCase.
    """
    words = s.split()

    return words[0].lower() + "".join(word.capitalize() for word in words[1:])


def get_food_data(food):
    """
    Retrieves and processes nutritional data for a given food item using the FatSecret API.

    The function searches for the food item, extracts its nutritional description,
    and parses the data into a dictionary with keys in camelCase.

    Args:
        food (str): The name of the food item to search for.

    Returns:
        dict: A dictionary containing parsed nutritional information, including:
            - servingSize (str): The serving size information.
            - calories (str): The calorie content.
            - fat (str): The fat content.
            - carbs (str): The carbohydrate content.
            - protein (str): The protein content.
    """
    nutrition_dict = {}

    food_data = fs.foods_search(food)

    description = food_data[0]["food_description"]

    parts = description.split("-")

    serving_size = parts[0].strip()
    nutrition_dict = {"servingSize": serving_size}

    nutritional_info = parts[1].strip().split("|")

    for info in nutritional_info:
        key_value = info.split(":")
        if len(key_value) == 2:
            key = to_camel_case(key_value[0].strip())
            value = key_value[1].strip()
            nutrition_dict[key] = value

    return nutrition_dict
    # {'Serving Size': 'Per 100g', 'Calories': '89kcal',
    #  'Fat': '0.33g', 'Carbs': '22.84g', 'Protein': '1.09g'}

def get_food_image(food):
    """
    Retrieves display image for a given food item using the FatSecret API.

    The function searches for the food item, and extracts its image

    Args:
        food (str): The name of the food item to search for.

    Returns:
        str: A url linking to an image of the food item
    """

    food_data = fs.foods_search(food)
    food_name = food_data[0]["food_name"]

    food_image = f"https://www.fatsecret.com/calories-nutrition/generic/{food_name}/photos/"

    return food_image
