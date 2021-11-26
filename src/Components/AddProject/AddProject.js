import React, { useState } from "react";
import { useNavigate } from "react-router";
import {
  collection,
  addDoc,
  serverTimestamp,
  doc,
  updateDoc,
} from "@firebase/firestore";

import { database } from "../../firebase";

import { useAuth } from "../../contexts/AuthContext";
import { useProjects } from "../../contexts/ProjectsContext";

import sameTags from "../../utils/compareTags";

import { validateProject } from "../../utils/validate";

import SelectCategories from "../SelectCategories/SelectCategories";

import AddProjectStyles from "./AddProject.module.css";

export default function Addproject() {
  const { currentUser } = useAuth();
  const { editProject, dispatch } = useProjects();
  const editing = editProject !== null;

  const [name, setName] = useState(editing ? editProject.name : "");
  const [description, setDescription] = useState(
    editing ? editProject.description : ""
  );
  const [documentLink, setDocumentLink] = useState(
    editing ? editProject.documentLink : ""
  );
  const [designLink, setDesignLink] = useState(
    editing ? editProject.designLink : ""
  );
  const [selectedTags, setSelectedTags] = useState(
    editing ? editProject.tags : []
  );

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
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
      if (editing) {
        const updatedProject = {};

        if (name !== editProject.name) {
          updatedProject.name = name;
        }

        if (description !== editProject.description) {
          updatedProject.description = description;
        }

        if (documentLink !== editProject.documentLink) {
          updatedProject.documentLink = documentLink;
        }

        if (designLink !== editProject.designLink) {
          updatedProject.designLink = designLink;
        }

        if (!sameTags(selectedTags, editProject.tags)) {
          updatedProject.tags = selectedTags;
        }

        if (Object.keys(updatedProject).length > 0) {
          const updateRef = doc(database, "projects", editProject.id);
          await updateDoc(updateRef, updatedProject);
        }
        dispatch({ type: "SET_EDIT_PROJECT", payload: null });
      } else {
        await addDoc(collection(database, "projects"), {
          name,
          description,
          documentLink,
          designLink,
          tags: selectedTags,
          user: currentUser.uid,
          createdAt: serverTimestamp(),
        });
      }

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
          Design Link
          <input value={designLink} onChange={handleDesignLink} type="text" />
        </label>
        {errors.designLink && <p>{errors.designLink}</p>}
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
      </form>
    </div>
  );
}
