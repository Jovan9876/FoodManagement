"""
This module defines the Flask application and its database models for a food management system.

It includes:
- User authentication and management (`User` model).
- Food inventory management (`FoodItem` model).
- Notifications for low-stock food items (`Notification` model).
- Shopping lists and their items (`ShoppingList` and `ShoppingItem` models).

The database uses SQLAlchemy with MySQL, and the Flask application is configured to use
timezone-aware timestamps for date-related fields.
"""

from uuid import uuid4
from datetime import datetime
import pytz
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import JSON
from flask_login import UserMixin
from models import config

# pylint: disable=too-few-public-methods

params = config()
SQLALCHEMY_DATABASE_URI = (
    f'mysql+pymysql://{params["user"]}:{params["password"]}@'
    f'{params["host"]}:{params["port"]}/{params["database"]}'
)
app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = SQLALCHEMY_DATABASE_URI


db = SQLAlchemy(app)


def get_uuid():
    """
    Generates a unique identifier using UUID.

    Returns:
        str: A 32-character hexadecimal string.
    """
    return uuid4().hex


class User(db.Model, UserMixin):
    """
    Represents a user in the food management system.

    Attributes:
        id (str): Unique identifier for the user, generated using `get_uuid`.
        username (str): The username of the user.
        password (str): The hashed password of the user.
    """

    __tablename__ = "users"
    id = db.Column(db.String(32), primary_key=True, unique=True, default=get_uuid)
    username = db.Column(db.String(50))
    password = db.Column(db.Text, nullable=False)


# Food Item Table
class FoodItem(db.Model):
    """
    Represents a food item in the user's inventory.

    Attributes:
        id (int): Unique identifier for the food item.
        name (str): Name of the food item.
        quantity (int): Current quantity of the food item.
        unit_type (str): Unit of measurement (e.g., kg, liters).
        cost (decimal): Cost per unit of the food item.
        low_threshold (int): Minimum quantity before triggering a notification.
        category (str): Category of the food item (e.g., Fruit, Dairy).
        expiry_date (date): Expiration date of the food item.
        nutrition_info (JSON): JSON field for storing nutritional details.
        description (str): Optional description of the food item.
        user_id (str): ID of the user who owns the food item.
    """

    id = db.Column(db.Integer, primary_key=True, unique=True, autoincrement=True)
    name = db.Column(db.String(100), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    unit_type = db.Column(db.String(50), nullable=False)
    cost = db.Column(db.Numeric(10, 2), nullable=False)
    low_threshold = db.Column(db.Integer, nullable=False)
    category = db.Column(db.String(50), nullable=True)
    expiry_date = db.Column(db.Date, nullable=True)
    nutrition_info = db.Column(JSON, nullable=True)
    description = db.Column(db.String(255), nullable=True)
    user_id = db.Column(db.String(32), primary_key=True)


class Notification(db.Model):
    """
    Represents a notification for low-stock food items.

    Attributes:
        id (int): Unique identifier for the notification.
        name (str): Name of the food item triggering the notification.
        user_id (str): ID of the user receiving the notification.
        created_at (datetime): Timestamp when the notification was created.
    """

    id = db.Column(db.Integer, primary_key=True, unique=True, autoincrement=True)
    name = db.Column(db.String(100), nullable=False)
    user_id = db.Column(db.String(32), primary_key=True)
    created_at = db.Column(
        db.DateTime,
        default=lambda: datetime.now(pytz.timezone("America/Vancouver")).astimezone(
            pytz.utc
        ),
        nullable=False,
    )


class ShoppingList(db.Model):
    """
    Represents a shopping list created by the user.

    Attributes:
        id (int): Unique identifier for the shopping list.
        created_at (datetime): Timestamp when the list was created.
        completed_at (datetime): Timestamp when the list was marked as completed.
        user_id (str): ID of the user who owns the shopping list.
    """

    __tablename__ = "Shopping_List"
    id = db.Column(db.Integer, primary_key=True, unique=True, autoincrement=True)
    created_at = db.Column(
        db.DateTime,
        default=lambda: datetime.now(pytz.timezone("America/Vancouver")).astimezone(
            pytz.utc
        ),
        nullable=False,
    )
    completed_at = db.Column(db.DateTime, nullable=True)
    user_id = db.Column(db.String(32), primary_key=True)


class ShoppingItem(db.Model):
    """
    Represents an item in a shopping list.

    Attributes:
        id (int): Unique identifier for the shopping item.
        name (str): Name of the shopping item.
        quantity (int): Quantity to purchase.
        cost (float): Cost of the shopping item.
        list_id (int): Foreign key linking the item to a shopping list.
    """

    __tablename__ = "Shopping_Item"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(100), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    cost = db.Column(db.Float, nullable=False)
    list_id = db.Column(db.Integer, db.ForeignKey("Shopping_List.id"), nullable=False)


# To create the table
with app.app_context():
    db.create_all()
