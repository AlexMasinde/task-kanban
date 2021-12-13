import sameTags from "./compareTags";

export function taskToEdit(
  name,
  description,
  documentLink,
  designLink,
  selectedTags,
  editTask
) {
  const updatedTask = {};

  if (name !== editTask.name) {
    updatedTask.name = name;
  }

  if (description !== editTask.description) {
    updatedTask.description = description;
  }

  if (documentLink !== editTask.documentLink) {
    updatedTask.documentLink = documentLink;
  }

  if (designLink !== editTask.designLink) {
    updatedTask.designLink = designLink;
  }

  if (!sameTags(selectedTags, editTask.tags)) {
    updatedTask.tags = selectedTags;
  }

  return updatedTask;
}

export function taskToAdd(
  name,
  description,
  documentLink,
  designLink,
  selectedTags
) {
  const newTask = {};

  if (designLink.trim() !== "") {
    newTask.designLink = designLink;
  }

  if (documentLink.trim() !== "") {
    newTask.documentLink = documentLink;
  }

  return { ...newTask, name, description, tags: selectedTags };
}
