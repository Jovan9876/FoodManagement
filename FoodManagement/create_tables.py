from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from config import config

params = config()
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = f'mysql+pymysql://{params["user"]}:{params["password"]}@{params["host"]}:{params["port"]}/{params["database"]}'
db = SQLAlchemy(app)

# User Table
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)

# Food Item Table
class FoodItem(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    cost = db.Column(db.Numeric(10, 2), nullable=False)
    expiry_date = db.Column(db.Date, nullable=True)
    nutrition_info = db.Column(db.Text, nullable=True)


# To create the table
with app.app_context():
    db.create_all()
