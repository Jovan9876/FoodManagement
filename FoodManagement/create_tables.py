from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import JSON, event
from models import config
from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash

params = config()
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = f'mysql+pymysql://{params["user"]}:{params["password"]}@{params["host"]}:{params["port"]}/{params["database"]}'
db = SQLAlchemy(app)

class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50))
    password = db.Column(
        db.String(300), primary_key=False, unique=False, nullable=False
    )
    def __init__(self, username, password, is_active=True):
        """Initializes user object"""
        self.username = username
        self.password = password
        self.is_active = is_active

    def is_active(self):
        """Method to check if user is active"""
        return self.active

    def get_id(self):
        """Method to get user id"""
        return str(self.id)

    def is_authenticated(self):
        """Method to check if user is authenticated"""
        return True

    def validate_password(self, password):
        """Method to validate password"""
        return check_password_hash(self.password, password)

    def __repr__(self):
        """Debugging method"""
        return f"{self.username}"


# Event listener to hash password before saving to database, updates on changes
@event.listens_for(User.password, "set", retval=True)
def hash_password(target, value, oldvalue, initiator):
    """Hash password when saving or upating users table"""
    if value != oldvalue:
        return generate_password_hash(value, method="pbkdf2:sha256")
    return value


# Food Item Table
class FoodItem(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    cost = db.Column(db.Numeric(10, 2), nullable=False)
    expiry_date = db.Column(db.Date, nullable=True)
    nutrition_info = db.Column(JSON, nullable=True)
    user_id = db.Column(db.Integer, nullable=False)
    # user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

# Removed foreign key temporarily

# To create the table
with app.app_context():
    db.create_all()
