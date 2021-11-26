import React from "react";
import Sidebar from "../Sidebar/Sidebar";
import TaskGroup from "../TaskGroup/TaskGroup";

import DashBoardStyles from "./Dashboard.module.css";

export default function Dashboard() {
  const taskGroups = ["Pending", "Ongoing", "Completed"];
  return (
    <div className={DashBoardStyles.container}>
      <div className={DashBoardStyles.sidebar}>
        <Sidebar />
      </div>
      <div className={DashBoardStyles.taskgroups}>
        {taskGroups.map((taskGroup) => {
          return <TaskGroup taskGroup={taskGroup} />;
        })}
      </div>
    </div>
  );
}
