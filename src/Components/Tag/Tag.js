import React from "react";

import closeicon from "../../icons/closeicon.svg";

import TagStyles from "./Tag.module.css";

export default function Tag({ tag, removeTag }) {
  return (
    <div className={TagStyles.container}>
      <div style={{ background: `${tag.color}` }} className={TagStyles.tag}>
        <p>{tag.name}</p>
        <img src={closeicon} alt="remove" onClick={() => removeTag(tag)} />
      </div>
    </div>
  );
}
