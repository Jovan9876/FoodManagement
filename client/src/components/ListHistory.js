import React, { useState } from "react";
import ListDisplay from "./ListDisplay";
import "./ListHistory.css";

const ListHistory = () => {
  const [history, setHistory] = useState([]);

  React.useEffect(() => {
    async function fetchShoppingData() {
      try {
        const response = await fetch("http://127.0.0.1:5000/shoppingHistory", {
          method: "GET",
          credentials: "include",
        });
        if (response.ok) {
          const newHistory = await response.json();
          newHistory.sort(
            (a, b) => new Date(b.created_at) - new Date(a.created_at)
          );
          setHistory(newHistory);
        } else {
          console.error("Error:", response.statusText);
        }
      } catch (error) {
        console.error("Fetch error:", error);
      }
    }

    fetchShoppingData();
  }, []);

  const removeItemById = (id) => {
    setHistory((prevHistory) => prevHistory.filter(item => item.listId !== id));
  };

  const formattedHistory = history.map(item => {
    const date = new Date(item.created_at);
    const formattedDate = new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    }).format(date);
  
    return {
      ...item,
      created_at: formattedDate
    };
  });

  return (
    <div className="list">
      {formattedHistory.map((shoppingList) => (
        <ListDisplay key={shoppingList.listId} list={shoppingList} removeList={removeItemById}/>
      ))}
    </div>
  );
};

export default ListHistory;
