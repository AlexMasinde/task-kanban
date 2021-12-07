import React, { useState } from "react";

import { useAuth } from "../../contexts/AuthContext";

import edit from "../../icons/edit.svg";
import user from "../../icons/avatar.png";

import UserProfileStyles from "./UserProfile.module.css";
import { imageValidate, uploadImage } from "../../utils/imageUpload";

export default function UserProfile() {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [itemToEdit, setItemToEdit] = useState(false);
  const [userName, setUserName] = useState(
    currentUser.displayName ?? "User Name"
  );
  const [imageUploadError, setImageUploadError] = useState(null);

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

  //edit user name

  return (
    <div className={UserProfileStyles.container}>
      {console.log(currentUser)}
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
          <input type="text" value={userName} />
          <img
            src={edit}
            onClick={() => setItemToEdit(true)}
            alt="edit user name"
          />
        </div>
        <div className={UserProfileStyles.email}>
          <p>{currentUser.email}</p>
        </div>
      </div>
      <div className={UserProfileStyles.buttons}>
        <button disabled={loading}>Logout</button>
        {itemToEdit && <button disabled={loading}>Update Name</button>}
      </div>
    </div>
  );
}
