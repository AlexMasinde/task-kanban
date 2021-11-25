import React from "react";
import { useProjects } from "../../contexts/ProjectsContext";

import ProjectListItemStyles from "./ProjectListItem.module.css";

export default function ProjectListItem({ project }) {
  const { dispatch, selectedProject } = useProjects();
  const { createdAt, description, name } = project;
  const transformedDate = createdAt.toDate();
  const dayDateOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
    weekday: "long",
  };
  const timeOptions = { hour: "numeric", minute: "numeric" };
  const dayDate = transformedDate.toLocaleDateString("en-UK", dayDateOptions);
  const time = transformedDate.toLocaleTimeString("en-UK", timeOptions);

  function setSelectedProject() {
    dispatch({
      type: "SET_SELECTED_PROJECT",
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
      <h3>{name}</h3>
      <p className={ProjectListItemStyles.description}>{description}</p>
      <p className={ProjectListItemStyles.date}>{`${dayDate} at ${time}`}</p>
    </div>
  );
}
