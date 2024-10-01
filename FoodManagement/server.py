from flask import Flask, render_template, request,json, redirect, flash
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

from flask_login import (
    login_required,
    login_user,
    logout_user,
    LoginManager,
    current_user,
)

# Local imports
from models import config
from models import load_user_foods
from create_tables import FoodItem, User
from get_food_data import get_food_data

params = config()
app = Flask(__name__)
CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] = f'mysql+pymysql://{params["user"]}:{params["password"]}@{params["host"]}:{params["port"]}/{params["database"]}'
db = SQLAlchemy(app)

# Flask Login Manager
login_manager = LoginManager(app)
login_manager.login_view = "login"

# Login Manager
@login_manager.user_loader
def load_user(user_id):
    """Query the database for the user_id and return the user object"""
    try:
        user = db.session.query(User).filter_by(id=user_id).one()
        return user

    except:
        return None

@app.route("/", methods=["GET"])
def login():
    """Login method if user is authenticated"""
    if request.method == "GET":
        if current_user.is_authenticated:
            return redirect("/home")
        return render_template("login.html")

@app.route("/login", methods=["POST"])
def submit_login():
    """Login Submit method if credentials are valid, otherwise redirect to login page"""
    if request.method == "POST":
        username = request.form["username"]
        password = request.form["password"]
        try:
            user = db.session.query(User).filter_by(username=username).one()
        except:
            flash("Login Information is Incorrect")
            return redirect("/")
        if user.validate_password(password):
            login_user(user)
            return redirect("/home")
        else:
            flash("Login Information is Incorrect")
            return redirect("/")

@app.route('/register', methods=['POST', 'GET'])
def register_user():
    data = request.get_json()
    new_user = User(
        username=data['username'],
        password=data['password'],
    )
    db.session.add(new_user)
    db.session.commit()
    return json.jsonify({"message": "User Registered"}), 201

# Logout user
@app.route("/logout")
def logout():
    """Logout method"""
    logout_user()
    return redirect("/")

@app.route('/input_food', methods=['POST'])
# @login_required
def add_food():
    data = request.get_json()
    new_food_item = FoodItem(
        name=data['name'],
        quantity=int(data['quantity']),
        cost=float(data['cost']),
        user_id=4,
        nutrition_info=get_food_data(data['name'])
    )
    db.session.add(new_food_item)
    db.session.commit()
    return json.jsonify({"message": "Food item added"}), 201


if __name__ == '__main__':
    app.run(debug=True)

