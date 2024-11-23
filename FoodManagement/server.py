"""
This module defines the Flask application and its API endpoints for a food management system.

It provides the following functionalities:
- User authentication: Register, login, logout, and fetch the current user.
- Food inventory management: Add, update, and retrieve food items.
- Shopping list management: Save and retrieve shopping lists and items.
- Notifications: Retrieve low-stock food notifications.
- Nutrition data: Fetch and process food nutritional information using the FatSecret API.

The application uses:
- SQLAlchemy for database interaction.
- Flask-Bcrypt for password hashing.
- Flask-Session for session management.
- Flask-CORS for cross-origin request support.
"""

from flask import Flask, request, json, session
from flask_bcrypt import Bcrypt
from flask_session import Session
from flask_cors import CORS

# Local imports
from models import load_user_foods, load_shopping_foods
from create_tables import Notification, FoodItem, User, ShoppingList, ShoppingItem, db
from get_food_data import get_food_data
from app_config import ApplicationConfig

app = Flask(__name__)
app.config.from_object(ApplicationConfig)
bcrypt = Bcrypt(app)
CORS(app, supports_credentials=True, resources={r"/*": {"origins": "http://127.0.0.1:3000"}})
server_session = Session(app)
db.init_app(app)

@app.route("/@me", methods=["GET"])
def get_current_user():
    """
    Retrieves the currently logged-in user's details.

    Returns:
        Response: JSON containing the user's ID and username if logged in.
        Response: JSON with an error message and status 401 if not logged in.
    """
    user_id = session.get("user_id")
    if not user_id:
        return json.jsonify({"error": "Unauthorized"}), 401

    user = User.query.filter_by(id=user_id).first()
    return json.jsonify({"id": user.id, "username": user.username})


@app.route("/login", methods=["POST"])
def login_user():
    """
    Logs in a user by validating their credentials.

    Request JSON:
        {
            "username": str,
            "password": str
        }

    Returns:
        Response: JSON containing the user's ID and username if credentials are valid.
        Response: JSON with an error message and status 401 if invalid credentials.
    """
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")

    user = User.query.filter_by(username=username).first()

    if user is None:
        return json.jsonify({"error": "Unauthorized"}), 401

    if not bcrypt.check_password_hash(user.password, password):
        return json.jsonify({"error": "Unauthorized"}), 401

    session["user_id"] = user.id
    return json.jsonify({"id": user.id, "username": user.username})


@app.route("/register", methods=["POST"])
def register_user():
    """
    Registers a new user in the system.

    Request JSON:
        {
            "username": str,
            "password": str
        }

    Returns:
        Response: JSON containing the user's ID and username if registration is successful.
        Response: JSON with an error message and status 409 if the username already exists.
    """
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")

    user_exists = User.query.filter_by(username=username).first() is not None
    if user_exists:
        return json.jsonify({"error": "User already exists"}), 409

    hashed_password = bcrypt.generate_password_hash(password)
    new_user = User(username=username, password=hashed_password)
    db.session.add(new_user)
    db.session.commit()
    session["user_id"] = new_user.id
    return json.jsonify({"id": new_user.id, "username": new_user.username})


@app.route("/logout", methods=["POST"])
def logout_user():
    """
    Logs out the currently logged-in user by clearing their session.

    Returns:
        Response: JSON with a success message and status 200.
    """
    session.pop("user_id")
    return json.jsonify({"message": "Logged out successfully"}), 200


@app.route("/inventory", methods=["GET"])
def get_inventory():
    """
    Retrieves the inventory of the currently logged-in user.

    Returns:
        Response: JSON containing a list of food items in the inventory if the user is logged in.
        Response: JSON with an error message and status 401 if the user is not logged in.
    """
    user_id = session.get("user_id")

    if not user_id:
        return json.jsonify({"error": "Unauthorized"}), 401

    foods = load_user_foods(user_id)
    return json.jsonify(foods)


@app.route("/expenses", methods=["GET"])
def get_expenses():
    """
    Retrieves the food expenses for the currently logged-in user.

    The function queries the user's food items and returns the data as JSON.

    Returns:
        Response: JSON containing the list of food items if the user is logged in.
        Response: JSON with an error message and status 401 if the user is not logged in.
    """
    user_id = session.get("user_id")

    if not user_id:
        return json.jsonify({"error": "Unauthorized"}), 401

    foods = load_user_foods(user_id)
    return json.jsonify(foods)


@app.route("/shopping", methods=["GET"])
def get_shopping():
    """
    Retrieves the shopping list for the currently logged-in user.

    The function queries the user's food items that are below the low threshold
    and returns the data as JSON.

    Returns:
        Response: JSON containing the list of food items to shop for if the user is logged in.
        Response: JSON with an error message and status 401 if the user is not logged in.
    """
    user_id = session.get("user_id")

    if not user_id:
        return json.jsonify({"error": "Unauthorized"}), 401

    foods = load_shopping_foods(user_id)
    return json.jsonify(foods)


@app.route("/shopping/save", methods=["POST"])
def save_shopping_list():
    """
    Saves a shopping list for the currently logged-in user.

    Request JSON:
        [
            {
                "name": str,
                "quantity": int,
                "cost": float
            },
            ...
        ]

    Returns:
        Response: JSON with a success message and status 201.
    """
    data = request.get_json()
    inventory = data
    user_id = session.get("user_id")

    new_shopping_list = ShoppingList(user_id=user_id)
    db.session.add(new_shopping_list)
    db.session.flush()

    for item in inventory:
        new_item = ShoppingItem(
            name=item["name"],
            quantity=item["quantity"],
            cost=item["cost"],
            list_id=new_shopping_list.id,
        )
        db.session.add(new_item)

    db.session.commit()
    return json.jsonify({"message": "Shopping list saved successfully"}), 201


@app.route("/input_food", methods=["POST"])
def add_food():
    """
    Adds or updates a food item in the user's inventory.

    Request JSON:
        {
            "name": str,
            "quantity": int,
            "unitType": str,
            "cost": float,
            "lowThreshold": int,
            "category": str,
            "expirationDate": str (YYYY-MM-DD),
            "description": str
        }

    Returns:
        Response: JSON with a success message and status 201 if the operation is successful.
    """
    data = request.get_json()
    food_item = None
    existing_food_item = FoodItem.query.filter_by(
        name=data["name"], user_id=session["user_id"]
    ).first()
    if existing_food_item:
        existing_food_item.quantity = int(data["quantity"])
        existing_food_item.cost = float(data["cost"])
        existing_food_item.expiry_date = data["expirationDate"]
        existing_food_item.low_threshold = int(data["lowThreshold"])
        food_item = existing_food_item
    else:
        new_food_item = FoodItem(
            name=data["name"],
            quantity=int(data["quantity"]),
            unit_type=data["unitType"],
            cost=float(data["cost"]),
            low_threshold=int(data["lowThreshold"]),
            category=data["category"],
            expiry_date=data["expirationDate"],
            description=data["description"],
            user_id=session["user_id"],
            nutrition_info=get_food_data(data["name"]),
        )
        food_item = new_food_item
        db.session.add(new_food_item)

    if food_item.quantity <= food_item.low_threshold:
        notification = Notification(
            user_id=session["user_id"],
            name=food_item.name,
        )
        db.session.add(notification)
    db.session.commit()
    return json.jsonify({"message": "Food item added"}), 201


# Retrieves food item by it's name
@app.route("/food/<food>", methods=["GET"])
def get_food_item(food):
    """
    Retrieves details of a specific food item by its name.

    Args:
        food (str): The name of the food item.

    Returns:
        Response: JSON containing the food item's details if found.
        Response: JSON with an error message and status 404 if not found.
    """
    food_item = FoodItem.query.filter_by(name=food, user_id=session["user_id"]).first()
    if food_item:
        return (
            json.jsonify(
                {
                    "name": food_item.name,
                    "quantity": food_item.quantity,
                    "unit_type": food_item.unit_type,
                    "cost": food_item.cost,
                    "low_threshold": food_item.low_threshold,
                    "category": food_item.category,
                    "expiration_date": food_item.expiry_date.strftime("%Y-%m-%d"),
                    "description": food_item.description,
                    "nutrition_info": food_item.nutrition_info,
                }
            ),
            200,
        )
    else:
        return json.jsonify({"error": "Food item not found"}), 404


# Retrieves all user's notifiations
@app.route("/notifications", methods=["GET"])
def get_notifications():
    """
    Retrieves all notifications for the currently logged-in user.

    Returns:
        Response: JSON containing a list of notifications if found.
        Response: JSON with an error message and status 404 if no notifications are found.
    """
    notifications = Notification.query.filter_by(user_id=session["user_id"]).all()
    if notifications:
        notifications_list = [
            {"name": notification.name, "created_at": notification.created_at}
            for notification in notifications
        ]
        return json.jsonify(notifications_list), 200
    else:
        return json.jsonify({"error": "Notifications not found"}), 404


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
