import React from "react";
import { useNavigate } from "react-router-dom";

import { useProjects } from "../../contexts/ProjectsContext";

import ProjectListItem from "../ProjectListItem/ProjectListItem";

import SidebarStyles from "./Sidebar.module.css";

export default function Sidebar() {
  const { projectsError, projects, projectsLoading, editProject, dispatch } =
    useProjects();
  const navigate = useNavigate();

  function addProject() {
    if (editProject) {
      dispatch({
        type: "SET_EDIT_PROJECT",
        payload: null,
      });
    }
    navigate("newproject");
  }

  return (
    <div className={SidebarStyles.container}>
      <div className={SidebarStyles.addProject}>
        <button onClick={addProject}>Add Project</button>
      </div>
      <div className={SidebarStyles.projects}>
        {projectsLoading && (
          <div className={SidebarStyles.loading}>
            <p>Loading..</p>
          </div>
        )}
        {!projectsLoading && projects.length === 0 && (
          <div className={SidebarStyles.noprojects}>
            <p>No Projects</p>
          </div>
        )}
        {!projectsLoading && projects.length === 0 && (
          <div className={SidebarStyles.error}>
            <p>{projectsError}</p>
          </div>
        )}
        {!projectsLoading &&
          projects.length > 0 &&
          projects.map((project) => {
            return (
              <div className={SidebarStyles.projectcontainer}>
                <ProjectListItem project={project} />
              </div>
            );
          })}
      </div>
    </div>
  );
}
