import React, { useState } from "react";
import "./ListDisplay.css";
import PopUp from "./PopUp";

const ListDisplay = ({ list: { listId, created_at }, removeList }) => {
  const [shoppingItems, setShoppingItems] = useState([]);
  const [isPopUpOpen, setIsPopUpOpen] = useState(false);
  const [popUpMessage, setPopUpMessage] = useState("");
  const [requestType, setRequestType] = useState("");

  const totalItems = shoppingItems.length;
  const totalCost = shoppingItems.reduce(
    (sum, item) => sum + item.cost * item.quantity,
    0
  );

  const closePopUp = () => setIsPopUpOpen(false);

  const requestView = () => {
    const itemsMessage = shoppingItems.map((item, index) => (
      <div key={index}>
        {index + 1}.- Name: {item.name} | Quantity: {item.quantity} | Cost:{" "}
        {item.cost}
      </div>
    ));

    setPopUpMessage(itemsMessage);
    setIsPopUpOpen(true);
    setRequestType("view");
  };

  const requestRestock = () => {
    setPopUpMessage(
      "Are you sure you want to restock your inventory with the items in this shopping list?"
    );
    setIsPopUpOpen(true);
    setRequestType("restock");
  };

  const requestDelete = () => {
    setPopUpMessage("Are you sure you want to delete this shopping list?");
    setIsPopUpOpen(true);
    setRequestType("delete");
  };

  async function restockItems() {
    try {
      const response = await fetch(
        `http://127.0.0.1:5000/shoppingHistory/restock`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({listId, created_at}),
        }
      );

      if (response.ok) {
        console.log(
          `Inventory successfully restocked from Shopping list with ID ${listId}.`
        );
        window.location.href = 'http://127.0.0.1:3000/';
      } else {
        console.error("Error:", response.statusText);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    }
  }

  async function deleteShoppingList() {
    try {
      const response = await fetch(
        `http://127.0.0.1:5000/shoppingHistory/${listId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (response.ok) {
        removeList(listId);
        console.log(
          `Shopping list with ID ${listId} has been deleted successfully.`
        );
      } else {
        console.error("Error:", response.statusText);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    }
  }

  React.useEffect(() => {
    async function fetchShoppingListItems() {
      try {
        const response = await fetch(
          `http://127.0.0.1:5000/shopping/${listId}`,
          {
            method: "GET",
            credentials: "include",
          }
        );
        if (response.ok) {
          const newShoppingItems = await response.json();
          setShoppingItems(newShoppingItems);
        } else {
          console.error("Error:", response.statusText);
        }
      } catch (error) {
        console.error("Fetch error:", error);
      }
    }

    fetchShoppingListItems();
  }, []);

  const requestActions = {
    view: () => {},
    restock: restockItems,
    delete: deleteShoppingList,
  };

  return (
    <div>
      <div className="item-card">
        <h2>{created_at}</h2>
        <p>Total Items: {totalItems}</p>
        <p>Total Cost: ${totalCost}</p>
        <div className="button-container">
          <button onClick={requestView}>View Items</button>
          <button onClick={requestRestock}>Restock</button>
          <button onClick={requestDelete}>Delete</button>
        </div>
      </div>
      {isPopUpOpen && (
        <PopUp
          message={popUpMessage}
          confirm={requestActions[requestType]}
          cancel={closePopUp}
          type={requestType}
        />
      )}
    </div>
  );
};

export default ListDisplay;
