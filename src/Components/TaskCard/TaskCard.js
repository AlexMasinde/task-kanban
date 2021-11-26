import React from "react";

import arrowright from "../../icons/arrowright.svg";
import doc from "../../icons/doc.svg";
import figma from "../../icons/figma.svg";

import TaskCardStyles from "./TaskCard.module.css";

export default function TaskCard({ task }) {
  const { name, description, createdAt, designLink, documentLink, tags } = task;

  const options = { day: "numeric", month: "short" };
  const date = createdAt.toDate().toLocaleDateString("en-UK", options);

  return (
    <div className={TaskCardStyles.container}>
      <div className={TaskCardStyles.tagscontainer}>
        {tags.map((tag) => {
          return (
            <div
              style={{ background: `${tag.color}` }}
              className={TaskCardStyles.tag}
            >
              <p>{tag.name}</p>
            </div>
          );
        })}
      </div>
      <div className={TaskCardStyles.name}>
        <p>{name}</p>
        <p>{date}</p>
      </div>
      <div className={TaskCardStyles.description}>
        <p>{description}</p>
      </div>
      <div className={TaskCardStyles.document}>
        <img src={doc} alt="document icon" />
        <a target="blank" href={`${documentLink}`}>
          Document Link
          <span>
            <img src={arrowright} alt="document link" />
          </span>
        </a>
      </div>
      <div className={TaskCardStyles.design}>
        <img src={figma} alt="figma icon" />
        <a target="blank" href={`${designLink}`}>
          Design Link
          <span>
            <img src={arrowright} alt="design link" />
          </span>
        </a>
      </div>
    </div>
  );
}
