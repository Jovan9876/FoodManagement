import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import FoodList from "../components/FoodList";

const ShoppingList = () => {
  //   const [inventory, setInventory] = React.useState([]);

  //   React.useEffect(() => {
  //     async function fetchData() {
  //       try {
  //         const response = await fetch("http://127.0.0.1:5000/inventory", {
  //           method: "GET",
  //           credentials: "include",
  //         });
  //         if (response.ok) {
  //           const [rows, columnNames] = await response.json();

  //           const newInventory = rows.map((data) => {
  //             return columnNames.reduce((previous, columnName, index) => {
  //               if (columnName === "nutrition_info") {
  //                 previous[columnName] = JSON.parse(data[index]);
  //               } else {
  //                 previous[columnName] = data[index];
  //               }

  //               return previous;
  //             }, {});
  //           });

  //           setInventory(newInventory);
  //         } else {
  //           console.error("Error:", response.statusText);
  //         }
  //       } catch (error) {
  //         console.error("Fetch error:", error);
  //       }
  //     }
  //     void fetchData();
  //   }, []);

  const foodToBuy = [
    { title: "Pizza", quantity: 1, price: 25, image: "" },
    { title: "Burger", quantity: 2, price: 50, image: "" },
    { title: "Sushi", quantity: 3, price: 30, image: "" },
    { title: "Pasta", quantity: 4, price: 60, image: "" },
    { title: "Apple", quantity: 5, price: 35, image: "" },
    { title: "Cheese", quantity: 6, price: 55, image: "" },
    { title: "Milk", quantity: 2, price: 22, image: "" },
    { title: "Nuts", quantity: 6, price: 31, image: "" },
  ];

  return <FoodList foods={foodToBuy} />;
};

export default ShoppingList;
