from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import JSON
from models import config
from flask_login import UserMixin
from uuid import uuid4

params = config()
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = f'mysql+pymysql://{params["user"]}:{params["password"]}@{params["host"]}:{params["port"]}/{params["database"]}'
db = SQLAlchemy(app)

def get_uuid():
    return uuid4().hex

class User(db.Model, UserMixin):
    __tablename__ = "users"
    id = db.Column(db.String(32), primary_key=True, unique=True, default=get_uuid)
    username = db.Column(db.String(50))
    password = db.Column(db.Text, nullable=False)


# Food Item Table
class FoodItem(db.Model):
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


# To create the table
with app.app_context():
    db.create_all()
