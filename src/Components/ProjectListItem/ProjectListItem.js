import React from "react";
import { useNavigate } from "react-router";

import { useProjects } from "../../contexts/ProjectsContext";

import { formatProjectDateTime } from "../../utils/formatDate";

import editproject from "../../icons/edit.svg";
import deleteicon from "../../icons/delete.svg";

import ProjectListItemStyles from "./ProjectListItem.module.css";

export default function ProjectListItem({ project }) {
  const { dispatch, selectedProject } = useProjects();
  const { createdAt, description, name } = project;
  const nameToDisplay = name.length > 25 ? `${name.substring(0, 25)}...` : name;
  const navigate = useNavigate();

  const { dayDate, time } = formatProjectDateTime(createdAt);

  function setSelectedProject() {
    dispatch({
      type: "SET_SELECTED_PROJECT",
      payload: project,
    });
  }

  function editProject() {
    dispatch({
      type: "SET_EDIT_PROJECT",
      payload: project,
    });
    localStorage.setItem("projectToEdit", JSON.stringify(project));
    navigate("newproject");
  }

  function deleteProject() {
    dispatch({
      type: "SET_DELETE_PROJECT",
      payload: project,
    });
  }

  const selected = selectedProject && project.id === selectedProject.id;

  return (
    <div
      onClick={setSelectedProject}
      className={
        selected
          ? `${ProjectListItemStyles.container} ${ProjectListItemStyles.loading}`
          : `${ProjectListItemStyles.container}`
      }
    >
      <div className={ProjectListItemStyles.header}>
        <h3>{nameToDisplay}</h3>
        <div className={ProjectListItemStyles.icons}>
          <img onClick={deleteProject} src={deleteicon} alt="delete project" />
          <img onClick={editProject} src={editproject} alt="edit project" />
        </div>
      </div>
      <p className={ProjectListItemStyles.description}>{description}</p>
      <p className={ProjectListItemStyles.date}>{`${dayDate} at ${time}`}</p>
    </div>
  );
}
