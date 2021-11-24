import React from "react";

import googleicon from "../../icons/google.svg";

import WithGoogleStyles from "./WithGoogle.module.css";

export default function WithGoogle({ text, loading }) {
  return (
    <div
      className={`${WithGoogleStyles.container} ${
        loading ? WithGoogleStyles.loading : ""
      }`}
    >
      <img src={googleicon} alt="google" />
      <p>{text}</p>
    </div>
  );
}
