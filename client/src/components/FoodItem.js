import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./FoodItem.css";

const FoodItem = ({
  food: { id, name, quantity, cost, low_threshold },
  addItem,
  removeItem,
  editItemQuantity,
}) => {
  const [isPopUpOpen, setIsPopUpOpen] = useState(false);
  const [newQuantity, setNewQuantity] = useState(low_threshold - quantity);
  //const [foodImage, setFoodImage] = useState("");

  const fixedCost = parseFloat(cost).toFixed(2);
  const fixedTotalCost = (newQuantity * fixedCost).toFixed(2);

  const openPopUp = () => setIsPopUpOpen(true);
  const closePopUp = () => setIsPopUpOpen(false);

  const saveQuantity = () => {
    editItemQuantity(id, newQuantity);
    closePopUp();
  };

  // React.useEffect(() => {
  //   if (name) {
  //       const fetchFoodItemImage = async () => {
  //           try {
  //               const response = await fetch(`http://127.0.0.1:5000/food_image/${name}`, {
  //                 method: 'GET', // GET request
  //                 credentials: 'include', // Include cookies for session management
  //               });
  //               if (response.ok) {
  //                   const data = await response.json();
  //                   setFoodImage(data);
  //               } else {
  //                   console.error('Error fetching food item:', response.statusText);
  //               }
  //           } catch (error) {
  //               console.error('Fetch error:', error);
  //           }
  //       };

  //       fetchFoodItemImage();
  //   }
  // }, [name]);

  return (
    <div>
      <div className="food-item-card">
        <h2>{name}</h2>
        <img src="" alt="foodImage"></img>
        <p>Quantity: {newQuantity}</p>
        <p>Individual Cost: ${fixedCost}</p>
        <p>Total Cost: ${fixedTotalCost}</p>
        <div className="button-container">
          <button onClick={openPopUp}>Edit</button>
          <button onClick={() => removeItem(id)}>Remove</button>
        </div>
      </div>

      {isPopUpOpen && (
        <div className="PopUp-overlay">
          <div className="PopUp-content">
            <h3>Edit Quantity for {name}</h3>
            <input
              type="number"
              value={newQuantity}
              onChange={(e) => setNewQuantity(Number(e.target.value))}
              min="0"
            />
            <div className="PopUp-buttons">
              <button onClick={saveQuantity}>Save</button>
              <button onClick={closePopUp}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FoodItem;
