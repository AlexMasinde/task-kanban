import React from "react";
import { useNavigate } from "react-router-dom";
import { Scrollbar } from "react-scrollbars-custom";

import { useProjects } from "../../contexts/ProjectsContext";
import { deleteSavedItem } from "../../utils/localStorage";

import Loading from "../Loading/Loading";
import ProjectListItem from "../ProjectListItem/ProjectListItem";

import SidebarStyles from "./Sidebar.module.css";

export default function Sidebar() {
  const { projectsError, projects, projectsLoading, editProject, dispatch } =
    useProjects();
  const navigate = useNavigate();

  function addProject() {
    deleteSavedItem("projectToEdit");
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
      <Scrollbar style={{ width: "100%", height: `calc(100vh - 100px)` }}>
        <div className={SidebarStyles.projects}>
          {projectsLoading && (
            <div className={SidebarStyles.loading}>
              <Loading />
            </div>
          )}
          {!projectsLoading && projects.length === 0 && !projectsError && (
            <div className={SidebarStyles.noprojects}>
              <p>No Projects</p>
            </div>
          )}
          {projectsError && (
            <div className={SidebarStyles.error}>
              <p>{projectsError}</p>
            </div>
          )}
          {!projectsLoading &&
            projects.length > 0 &&
            projects.map((project) => {
              return (
                <div
                  className={SidebarStyles.projectcontainer}
                  key={project.id}
                >
                  <ProjectListItem project={project} />
                </div>
              );
            })}
        </div>
      </Scrollbar>
    </div>
  );
}
