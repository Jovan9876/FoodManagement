import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./FoodList.css";
import FoodItem from "./FoodItem";

const FoodList = ({ foods, addItem, removeItem, editItemQuantity }) => {
  return (
    <div className="food-list">
      {foods.map((food, index) => (
        <FoodItem key={index} food={food} addItem={addItem} removeItem={removeItem} editItemQuantity={editItemQuantity}/>
      ))}
    </div>
  );
};

export default FoodList;
