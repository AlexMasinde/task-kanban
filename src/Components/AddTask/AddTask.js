import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import {
  collection,
  addDoc,
  serverTimestamp,
  doc,
  updateDoc,
} from "@firebase/firestore";
import { captureException } from "@sentry/react";

import { database } from "../../firebase";

import { useTasks } from "../../contexts/TasksContext";
import { useAuth } from "../../contexts/AuthContext";
import { useProjects } from "../../contexts/ProjectsContext";

import { validateTask } from "../../utils/validate";
import { getEditedObject } from "../../utils/projectOject";

import SelectCategories from "../SelectCategories/SelectCategories";

import AddTaskStyles from "./AddTask.module.css";

import { taskToAdd, taskToEdit } from "../../utils/taskObject";
import { deleteSavedItem, fetchSavedItem } from "../../utils/localStorage";

export default function AddTask() {
  const { tasks, setTasks } = useTasks();
  const { currentUser } = useAuth();
  const { selectedProject } = useProjects();
  const [editing, setEditing] = useState(false);
  const [savedTaskToEdit, setSavedTaskToEdit] = useState(null);

  const [task, setTask] = useState({
    name: "",
    description: "",
    selectedTags: [],
    documentLink: "",
    designLink: "",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [writeError, setWriteError] = useState(null);
  const { taskGroup } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const savedTask = fetchSavedItem("taskToEdit");
    if (savedTask) {
      const { name, description, designLink, documentLink, tags } = savedTask;
      setTask({
        name,
        description,
        documentLink,
        designLink,
        selectedTags: tags,
      });
      setEditing(true);
      setSavedTaskToEdit(savedTask);
    }
  }, []);

  function handleName(e) {
    if (errors.name) {
      setErrors({ ...errors, name: "" });
    }

    setTask({ ...task, name: e.target.value });
  }

  function handleDescription(e) {
    if (errors.description) {
      setErrors({ ...errors, description: "" });
    }

    setTask({ ...task, description: e.target.value });
  }

  function handleDocumentLink(e) {
    if (errors.documentLink) {
      setErrors({ ...errors, documentLink: "" });
    }

    setTask({ ...task, documentLink: e.target.value });
  }

  function handleDesignLink(e) {
    if (errors.designLink) {
      setErrors({ ...errors, designLink: "" });
    }

    setTask({ ...task, designLink: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const { name, description, documentLink, designLink, selectedTags } = task;

    const { valid, errors } = validateTask(
      name,
      description,
      documentLink,
      designLink,
      selectedTags
    );

    if (!valid) {
      setErrors(errors);
      return;
    }

    try {
      setErrors({});
      setLoading(true);

      if (editing) {
        const updatedTask = taskToEdit(
          name,
          description,
          documentLink,
          designLink,
          selectedTags,
          savedTaskToEdit
        );

        if (Object.keys(updatedTask).length > 0) {
          const updateTaskRef = doc(database, "tasks", savedTaskToEdit.id);
          await updateDoc(updateTaskRef, updatedTask);
        }
        const uneditedTasks = tasks.filter(
          (task) => task.id !== savedTaskToEdit.id
        );
        const editedTask = getEditedObject(updatedTask, savedTaskToEdit);
        setTasks([editedTask, ...uneditedTasks]);
        deleteSavedItem("taskToEdit");
      } else {
        const taskInput = taskToAdd(
          name,
          description,
          documentLink,
          designLink,
          selectedTags
        );

        const newTask = {
          ...taskInput,
          createdAt: serverTimestamp(),
          user: currentUser.uid,
          projectId: selectedProject.id,
          status: taskGroup,
        };
        await addDoc(collection(database, "tasks"), { ...newTask });
        const localTask = { ...newTask, createdAt: Date.now() };
        setTasks([localTask, ...tasks]);
      }

      setLoading(false);
      navigate("/");
    } catch (err) {
      setLoading(false);
      setWriteError("Could not add task. Please try again.");
      console.log(err);
      // captureException(err);
    }
  }

  function close() {
    deleteSavedItem("taskToEdit");
    navigate("/");
  }

  if (!selectedProject) {
    navigate("/");
    return null;
  }

  return (
    <div className={AddTaskStyles.container}>
      <form onSubmit={handleSubmit}>
        <h3>{editing ? "Edit Task" : "Add New Task"}</h3>
        <label>
          Task Name
          <input value={task.name} onChange={handleName} type="text" />
        </label>
        {errors.name && <p>{errors.name}</p>}
        <label>
          Task Description
          <textarea
            value={task.description}
            onChange={handleDescription}
            rows="4"
            cols="50"
            maxLength="200"
          ></textarea>
        </label>
        {errors.description && <p>{errors.description}</p>}
        <label>
          SRS Document Link
          <input
            value={task.documentLink}
            onChange={handleDocumentLink}
            type="text"
          />
        </label>
        {errors.documentLink && <p>{errors.documentLink}</p>}
        <label>
          Figma Design Link
          <input
            value={task.designLink}
            onChange={handleDesignLink}
            type="text"
          />
        </label>
        {errors.designLink && <p>{errors.designLink}</p>}
        <div className={AddTaskStyles.tags}>
          <SelectCategories
            object={task}
            setObject={setTask}
            tags={selectedProject.tags}
          />
        </div>
        {errors.selectedTags && task.selectedTags.length === 0 && (
          <p>{errors.selectedTags}</p>
        )}
        <div className={AddTaskStyles.buttons}>
          <button
            disabled={loading}
            className={loading ? `${AddTaskStyles.loading}` : ""}
            type="submit"
          >
            Submit
          </button>
          <p onClick={close}>Close</p>
        </div>
        {writeError && <p>{writeError}</p>}
      </form>
    </div>
  );
}
