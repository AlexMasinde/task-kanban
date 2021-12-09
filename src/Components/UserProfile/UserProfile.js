import React, { useState } from "react";

import { useAuth } from "../../contexts/AuthContext";

import edit from "../../icons/edit.svg";
import closeicon from "../../icons/closeicon.svg";
import user from "../../icons/avatar.png";

import UserProfileStyles from "./UserProfile.module.css";
import { imageValidate, uploadImage } from "../../utils/imageUpload";
import { useFocus } from "../../utils/useFocus";
import { auth } from "../../firebase";
import { updateProfile } from "@firebase/auth";

export default function UserProfile() {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [userName, setUserName] = useState(
    currentUser.displayName ?? "User Name"
  );
  const [imageUploadError, setImageUploadError] = useState(null);
  const [userNameError, setUserNameError] = useState(null);
  const [editingName, setEditingName] = useState(false);
  const [htmlElRef, setFocus] = useFocus();

  //upload user image
  async function handleImageUpload(e) {
    const image = e.target.files[0];
    const { error, valid } = imageValidate(image);
    if (!valid) {
      setImageUploadError(error);
      return;
    }

    try {
      setImageUploadError(null);
      setLoading(true);
      await uploadImage(image);
      setLoading(false);
    } catch (err) {
      setImageUploadError("Could not upload image");
      setLoading(false);
      console.log(err);
    }
  }

  //focus on user name input
  function handleFocus() {
    setFocus();
    setUserName("");
    if (editingName) {
      setEditingName(false);
    }
  }

  //edit user name
  function handleUserName(e) {
    if (!editingName) {
      setEditingName(true);
    }
    const name = e.target.value;
    setUserName(name);
  }

  //save new user name
  async function updateUserName() {
    if (userName.trim() === "") {
      return;
    }

    if (userName === "User Name") {
      return;
    }

    if (userName === currentUser.displayName) {
      return;
    }

    try {
      setLoading(true);
      setUserNameError(null);
      console.log(userName);
      await updateProfile(auth.currentUser, { displayName: userName });
      setEditingName(false);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setUserNameError("Could not update name");
    }
  }

  return (
    <div className={UserProfileStyles.container}>
      <div className={UserProfileStyles.photo}>
        <img src={currentUser.photoURL ?? user} alt="current user" />
        <label>
          <input type="file" onChange={(e) => handleImageUpload(e)} />
          <span>
            <img src={edit} alt="upload" />
          </span>
        </label>
      </div>
      <div className={UserProfileStyles.details}>
        <div className={UserProfileStyles.username}>
          <input
            type="text"
            ref={htmlElRef}
            value={userName}
            onChange={handleUserName}
          />
          <img
            src={editingName ? closeicon : edit}
            onClick={handleFocus}
            alt="edit user name"
          />
        </div>
        <div className={UserProfileStyles.email}>
          <p>{currentUser.email}</p>
        </div>
      </div>
      <div className={UserProfileStyles.buttons}>
        <button disabled={loading}>Logout</button>
        {editingName && (
          <button disabled={loading} onClick={updateUserName}>
            Update Name
          </button>
        )}
      </div>
    </div>
  );
}
