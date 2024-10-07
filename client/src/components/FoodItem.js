import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./FoodItem.css";

const FoodItem = ({ food: { title, quantity, cost, low_threshold} }) => {
  const fixedCost = parseFloat(cost).toFixed(2);
  const shoppingQuantity = low_threshold - quantity;
  const fixedTotalCost = (shoppingQuantity * fixedCost).toFixed(2);

  return (
    <div className="food-item-card">
      <h2>{title}</h2>
      <img src="" alt="foodImage"></img>
      <p>Quantity: {shoppingQuantity}</p>
      <p>Individual Cost: ${fixedCost}</p>
      <p>Total Cost: ${fixedTotalCost}</p>
      <div className="button-container">
        <button>Edit</button>
        <button>Remove</button>
      </div>
    </div>
  );
};

export default FoodItem;
