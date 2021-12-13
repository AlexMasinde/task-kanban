import React, { useState } from "react";
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

import SelectCategories from "../SelectCategories/SelectCategories";

import AddTaskStyles from "./AddTask.module.css";

import { taskToAdd, taskToEdit } from "../../utils/taskObject";

export default function AddTask() {
  const { tasks, setTasks } = useTasks();
  const { currentUser } = useAuth();
  const { selectedProject } = useProjects();
  const { editTask, setEditTask } = useTasks();
  const editing = editTask !== null;

  const [name, setName] = useState(editing ? editTask.name : "");
  const [description, setDescription] = useState(
    editing ? editTask.description : ""
  );
  const [documentLink, setDocumentLink] = useState(
    editing ? editTask.documentLink : ""
  );
  const [designLink, setDesignLink] = useState(
    editing ? editTask.designLink : ""
  );
  const [selectedTags, setSelectedTags] = useState(
    editing ? editTask.tags : []
  );

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [writeError, setWriteError] = useState(null);
  const { taskGroup } = useParams();
  const navigate = useNavigate();

  function handleName(e) {
    if (errors.name) {
      setErrors({ ...errors, name: "" });
    }
    const name = e.target.value;
    setName(name);
  }

  function handleDescription(e) {
    if (errors.description) {
      setErrors({ ...errors, description: "" });
    }
    const description = e.target.value;
    setDescription(description);
  }

  function handleDocumentLink(e) {
    if (errors.documentLink) {
      setErrors({ ...errors, documentLink: "" });
    }
    const documentLink = e.target.value;
    setDocumentLink(documentLink);
  }

  function handleDesignLink(e) {
    if (errors.designLink) {
      setErrors({ ...errors, designLink: "" });
    }
    const designLink = e.target.value;
    setDesignLink(designLink);
  }

  async function handleSubmit(e) {
    e.preventDefault();

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
          editTask
        );

        if (Object.keys(updatedTask).length > 0) {
          const updateTaskRef = doc(database, "tasks", editTask.id);
          await updateDoc(updateTaskRef, updatedTask);
        }
        const uneditedTasks = tasks.filter((task) => task.id !== editTask.id);
        const editedTask = {
          ...updatedTask,
          user: currentUser.uid,
          project: selectedProject.id,
          status: taskGroup,
          createdAt: Date.now(),
        };
        setTasks([editedTask, ...uneditedTasks]);
        setEditTask(null);
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
      captureException(err);
    }
  }

  function close() {
    navigate("/");
  }

  return (
    <div className={AddTaskStyles.container}>
      <form onSubmit={handleSubmit}>
        <h3>Add New Task</h3>
        <label>
          Task Name
          <input value={name} onChange={handleName} type="text" />
        </label>
        {errors.name && <p>{errors.name}</p>}
        <label>
          Task Description
          <textarea
            value={description}
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
            value={documentLink}
            onChange={handleDocumentLink}
            type="text"
          />
        </label>
        {errors.documentLink && <p>{errors.documentLink}</p>}
        <label>
          Figma Design Link
          <input value={designLink} onChange={handleDesignLink} type="text" />
        </label>
        {errors.designLink && <p>{errors.designLink}</p>}
        <div className={AddTaskStyles.tags}>
          <SelectCategories
            selectedTags={selectedTags}
            setSelectedTags={setSelectedTags}
            tags={selectedProject.tags}
          />
        </div>
        {errors.selectedTags && selectedTags.length === 0 && (
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
