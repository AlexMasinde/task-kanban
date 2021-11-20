import React from "react";

import InputStyles from "./Input.module.css";

export default function Input({
  type,
  icon,
  placeholder,
  alt,
  onChange,
  onFocus,
}) {
  return (
    <div className={InputStyles.container}>
      <img src={icon} alt={alt} />
      <input
        placeholder={placeholder}
        type={type}
        onChange={onChange}
        onFocus={onFocus}
      />
    </div>
  );
}
