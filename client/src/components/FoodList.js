import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./FoodList.css";
import FoodItem from "./FoodItem";

const FoodList = ({ foods }) => {
  return (
    <div className="food-list">
      {foods.map((food, index) => (
        <FoodItem key={index} food={food}/>
      ))}
    </div>
  );
};

export default FoodList;
