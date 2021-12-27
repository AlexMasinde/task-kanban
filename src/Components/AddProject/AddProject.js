import React, { useEffect, useState } from "react";
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
import { categories } from "../../utils/categories";
import { projectToEdit } from "../../utils/projectOject";
import { deleteSavedItem, fetchSavedItem } from "../../utils/localStorage";

import SelectCategories from "../SelectCategories/SelectCategories";

import AddProjectStyles from "./AddProject.module.css";

export default function Addproject() {
  const { currentUser } = useAuth();
  const { dispatch, projects } = useProjects();
  const [editing, setEditing] = useState(false);
  const [savedItemToEdit, setSavedItemToEdit] = useState(null);
  const [project, setProject] = useState({
    name: "",
    description: "",
    selectedTags: [],
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [writeError, setWriteError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const savedProjectToEdit = fetchSavedItem("projectToEdit");

    if (savedProjectToEdit) {
      const { name, description, tags } = savedProjectToEdit;
      setProject({
        name,
        description,
        selectedTags: tags,
      });
      setSavedItemToEdit(savedProjectToEdit);
      setEditing(true);
    }
  }, []);

  function handleName(e) {
    if (errors.name) {
      setErrors({ ...errors, name: "" });
    }

    setProject({ ...project, name: e.target.value });
  }

  function handleDescription(e) {
    if (errors.description) {
      setErrors({ ...errors, description: "" });
    }

    setProject({ ...project, description: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const { name, description, selectedTags } = project;
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
          savedItemToEdit
        );
        if (Object.keys(updatedProject).length > 0) {
          const updateRef = doc(database, "projects", savedItemToEdit.id);
          await updateDoc(updateRef, updatedProject);
        }
        const uneditedProjects = projects.filter(
          (project) => project.id !== savedItemToEdit.id
        );
        const editedProject = {
          ...updatedProject,
          user: currentUser.uid,
          createdAt: Date.now(),
        };
        const newProjects = [editedProject, ...uneditedProjects];
        dispatch({ type: "SET_PROJECTS", payload: newProjects });
        deleteSavedItem("projectToEdit");
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
    deleteSavedItem("projectToEdit");
    navigate("/");
  }

  return (
    <div className={AddProjectStyles.container}>
      <form onSubmit={handleSubmit}>
        <h3>{editing ? "Edit Project" : "Add a new project"}</h3>
        <label>
          Project Name
          <input value={project.name} onChange={handleName} type="text" />
        </label>
        {errors.name && <p>{errors.name}</p>}
        <label>
          Project Description
          <textarea
            value={project.description}
            onChange={handleDescription}
            rows="4"
            cols="50"
            maxLength="200"
          ></textarea>
        </label>
        {errors.description && <p>{errors.description}</p>}
        <div className={AddProjectStyles.tags}>
          <SelectCategories
            object={project}
            setObject={setProject}
            tags={categories}
          />
        </div>
        {errors.selectedTags && project.selectedTags.length === 0 && (
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
