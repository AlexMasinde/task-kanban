import React from "react";
import { Link } from "react-router-dom";

import { useAuth } from "../../contexts/AuthContext";

import NavigationStyles from "./Navigation.module.css";

export default function Navigation() {
  const { currentUser } = useAuth();

  function handleLogout() {
    console.log("loging out");
  }

  return (
    <div className={NavigationStyles.container}>
      <div className={NavigationStyles.username}>
        <Link to="/userprofile">
          <p>My Account</p>
        </Link>
      </div>
      <div className={NavigationStyles.logout}>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
}
