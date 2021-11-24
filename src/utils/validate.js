export default function validate(email, password) {
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
