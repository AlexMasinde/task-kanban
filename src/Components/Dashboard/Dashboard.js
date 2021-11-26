import React from "react";

import { useProjects } from "../../contexts/ProjectsContext";
import { useTasks } from "../../contexts/TasksContext";

import DeleteModal from "../DeleteModal/DeleteModal";
import Sidebar from "../Sidebar/Sidebar";
import TaskGroup from "../TaskGroup/TaskGroup";

import DashBoardStyles from "./Dashboard.module.css";

export default function Dashboard() {
  const { deleteTask } = useTasks();
  const { deleteProject } = useProjects();
  const taskGroups = ["Pending", "Ongoing", "Completed"];

  const openDeleteModal = deleteProject || deleteTask;
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
      {openDeleteModal && (
        <>
          <div className={DashBoardStyles.modalcontainer}></div>
          <DeleteModal />
        </>
      )}
    </div>
  );
}
