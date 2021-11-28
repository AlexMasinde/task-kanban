import React from "react";
import { useNavigate } from "react-router-dom";

import { useTasks } from "../../contexts/TasksContext";
import { useProjects } from "../../contexts/ProjectsContext";

import arrowright from "../../icons/arrowright.svg";
import doc from "../../icons/doc.svg";
import figma from "../../icons/figma.svg";
import edittask from "../../icons/edittask.svg";
import deleteicon from "../../icons/deleteicon.svg";

import TaskCardStyles from "./TaskCard.module.css";

export default function TaskCard({ task, taskGroup }) {
  const { setEditTask, setDeleteTask } = useTasks();
  const { deleteProject, dispatch } = useProjects();
  const { name, description, createdAt, designLink, documentLink, tags } = task;
  const navigate = useNavigate();

  const options = { day: "numeric", month: "short" };
  const date = createdAt.toDate().toLocaleDateString("en-UK", options);

  function editTask() {
    setEditTask(task);
    navigate(`addtask/${taskGroup}`);
  }

  function deleteTask() {
    if (deleteProject) {
      dispatch({
        type: "SET_DELETE_PROJECT",
        payload: null,
      });
    }
    setDeleteTask(task);
  }

  function handleDragStart(e, id) {
    e.dataTransfer.setData("text/plain", id);
  }

  return (
    <div
      draggable
      onDragStart={(e) => handleDragStart(e, task.id)}
      className={TaskCardStyles.container}
    >
      <div className={TaskCardStyles.header}>
        <div className={TaskCardStyles.tagscontainer}>
          {tags.map((tag) => {
            return (
              <div
                style={{ background: `${tag.color}` }}
                className={TaskCardStyles.tag}
              >
                <p>{tag.name}</p>
              </div>
            );
          })}
        </div>
        <div className={TaskCardStyles.headericons}>
          <img onClick={deleteTask} src={deleteicon} alt="delete task" />
          <img onClick={editTask} src={edittask} alt="edit task" />
        </div>
      </div>
      <div className={TaskCardStyles.name}>
        <p>{name}</p>
        <p>{date}</p>
      </div>
      <div className={TaskCardStyles.description}>
        <p>{description}</p>
      </div>
      <div className={TaskCardStyles.document}>
        <img src={doc} alt="document icon" />
        <a target="blank" href={`${documentLink}`}>
          Document Link
          <span>
            <img src={arrowright} alt="document link" />
          </span>
        </a>
      </div>
      <div className={TaskCardStyles.design}>
        <img src={figma} alt="figma icon" />
        <a target="blank" href={`${designLink}`}>
          Design Link
          <span>
            <img src={arrowright} alt="design link" />
          </span>
        </a>
      </div>
    </div>
  );
}
