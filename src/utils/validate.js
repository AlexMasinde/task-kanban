export function validateSingup(username, email, password) {
  const errors = {};

  const usernameRegex = /^[a-zA-Z\s]*$/;

  if (username.trim() === "") {
    errors.username = "Provide a Username";
  } else if (!usernameRegex.test(username.trim())) {
    errors.username = "Include letters and spaces only";
  }

  const emailRegex = /\S+@\S+\.\S+/;
  if (email.trim() === "") {
    errors.email = "Please provide an email address";
  } else if (!emailRegex.test(email)) {
    errors.email = "Please provide a valid email address";
  }

  if (password.length < 6) {
    errors.password = "Password too short";
  }

  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
}

export function validateLogin(email, password) {
  const errors = {};
  const emailRegex = /\S+@\S+\.\S+/;
  if (!emailRegex.test(email)) {
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
