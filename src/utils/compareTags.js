export default function sameTags(selectedTags, currentProjectTags) {
  if (selectedTags.length !== currentProjectTags.length) {
    return false;
  }

  const selectedTagsObject = {};
  const currentProjectTagsObject = {};

  for (let val of selectedTags) {
    selectedTagsObject[val] = 1;
  }

  for (let val of currentProjectTags) {
    currentProjectTagsObject[val] = 1;
  }

  for (let key in selectedTagsObject) {
    if (!(key in currentProjectTagsObject)) {
      return false;
    }
  }

  return true;
}
