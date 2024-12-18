import React, { useEffect, useState } from "react";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import "./App.css";
import { ComplexNavbar } from "./components/Navbar";
import { Expenses, Inventory } from "./pages";
import FoodInput from "./pages/FoodInput";
import LoginInput from "./pages/LoginInput";
import RegisterInput from "./pages/Register";
import ShoppingList from "./pages/ShoppingList";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch user info to check authentication status
    fetch("http://127.0.0.1:5000/@me", {
      method: "GET",
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.id) {
          setIsAuthenticated(true); // User is authenticated
        } else {
          setIsAuthenticated(false); // User is not authenticated
        }
        setLoading(false); // Stop loading
      })
      .catch((error) => {
        console.error("Error:", error);
        setIsAuthenticated(false);
        setLoading(false); // Stop loading
      });
  }, []);

  // Function to update authentication state
  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <div className="pt-2">
        {/* Render navbar only if the user is authenticated */}
        {isAuthenticated && <ComplexNavbar />}

        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginInput onLogin={handleLogin} />} />
          <Route path="/register" element={<RegisterInput />} />

          {/* Private routes */}
          {isAuthenticated ? (
            <React.Fragment>
              <Route path="/" element={<Inventory />} />
              <Route path="/input" element={<FoodInput />} />
              <Route path="/input/:food" element={<FoodInput />} />
              <Route path="/expenses" element={<Expenses />} />
              <Route path="/shopping" element={<ShoppingList />} />
            </React.Fragment>
          ) : (
            <Route path="*" element={<Navigate to="/login" />} />
          )}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
