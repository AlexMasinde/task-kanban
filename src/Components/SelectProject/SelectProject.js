import React from "react";

import projecticon from "../../icons/project.svg";

import SelectProjectStyles from "./SelectProject.module.css";

export default function SelectProject() {
  return (
    <div className={SelectProjectStyles.container}>
      <img src={projecticon} alt="select project" />
      <p>Select a project on the left to view and add tasks</p>
    </div>
  );
}
