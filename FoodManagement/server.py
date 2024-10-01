from flask import Flask, render_template, request,json, redirect
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from models import config
from models import load_user_foods
from create_tables import FoodItem
from get_food_data import get_food_data

params = config()
app = Flask(__name__)
CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] = f'mysql+pymysql://{params["user"]}:{params["password"]}@{params["host"]}:{params["port"]}/{params["database"]}'
db = SQLAlchemy(app)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/about')
def about():
    return render_template('about.html')

@app.route('/input_food', methods=['POST'])
def add_food():
    data = request.get_json()
    new_food_item = FoodItem(
        name=data['name'],
        quantity=2,
        cost=2,
        user_id=4,
        nutrition_info=get_food_data(data['name'])
    )
    db.session.add(new_food_item)
    db.session.commit()
    return json.jsonify({"message": "Food item added"}), 201

if __name__ == '__main__':
    app.run(debug=True)

