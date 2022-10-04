import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Axios from "axios";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import Forgot from "./Pages/Forgot";
import ChangePass from "./Pages/ChangePass";
import Search from "./Pages/Search";

function App() {
  /**
   * Is the user logged in
   */
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  /**
   * Is the user logged in
   */
   const [accountType, setAccountType] = useState(0);

  /**
   * Handles authentication - Checks to see if user is logged in
   */
  const userAuthenticated = () => {
    Axios.get("isUserAuth")
      .then((response) => {
        // Check if admin
        if (response.data.accountType) {
          //setAdminStatus(true);
        }
        setIsLoggedIn(true);
      });
  }

  /**
   * On page load
  */
  useEffect(() => {
    // Keep user session active
    userAuthenticated();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="search" element={<Search />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
