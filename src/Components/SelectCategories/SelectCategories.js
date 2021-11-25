import React, { useState } from "react";

import { categories } from "../../utils/categories";

import arrowdown from "../../icons/arrowdown.svg";
import arrowup from "../../icons/arrowup.svg";

import SelectCategoriesStyles from "./SelectCategories.module.css";
import Tag from "../Tag/Tag";

export default function SelectCategories({ selectedTags, setSelectedTags }) {
  const [select, setSelect] = useState(false);

  function selectTags() {
    setSelect(!select);
  }

  function addTags(tag) {
    setSelect(false);
    if (selectedTags.includes(tag)) {
      return;
    }
    setSelectedTags([...selectedTags, tag]);
  }

  function removeTag(tag) {
    const newTags = selectedTags.filter((t) => t.name !== tag.name);
    setSelectedTags(newTags);
  }

  return (
    <div className={SelectCategoriesStyles.container}>
      <div className={SelectCategoriesStyles.dropdown}>
        <div className={SelectCategoriesStyles.tags}>
          {selectedTags.length > 0 ? (
            selectedTags.map((tag) => <Tag tag={tag} removeTag={removeTag} />)
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
          {categories.map((category) => {
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
