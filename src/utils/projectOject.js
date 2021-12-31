import sameTags from "./compareTags";

export function projectToEdit(name, description, selectedTags, editProject) {
  const updatedProject = {};

  if (name !== editProject.name) {
    updatedProject.name = name;
  }

  if (description !== editProject.description) {
    updatedProject.description = description;
  }

  if (!sameTags(selectedTags, editProject.tags)) {
    updatedProject.tags = selectedTags;
  }

  return updatedProject;
}

export function getEditedObject(updatedObject, savedObject) {
  for (const key in savedObject) {
    if (!(key in updatedObject)) {
      updatedObject[key] = savedObject[key];
    }
  }

  updatedObject.createdAt = Date.now();
  return updatedObject;
}
