import isEmail from "validator/lib/isEmail";
import isURL from "validator/lib/isURL";

export function validateUserDetails(email, password) {
  const errors = {};
  if (!isEmail(email)) {
    errors.email = "Please provide a valid email address";
  }
  if (password.length < 6) {
    errors.password = "Password too short";
  }

  return {
    errors,
    valid: Object.keys(errors) < 1,
  };
}

export function validateProject(name, description, selectedTags) {
  const errors = {};
  if (name.trim() === "") {
    errors.name = "Name is required";
  }
  if (description.trim() === "") {
    errors.description = "Description is required";
  }

  if (selectedTags.length === 0) {
    errors.selectedTags = "Please select at least one tag";
  }

  return {
    valid: Object.keys(errors) < 1,
    errors,
  };
}

export function validateTask(
  name,
  description,
  documentLink,
  designLink,
  selectedTags
) {
  const errors = {};

  if (name.trim() === "") {
    errors.name = "Name is required";
  }

  if (description.trim() === "") {
    errors.description = "Description is required";
  }

  if (documentLink && !isURL(documentLink)) {
    errors.documentLink = "Please provide a valid document URL";
  }

  if (designLink && !isURL(designLink, { require_protocol: true })) {
    errors.designLink = "Please provide a valid design URL";
  }

  if (selectedTags.length === 0) {
    errors.selectedTags = "Please select at least one tag";
  }

  return {
    valid: Object.keys(errors) < 1,
    errors,
  };
}
