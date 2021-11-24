import React from "react";
import { useAuth } from "../../contexts/AuthContext";

import DashBoardStyles from "./Dashboard.module.css";

export default function Dashboard() {
  const { userSingOut } = useAuth();

  function handleSignOut() {
    userSingOut();
  }
  return (
    <div>
      <p>This is a new React project</p>
      <button onClick={handleSignOut}>Logout</button>
    </div>
  );
}
