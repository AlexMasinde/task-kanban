import React, { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { collection, addDoc, serverTimestamp } from "@firebase/firestore";

import { database } from "../../firebase";

import { useAuth } from "../../contexts/AuthContext";
import { useProjects } from "../../contexts/ProjectsContext";

import { validateProject } from "../../utils/validate";

import SelectCategories from "../SelectCategories/SelectCategories";

import AddTaskStyles from "./AddTask.module.css";

export default function AddTask() {
  const { currentUser } = useAuth();
  const { selectedProject } = useProjects();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [documentLink, setDocumentLink] = useState("");
  const [designLink, setDesignLink] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
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
    const { valid, errors } = validateProject(
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
      await addDoc(collection(database, "tasks"), {
        name,
        description,
        documentLink,
        designLink,
        status: taskGroup,
        tags: selectedTags,
        projectId: selectedProject.id,
        user: currentUser.uid,
        createdAt: serverTimestamp(),
      });
      setLoading(false);
      navigate("/");
    } catch (err) {
      setLoading(false);
      console.log(err);
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
          <input onChange={handleName} type="text" />
        </label>
        {errors.name && <p>{errors.name}</p>}
        <label>
          Task Description
          <textarea
            onChange={handleDescription}
            rows="4"
            cols="50"
            maxLength="200"
          ></textarea>
        </label>
        {errors.description && <p>{errors.description}</p>}
        <label>
          SRS Document Link
          <input onChange={handleDocumentLink} type="text" />
        </label>
        {errors.documentLink && <p>{errors.documentLink}</p>}
        <label>
          Figma Design Link
          <input onChange={handleDesignLink} type="text" />
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
      </form>
    </div>
  );
}
