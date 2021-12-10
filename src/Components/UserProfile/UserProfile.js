import React, { useState } from "react";
import { Link } from "react-router-dom";

import { useAuth } from "../../contexts/AuthContext";

import edit from "../../icons/edit.svg";
import closeicon from "../../icons/closeicon.svg";
import user from "../../icons/avatar.png";
import logo from "../../icons/logo.svg";

import UserProfileStyles from "./UserProfile.module.css";
import { imageValidate, uploadImage } from "../../utils/imageUpload";
import { useFocus } from "../../utils/useFocus";
import { auth } from "../../firebase";
import { updateProfile } from "@firebase/auth";

export default function UserProfile() {
  const { currentUser, userSingOut } = useAuth();
  const [loading, setLoading] = useState(false);
  const [userName, setUserName] = useState(
    currentUser.displayName ?? "User Name"
  );
  const [error, setError] = useState(null);
  const [editingName, setEditingName] = useState(false);
  const [htmlElRef, setFocus] = useFocus();

  //upload user image
  async function handleImageUpload(e) {
    setError(null);
    const image = e.target.files[0];

    if (!image) {
      return;
    }

    const imageError = imageValidate(image);
    if (imageError) {
      setError(imageError);
      setTimeout(() => {
        setError(null);
      }, 3000);
      return;
    }

    try {
      setLoading(true);
      await uploadImage(image);
      setLoading(false);
    } catch (err) {
      setError("Could not upload image! Try again");
      setLoading(false);
      console.log(err);
    }
  }

  //focus in and out of user name input
  function handleFocus() {
    if (loading) return;
    setFocus();
    setUserName("");
    if (editingName) {
      setEditingName(false);
      setUserName(currentUser.displayName ?? "User Name");
    }
  }

  function handleFocusChange() {
    if (editingName && userName === "") {
      setUserName(currentUser.displayName ?? "User Name");
      setEditingName(false);
    }
  }

  //edit user name
  function handleUserName(e) {
    if (loading) return;
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

    if (userName.toLowerCase() === "user name") {
      return;
    }

    if (userName.toLowerCase() === currentUser.displayName.toLowerCase()) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      console.log(userName);
      await updateProfile(auth.currentUser, { displayName: userName });
      setEditingName(false);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setError("Could not update name");
    }
  }

  async function handleLogout() {
    try {
      setLoading(true);
      await userSingOut();
    } catch (err) {
      setError("Could not logout");
      console.log(err);
    }
  }

  return (
    <div className={UserProfileStyles.container}>
      <div className={UserProfileStyles.content}>
        <Link to="/">
          <div className={UserProfileStyles.home}>
            <img src={logo} alt="home" />
            <p>Home</p>
          </div>
        </Link>
        <div className={UserProfileStyles.photo}>
          <img
            src={currentUser.photoURL ?? user}
            alt={currentUser.displayName ?? currentUser.email}
            referrerPolicy="no-referrer"
          />
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
              onBlur={handleFocusChange}
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
        <div
          className={
            loading
              ? `${UserProfileStyles.buttonloading}`
              : `${UserProfileStyles.buttons}`
          }
        >
          <button disabled={loading} onClick={handleLogout}>
            Logout
          </button>
          {editingName && (
            <button disabled={loading} onClick={updateUserName}>
              Update Name
            </button>
          )}
        </div>
        {error && <p className={UserProfileStyles.error}>{error}</p>}
      </div>
    </div>
  );
}
