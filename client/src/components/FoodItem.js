import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./FoodItem.css";

const FoodItem = ({ food: { title, quantity, price, image } }) => {
  return (
    <div className="food-item-card">
      <h2>{title}</h2>
      <img src={image} alt="foodImage"></img>
      <p>Quantity: {quantity}</p>
      <p>Individual Price: ${price}</p>
      <p>Total Price: ${quantity * price}</p>
      <div className="button-container">
        <button>Edit</button>
        <button>Remove</button>
      </div>
    </div>
  );
};

export default FoodItem;
