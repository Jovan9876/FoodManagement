import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import FoodList from "../components/FoodList";

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

  return <FoodList foods={inventory} />;
};

export default ShoppingList;
