import React from "react";
import { Link } from "react-router-dom";

import { useAuth } from "../../contexts/AuthContext";
import { useProjects } from "../../contexts/ProjectsContext";
import { useTasks } from "../../contexts/TasksContext";

import closeicon from "../../icons/closeicongrey.svg";

import NavigationStyles from "./Navigation.module.css";

export default function Navigation() {
  const { currentUser, userSingOut } = useAuth();
  const { notification, setNotification } = useTasks();
  const { projectsError } = useProjects();

  async function handleLogout() {
    await userSingOut();
  }

  function closeNotification() {
    setNotification(false);
  }

  return (
    <div className={NavigationStyles.container}>
      {notification && !projectsError && (
        <div className={NavigationStyles.notification}>
          <p>Update a task's status by dragging it to a new category</p>
          <img onClick={closeNotification} src={closeicon} alt="close" />
        </div>
      )}
      <div style={{ display: "flex", alignItems: "center" }}>
        <div className={NavigationStyles.username}>
          <Link to="/userprofile">
            <p>
              My Account:{" "}
              <span>{`${
                currentUser.displayName ? currentUser.displayName.split(' ')[0] : currentUser.email
              }`}</span>
            </p>
          </Link>
        </div>
        <div className={NavigationStyles.logout}>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </div>
    </div>
  );
}
