import React from "react";

import { useProjects } from "../../contexts/ProjectsContext";
import { useTasks } from "../../contexts/TasksContext";

import DeleteModal from "../DeleteModal/DeleteModal";
import Navigation from "../Navigation/Navigation";
import Sidebar from "../Sidebar/Sidebar";
import TaskGroup from "../TaskGroup/TaskGroup";

import DashBoardStyles from "./Dashboard.module.css";

export default function Dashboard() {
  const { deleteTask } = useTasks();
  const { deleteProject } = useProjects();
  const taskGroups = ["Pending", "Ongoing", "Completed", "Delayed"];

  const openDeleteModal = deleteProject || deleteTask;
  return (
    <div className={DashBoardStyles.container}>
      <div className={DashBoardStyles.sidebar}>
        <Sidebar />
      </div>
      <div>
        <div className={DashBoardStyles.content}>
          <Navigation />
        </div>
        <div className={DashBoardStyles.taskgroups}>
          {taskGroups.map((taskGroup) => {
            return <TaskGroup taskGroup={taskGroup} />;
          })}
        </div>
      </div>
      {openDeleteModal && (
        <>
          <div className={DashBoardStyles.modalcontainer}></div>
          <DeleteModal />
        </>
      )}
    </div>
  );
}
