export function fetchSavedItem(name) {
  if (localStorage && localStorage.getItem(name)) {
    const parsedData = JSON.parse(localStorage.getItem(name));
    return parsedData;
  } else {
    return null;
  }
}

export function deleteSavedItem(name) {
  if (localStorage) {
    localStorage.removeItem(name);
  }
}
