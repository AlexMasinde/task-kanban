import React from "react";
import { Scrollbar } from "react-scrollbars-custom";

import { useProjects } from "../../contexts/ProjectsContext";
import { useTasks } from "../../contexts/TasksContext";

import DeleteModal from "../DeleteModal/DeleteModal";
import Navigation from "../Navigation/Navigation";
import Sidebar from "../Sidebar/Sidebar";
import TaskGroup from "../TaskGroup/TaskGroup";
import SelectProject from "../SelectProject/SelectProject";

import DashBoardStyles from "./Dashboard.module.css";

export default function Dashboard() {
  const { deleteTask } = useTasks();
  const { deleteProject, selectedProject, projectsError } = useProjects();
  const taskGroups = ["Pending", "Ongoing", "Completed", "Delayed"];

  const openDeleteModal = deleteProject || deleteTask;
  return (
    <div className={DashBoardStyles.container}>
      <div className={DashBoardStyles.sidebar}>
        <Sidebar />
      </div>
      <div className={DashBoardStyles.testdiv}>
        <div className={DashBoardStyles.content}>
          <Navigation />
        </div>

        {selectedProject && (
          <Scrollbar style={{ width: "100%", height: `calc(100vh - 100px)` }}>
            <div className={DashBoardStyles.taskgroups}>
              {taskGroups.map((taskGroup) => {
                return <TaskGroup taskGroup={taskGroup} key={taskGroup} />;
              })}
            </div>
          </Scrollbar>
        )}
        {!selectedProject && !projectsError && (
          <div className={DashBoardStyles.selectproject}>
            <SelectProject />
          </div>
        )}
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
