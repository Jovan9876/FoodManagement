import React, { useState } from "react";
import FoodList from "../components/FoodList";
import "./ShoppingList.css";
import ListHistory from "../components/ListHistory";

const ShoppingList = () => {
  const [inventory, setInventory] = useState([]);
  const [showLists, setShowLists] = useState(true);

  async function fetchShoppingData() {
    try {
      const response = await fetch("http://127.0.0.1:5000/shopping", {
        method: "GET",
        credentials: "include",
      });
      if (response.ok) {
        const [rows, columnNames] = await response.json();

        const newInventory = rows.map((data) => {
          return columnNames.reduce((previous, columnName, index) => {
            if (columnName === "nutrition_info") {
              previous[columnName] = JSON.parse(data[index]);
            } else {
              previous[columnName] = data[index];
            }

            return previous;
          }, {});
        });

        setInventory(newInventory);
        toggleShowLists();
      } else {
        console.error("Error:", response.statusText);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    }
  }

  const toggleShowLists = () => {
    if (!showLists) setInventory([]);
    setShowLists((prevState) => !prevState);
  };

  const addItem = (newItem) => {
    setInventory((prevInventory) => [...prevInventory, newItem]);
  };

  const removeItem = (id) => {
    setInventory((prevInventory) =>
      prevInventory.filter((item) => item.id !== id)
    );
  };

  const editItemQuantity = (id, newQuantity) => {
    setInventory((prevInventory) =>
      prevInventory.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  async function saveShoppingList() {
    try {
      const response = await fetch("http://127.0.0.1:5000/shopping/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(inventory),
      });

      if (response.ok) {
        console.log("Shopping list saved successfully!");
        toggleShowLists();
      } else {
        console.error("Error saving shopping list:", response.statusText);
      }
    } catch (error) {
      console.error("Save error:", error);
    }
  }

  return (
    <div>
      <div className="shopping">
        {showLists && (
          <button onClick={fetchShoppingData}>Generate Shopping List</button>
        )}
        {!showLists && <button onClick={toggleShowLists}>Back</button>}
        {!showLists && (
          <button onClick={saveShoppingList}>Save Shopping List</button>
        )}
      </div>
      <div>
        {!showLists && (
          <FoodList
            foods={inventory}
            addItem={addItem}
            removeItem={removeItem}
            editItemQuantity={editItemQuantity}
          />
        )}
        {showLists && <ListHistory />}
      </div>
    </div>
  );
};

export default ShoppingList;
