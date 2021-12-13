import React, { useState } from "react";
import { useNavigate } from "react-router";
import {
  collection,
  addDoc,
  serverTimestamp,
  doc,
  updateDoc,
} from "@firebase/firestore";
import { captureException } from "@sentry/react";

import { database } from "../../firebase";

import { useAuth } from "../../contexts/AuthContext";
import { useProjects } from "../../contexts/ProjectsContext";

import { validateProject } from "../../utils/validate";

import SelectCategories from "../SelectCategories/SelectCategories";

import AddProjectStyles from "./AddProject.module.css";
import { projectToEdit } from "../../utils/projectOject";

export default function Addproject() {
  const { currentUser } = useAuth();
  const { editProject, dispatch, projects } = useProjects();
  const editing = editProject !== null;

  const [name, setName] = useState(editing ? editProject.name : "");
  const [description, setDescription] = useState(
    editing ? editProject.description : ""
  );
  const [selectedTags, setSelectedTags] = useState(
    editing ? editProject.tags : []
  );

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [writeError, setWriteError] = useState(null);
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

  async function handleSubmit(e) {
    e.preventDefault();
    const { valid, errors } = validateProject(name, description, selectedTags);

    if (!valid) {
      setErrors(errors);
      return;
    }

    try {
      setErrors({});
      setLoading(true);
      if (editing) {
        const updatedProject = projectToEdit(
          name,
          description,
          selectedTags,
          editProject
        );
        if (Object.keys(updatedProject).length > 0) {
          const updateRef = doc(database, "projects", editProject.id);
          await updateDoc(updateRef, updatedProject);
        }
        const uneditedProjects = projects.filter(
          (project) => project.id !== editProject.id
        );
        const editedProject = {
          ...updatedProject,
          user: currentUser.uid,
          createdAt: Date.now(),
        };
        const newProjects = [editedProject, ...uneditedProjects];
        dispatch({ type: "SET_PROJECTS", payload: newProjects });
        dispatch({ type: "SET_EDIT_PROJECT", payload: null });
      } else {
        const newProject = {
          name,
          description,
          tags: selectedTags,
          user: currentUser.uid,
          createdAt: serverTimestamp(),
        };
        await addDoc(collection(database, "projects"), newProject);
        const localProject = { ...newProject, createdAt: Date.now() };
        const newProjects = [localProject, ...projects];
        dispatch({ type: "SET_PROJECTS", payload: newProjects });
      }

      setLoading(false);
      navigate("/");
    } catch (err) {
      setLoading(false);
      setWriteError("Could not Create Project! Please try again.");
      captureException(err);
    }
  }

  function close() {
    navigate("/");
  }

  return (
    <div className={AddProjectStyles.container}>
      <form onSubmit={handleSubmit}>
        <h3>Add a new project</h3>
        <label>
          Project Name
          <input value={name} onChange={handleName} type="text" />
        </label>
        {errors.name && <p>{errors.name}</p>}
        <label>
          Project Description
          <textarea
            value={description}
            onChange={handleDescription}
            rows="4"
            cols="50"
            maxLength="200"
          ></textarea>
        </label>
        {errors.description && <p>{errors.description}</p>}
        <div className={AddProjectStyles.tags}>
          <SelectCategories
            selectedTags={selectedTags}
            setSelectedTags={setSelectedTags}
          />
        </div>
        {errors.selectedTags && selectedTags.length === 0 && (
          <p>{errors.selectedTags}</p>
        )}
        <div className={AddProjectStyles.buttons}>
          <button
            disabled={loading}
            className={loading ? `${AddProjectStyles.loading}` : ""}
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
