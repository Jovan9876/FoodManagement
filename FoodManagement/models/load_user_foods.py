"""
This module provides functions to interact with the MySQL database for food management.

Functions:
    - load_user_foods: Retrieves all food items for a specific user from the database.
    - load_shopping_foods: Retrieves food items for a specific user that are below the low threshold.

Database Interaction:
    - Uses the `mysql.connector` library to connect to the MySQL database.
    - Fetches database connection parameters using the `config` function from the `models` package.
"""

import mysql.connector
from . import config


def load_user_foods(user_id):
    """
    Retrieves all food items for a specific user from the database.

    Args:
        user_id (str): The unique identifier of the user.

    Returns:
        tuple:
            - result (list): A list of tuples containing the food item data.
            - column_name (list): A list of column names corresponding to the data.

    Raises:
        mysql.connector.Error: If there is an issue with the database connection or query execution.
    """
    # SQL query to select food items for a specific user
    sql = "SELECT * FROM food_item WHERE user_id = %s"
    conn = None
    result = []
    column_name = []

    try:
        # Read connection parameters
        params = config()

        # Connect to the MySQL server
        conn = mysql.connector.connect(**params)

        # Create a cursor
        cur = conn.cursor()

        # Execute the SQL statement
        cur.execute(sql, (user_id,))

        # Get the column names
        column_name = [desc[0] for desc in cur.description]

        # Fetch all results
        result = cur.fetchall()

        # Close the cursor
        cur.close()

    except mysql.connector.Error as error:
        print(f"Error: {error}")
    finally:
        if conn is not None:
            conn.close()

    return result, column_name


def load_shopping_foods(user_id):
    """
    Retrieves food items for a specific user that are below the low threshold.

    Args:
        user_id (str): The unique identifier of the user.

    Returns:
        tuple:
            - result (list): A list of tuples containing the food item data.
            - column_name (list): A list of column names corresponding to the data.

    Raises:
        mysql.connector.Error: If there is an issue with the database connection or query execution.
    """
    # SQL query to select food items for a specific user
    sql = "SELECT * FROM food_item WHERE user_id = %s AND quantity < low_threshold"
    conn = None
    result = []
    column_name = []

    try:
        # Read connection parameters
        params = config()

        # Connect to the MySQL server
        conn = mysql.connector.connect(**params)

        # Create a cursor
        cur = conn.cursor()

        # Execute the SQL statement
        cur.execute(sql, (user_id,))

        # Get the column names
        column_name = [desc[0] for desc in cur.description]

        # Fetch all results
        result = cur.fetchall()

        # Close the cursor
        cur.close()

    except mysql.connector.Error as error:
        print(f"Error: {error}")
    finally:
        if conn is not None:
            conn.close()

    return result, column_name
