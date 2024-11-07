import pytest
from server import app, db, User, FoodItem, Notification
from flask import json

# Test client setup
@pytest.fixture
def client():
    # Use a session for the test client
    with app.app_context():
        db.create_all()  # Create tables fresh
        yield app.test_client()  # Yield the test client to be used in tests
        db.session.remove()
        db.drop_all()  # Drop tables after tests

# Helper function to register a user
def register_user(client, username, password):
    return client.post('/register', json={'username': username, 'password': password})

# Helper function to log in a user
def login_user(client, username, password):
    return client.post('/login', json={'username': username, 'password': password})

# Helper function to get current user
def get_current_user(client):
    return client.get('/@me')

# Helper function to input food item
def input_food_item(client, food_item_data):
    return client.post('/input_food', json=food_item_data)

# Helper function to get user inventory
def get_inventory(client):
    return client.get('/inventory')

# Test registration of a new user
def test_register_user(client):
    response = register_user(client, 'testuser', 'password123')
    data = json.loads(response.data)

    assert response.status_code == 200
    assert data['username'] == 'testuser'
    assert 'id' in data  # Ensure user id is returned

# Test login with correct credentials
def test_login_user(client):
    # Register the user first
    register_user(client, 'testuser', 'password123')

    response = login_user(client, 'testuser', 'password123')
    data = json.loads(response.data)

    assert response.status_code == 200
    assert data['username'] == 'testuser'
    assert 'id' in data  # Ensure user id is returned

def test_logout_user(client):
    # Register and log in a user
    register_user(client, 'testuser', 'password123')
    login_user(client, 'testuser', 'password123')

    # Check that the user is logged in by querying the current user
    response = get_current_user(client)
    data = json.loads(response.data)

    assert response.status_code == 200
    assert data['username'] == 'testuser'

    # Now log out the user
    response = client.post('/logout')
    data = json.loads(response.data)

    # Ensure the response indicates a successful logout
    assert response.status_code == 200
    assert data['message'] == 'Logged out successfully'

    # Check that the user is no longer logged in
    response = get_current_user(client)
    data = json.loads(response.data)

    assert response.status_code == 401  # Should return unauthorized as the session should be cleared
    assert data['error'] == 'Unauthorized'

# Test login with incorrect credentials
def test_login_user_invalid(client):
    # Register the user first
    register_user(client, 'testuser', 'password123')

    response = login_user(client, 'testuser', 'wrongpassword')
    data = json.loads(response.data)

    assert response.status_code == 401
    assert data['error'] == 'Unauthorized'

# Test unauthorized access to /@me (before login)
def test_get_current_user_unauthorized(client):
    response = get_current_user(client)
    data = json.loads(response.data)

    assert response.status_code == 401
    assert data['error'] == 'Unauthorized'

# Test get current user after logging in
def test_get_current_user_authorized(client):
    # Register and log in the user
    register_user(client, 'testuser', 'password123')
    login_user(client, 'testuser', 'password123')

    response = get_current_user(client)
    data = json.loads(response.data)

    assert response.status_code == 200
    assert data['username'] == 'testuser'
    assert 'id' in data

def test_register_user_already_exists(client):
    # First, register the user
    response1 = register_user(client, 'testuser', 'password123')
    data1 = json.loads(response1.data)

    # Assert the first registration is successful (should return 200 OK)
    assert response1.status_code == 200
    assert data1['username'] == 'testuser'
    assert 'id' in data1  # Ensure user id is returned

    # Attempt to register with the same username
    response2 = register_user(client, 'testuser', 'password123')
    data2 = json.loads(response2.data)

    # Assert that the response status code is 409 (Conflict) for duplicate registration
    assert response2.status_code == 409
    assert data2['error'] == 'User already exists'

    # Additional check to verify the database state
    # Ensure that only one user exists with the username 'testuser'
    user_in_db = User.query.filter_by(username='testuser').first()
    assert user_in_db is not None  # User should exist in the database
    assert user_in_db.username == 'testuser'  # Ensure the username matches

# Test adding a new food item
def test_add_food_item(client):
    # Register and log in the user
    register_user(client, 'testuser', 'password123')
    login_user(client, 'testuser', 'password123')

    # Prepare data for a new food item
    food_item_data = {
        'name': 'Apple',
        'quantity': 10,
        'unitType': 'kg',
        'cost': 2.5,
        'lowThreshold': 3,
        'category': 'Fruit',
        'expirationDate': '2024-12-31',
        'description': 'Fresh red apples'
    }

    # Input the new food item
    response = input_food_item(client, food_item_data)
    data = json.loads(response.data)

    # Assert that the response is correct
    assert response.status_code == 201
    assert data['message'] == 'Food item added'

    # Ensure the food item is in the database
    food_item = FoodItem.query.filter_by(name='Apple').first()
    assert food_item is not None
    assert food_item.quantity == 10
    assert food_item.cost == 2.5
    assert food_item.category == 'Fruit'

# Test updating an existing food item
def test_update_food_item(client):
    # Register and log in the user
    register_user(client, 'testuser', 'password123')
    login_user(client, 'testuser', 'password123')

    # First, add a food item
    food_item_data = {
        'name': 'Apple',
        'quantity': 10,
        'unitType': 'kg',
        'cost': 2.5,
        'lowThreshold': 3,
        'category': 'Fruit',
        'expirationDate': '2024-12-31',
        'description': 'Fresh red apples'
    }
    input_food_item(client, food_item_data)

    # Now, update the same food item
    updated_food_item_data = {
        'name': 'Apple',
        'quantity': 5,  # Updated quantity
        'unitType': 'kg',
        'cost': 3.0,    # Updated cost
        'lowThreshold': 3,
        'category': 'Fruit',
        'expirationDate': '2024-12-31',
        'description': 'Fresh red apples with new cost'
    }

    # Input the updated food item
    response = input_food_item(client, updated_food_item_data)
    data = json.loads(response.data)

    # Assert that the response is correct
    assert response.status_code == 201
    assert data['message'] == 'Food item added'

    # Ensure the food item is updated in the database
    food_item = FoodItem.query.filter_by(name='Apple').first()
    assert food_item is not None
    assert food_item.quantity == 5
    assert food_item.cost == 3.0

# Test if a notification is created when the quantity is below the low threshold
def test_food_item_below_low_threshold_notification(client):
    # Register and log in the user
    register_user(client, 'testuser', 'password123')
    login_user(client, 'testuser', 'password123')

    # Add a food item with quantity below the low threshold
    food_item_data = {
        'name': 'Banana',
        'quantity': 2,  # Below low threshold
        'unitType': 'kg',
        'cost': 1.5,
        'lowThreshold': 3,
        'category': 'Fruit',
        'expirationDate': '2024-12-31',
        'description': 'Fresh yellow bananas'
    }

    # Input the food item
    response = input_food_item(client, food_item_data)
    data = json.loads(response.data)

    # Assert the response is correct
    assert response.status_code == 201
    assert data['message'] == 'Food item added'

    # Ensure that the notification has been created
    notification = Notification.query.filter_by(name='Banana').first()
    assert notification is not None
    assert notification.user_id is not None

def test_get_inventory(client):
    # Register and log in the user
    register_user(client, 'testuser', 'password123')
    login_user(client, 'testuser', 'password123')

    # Add some food items to the user's inventory
    food_item_data1 = {
        'name': 'Apple',
        'quantity': 10,
        'unitType': 'kg',
        'cost': 2.5,
        'lowThreshold': 3,
        'category': 'Fruit',
        'expirationDate': '2024-12-31',
        'description': 'Fresh red apples'
    }
    input_food_item(client, food_item_data1)

    food_item_data2 = {
        'name': 'Banana',
        'quantity': 5,
        'unitType': 'kg',
        'cost': 1.5,
        'lowThreshold': 3,
        'category': 'Fruit',
        'expirationDate': '2024-12-31',
        'description': 'Fresh yellow bananas'
    }
    input_food_item(client, food_item_data2)

    # Get the user's inventory
    response = get_inventory(client)
    data = json.loads(response.data)

    # Extract headers and items
    headers = data[1]  # Column names
    items = data[0]    # Food item data

    # Map items into a list of dictionaries
    inventory = [
        dict(zip(headers, item)) for item in items
    ]

    # Assert that the response contains the correct food items
    assert response.status_code == 200  # The request should succeed
    assert len(inventory) == 2  # There should be 2 food items

    # Check that both items are in the inventory
    assert any(item['name'] == 'Apple' for item in inventory)
    assert any(item['name'] == 'Banana' for item in inventory)


