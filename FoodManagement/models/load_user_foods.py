import mysql.connector
from . import config

def load_user_foods(user_id):
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