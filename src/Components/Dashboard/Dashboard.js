import React from "react";
import Sidebar from "../Sidebar/Sidebar";

import DashBoardStyles from "./Dashboard.module.css";

export default function Dashboard() {
  return (
    <div className={DashBoardStyles.container}>
      <Sidebar />
    </div>
  );
}
