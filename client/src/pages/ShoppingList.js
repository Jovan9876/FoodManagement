import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import FoodList from "../components/FoodList";
import "./ShoppingList.css";

const ShoppingList = () => {
  const [inventory, setInventory] = React.useState([]);

  React.useEffect(() => {
    async function fetchData() {
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
        } else {
          console.error("Error:", response.statusText);
        }
      } catch (error) {
        console.error("Fetch error:", error);
      }
    }
    void fetchData();
  }, []);

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
        window.location.href = 'http://127.0.0.1:3000/';
      } else {
        console.error("Error saving shopping list:", response.statusText);
      }
    } catch (error) {
      console.error("Save error:", error);
    }
  }

  return (
    <div>
      <div className="save_shopping">
        <button onClick={saveShoppingList}>Save Shopping List</button>
      </div>
      <FoodList
        foods={inventory}
        addItem={addItem}
        removeItem={removeItem}
        editItemQuantity={editItemQuantity}
      />
    </div>
  );
};

export default ShoppingList;
