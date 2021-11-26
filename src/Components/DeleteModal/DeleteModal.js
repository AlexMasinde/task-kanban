import React, { useState } from "react";
import { deleteDoc, doc } from "@firebase/firestore";

import { database } from "../../firebase";

import { useTasks } from "../../contexts/TasksContext";
import { useProjects } from "../../contexts/ProjectsContext";

import DeleteModalStyles from "./DeleteModal.module.css";

export default function DeleteModal() {
  const { deleteTask, setDeleteTask, tasks, setTasks } = useTasks();
  const { deleteProject, dispatch, projects } = useProjects();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { name } = deleteTask ? deleteTask : deleteProject;

  const modalTitle = deleteTask ? "Delete Task" : "Delete Project";

  async function handleDelete() {
    try {
      setLoading(true);
      setError("");
      if (deleteTask) {
        await deleteDoc(doc(database, "tasks", deleteTask.id));
        const updatedTasks = tasks.filter((task) => task.id !== deleteTask.id);
        setTasks(updatedTasks);
        setDeleteTask(null);
      } else {
        await deleteDoc(doc(database, "projects", deleteProject.id));
        const updatedProjects = projects.filter(
          (project) => project.id !== deleteProject.id
        );
        dispatch({
          type: "SET_PROJECTS",
          payload: updatedProjects,
        });
        dispatch({
          type: "SET_DELETE_PROJECT",
          payload: null,
        });
      }
      setLoading(false);
    } catch (err) {
      setError("Could not delete");
      setLoading(false);
      console.log(err);
    }
  }

  function cancelDelete() {
    if (deleteTask) {
      setDeleteTask(null);
    } else {
      dispatch({ type: "SET_DELETE_PROJECT", payload: null });
    }
  }

  return (
    <div className={DeleteModalStyles.container}>
      <div className={DeleteModalStyles.header}>
        <p>{modalTitle}</p>
      </div>
      <div className={DeleteModalStyles.message}>
        <p>
          Delete <span>{name}</span>
        </p>
      </div>
      <div className={DeleteModalStyles.buttons}>
        <button
          onClick={handleDelete}
          disabled={loading}
          className={loading ? `${DeleteModalStyles.loading}` : ""}
        >
          Confirm
        </button>
        <button
          onClick={cancelDelete}
          disabled={loading}
          className={loading ? `${DeleteModalStyles.loading}` : ""}
        >
          Cancel
        </button>
      </div>
      {error && <p className={DeleteModalStyles.error}>{error}</p>}
    </div>
  );
}
