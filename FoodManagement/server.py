from flask import Flask, request,json, session
from flask_bcrypt import Bcrypt
from flask_session import Session
from flask_cors import CORS

# Local imports
from models import load_user_foods, load_shopping_foods
from create_tables import FoodItem, User, db
from get_food_data import get_food_data
from app_config import ApplicationConfig

app = Flask(__name__)
app.config.from_object(ApplicationConfig)
bcrypt = Bcrypt(app)
CORS(app, supports_credentials=True)
server_session = Session(app)
db.init_app(app)


@app.route("/@me", methods=["GET"])
def get_current_user():
    user_id = session.get("user_id")
    if not user_id:
        return json.jsonify({"error": "Unauthorized"}), 401

    user = User.query.filter_by(id=user_id).first()
    return json.jsonify({
        "id": user.id,
        "username": user.username
    })

@app.route("/login", methods=["POST"])
def login_user():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")

    user = User.query.filter_by(username=username).first()

    if user is None:
        return json.jsonify({"error": "Unauthorized"}), 401

    if not bcrypt.check_password_hash(user.password, password):
        return json.jsonify({"error": "Unauthorized"}), 401

    session["user_id"] = user.id
    return json.jsonify({
        "id": user.id,
        "username": user.username
    })


@app.route("/register", methods=["POST"])
def register_user():
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
    return json.jsonify({
        "id": new_user.id,
        "username": new_user.username
    })


@app.route("/logout", methods=["POST"])
def logout_user():
    session.pop("user_id")
    return json.jsonify({"message": "Logged out successfully"}), 200


@app.route('/inventory', methods=['GET'])
def get_inventory():
    user_id = session.get("user_id")

    if not user_id:
        return json.jsonify({"error": "Unauthorized"}), 401

    foods = load_user_foods(user_id)
    return json.jsonify(foods)

@app.route('/expenses', methods=['GET'])
def get_expenses():
    user_id = session.get("user_id")

    if not user_id:
        return json.jsonify({"error": "Unauthorized"}), 401

    foods = load_user_foods(user_id)
    return json.jsonify(foods)

@app.route('/shopping', methods=['GET'])
def get_shopping():
    user_id = session.get("user_id")

    if not user_id:
        return json.jsonify({"error": "Unauthorized"}), 401

    foods = load_shopping_foods(user_id)
    return json.jsonify(foods)

@app.route('/input_food', methods=['POST'])
def add_food():
    data = request.get_json()

    existing_food_item = FoodItem.query.filter_by(
        name=data['name'],
        user_id=session["user_id"]
    ).first()
    if existing_food_item:
        existing_food_item.quantity = int(data['quantity'])
        existing_food_item.cost = float(data['cost'])
        existing_food_item.expiry_date = data['expirationDate']
        existing_food_item.low_threshold = int(data['lowThreshold']),
    else:
        new_food_item = FoodItem(
            name=data['name'],
            quantity=int(data['quantity']),
            unit_type=data['unitType'],
            cost=float(data['cost']),
            low_threshold=int(data['lowThreshold']),
            category=data['category'],
            expiry_date=data['expirationDate'],
            description=data['description'],
            user_id=session["user_id"],
            nutrition_info=get_food_data(data['name'])
        )
        db.session.add(new_food_item)
    db.session.commit()
    return json.jsonify({"message": "Food item added"}), 201

# Retrieves food item by it's name
@app.route('/food/<food>', methods=['GET'])
def get_food_item(food):
    food_item = FoodItem.query.filter_by(
        name=food,
        user_id=session["user_id"]
    ).first()
    if food_item:
        return json.jsonify({
            "name": food_item.name,
            "quantity": food_item.quantity,
            "unit_type": food_item.unit_type,
            "cost": food_item.cost,
            "low_threshold": food_item.low_threshold,
            "category": food_item.category,
            "expiration_date": food_item.expiry_date.strftime("%Y-%m-%d"),
            "description": food_item.description,
            "nutrition_info": food_item.nutrition_info
        }), 200
    else:
        return json.jsonify({"error": "Food item not found"}), 404

if __name__ == '__main__':
    app.run(debug=True)

