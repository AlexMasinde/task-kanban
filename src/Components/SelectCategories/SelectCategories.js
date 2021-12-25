import React, { useState } from "react";

import arrowdown from "../../icons/arrowdown.svg";
import arrowup from "../../icons/arrowup.svg";
import closeicon from "../../icons/closeicon.svg";

import SelectCategoriesStyles from "./SelectCategories.module.css";

export default function SelectCategories({ project, setProject, tags }) {
  const [select, setSelect] = useState(false);
  const { selectedTags } = project;

  function selectTags() {
    setSelect(!select);
  }

  function addTags(tag) {
    setSelect(false);
    if (selectedTags.find((selectedTag) => selectedTag.name === tag.name)) {
      return;
    }

    const newTags = [...selectedTags, tag];
    setProject({ ...project, selectedTags: newTags });
  }

  function removeTag(tag) {
    const newTags = selectedTags.filter(
      (selectedTag) => selectedTag.name !== tag.name
    );
    setProject({ ...project, selectedTags: newTags });
  }

  return (
    <div className={SelectCategoriesStyles.container}>
      <div className={SelectCategoriesStyles.dropdown}>
        <div className={SelectCategoriesStyles.tags}>
          {selectedTags.length > 0 ? (
            selectedTags.map((tag) => (
              <div
                style={{ background: `${tag.color}` }}
                className={SelectCategoriesStyles.tag}
              >
                <p>{tag.name}</p>
                <img
                  src={closeicon}
                  alt="remove"
                  onClick={() => removeTag(tag)}
                />
              </div>
            ))
          ) : (
            <p onClick={selectTags}>Select Tags</p>
          )}
        </div>
        <div className={SelectCategoriesStyles.selectimage}>
          {select ? (
            <img onClick={selectTags} alt="select tags" src={arrowup} />
          ) : (
            <img onClick={selectTags} src={arrowdown} alt="close" />
          )}
        </div>
      </div>
      {select && (
        <div className={SelectCategoriesStyles.list}>
          {tags.map((category) => {
            return (
              <div
                onClick={() => addTags(category)}
                className={SelectCategoriesStyles.listitem}
              >
                <p>{category.name}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
