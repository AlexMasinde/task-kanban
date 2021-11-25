import React from "react";

import ButtonStyles from "./Button.module.css";

export default function Button({ loading, text, type, onClick }) {
  return (
    <div className={ButtonStyles.container}>
      <button
        className={loading ? ButtonStyles.loading : ""}
        disabled={loading}
        type={type}
        onClick={onClick}
      >
        {text}
      </button>
    </div>
  );
}
