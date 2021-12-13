export function googleProviderErrors(err, errors, captureException) {
  switch (err.code) {
    case "auth/cancelled-popup-request":
      return {
        ...errors,
        auth: "Request cancelled",
      };
    case "auth/popup-blocked":
      return {
        ...errors,
        auth: "Popup blocked by browser",
      };
    case "auth/popup-closed-by-user":
      return {
        ...errors,
        auth: "Popup closed by user",
      };
    case "auth/user-mismatch":
      return {
        ...errors,
        auth: "Wrong user selected",
      };
    default:
      captureException(err);
      return {
        ...errors,
        auth: "Unknown Error! Try again",
      };
  }
}

export function emailLoginErrors(err, errors, captureException) {
  switch (err.code) {
    case "auth/user-not-found":
      return { ...errors, auth: "User not found" };
    case "auth/invalid-email":
      return { ...errors, auth: "Invalid email" };
    case "auth/user-disabled":
      return { ...errors, auth: "User disabled" };
    case "auth/wrong-password":
      return { ...errors, auth: "Wrong password" };
    case "auth/too-many-requests":
      return { ...errors, auth: "Too many failed requests" };
    default:
      captureException(err);
      return { ...errors, auth: "Unknown Error! Try again" };
  }
}

export function emailSignUpErrors(err, errors, captureException) {
  switch (err.code) {
    case "auth/email-already-in-use":
      return { ...errors, auth: "Email already in use" };
    case "auth/invalid-email":
      return { ...errors, auth: "Invalid email" };
    case "auth/weak-password":
      return { ...errors, auth: "Weak password" };
    case "auth/too-many-requests":
      return { ...errors, auth: "Too many failed requests" };
    default:
      captureException(err);
      return { ...errors, auth: "Unknown Error! Try again" };
  }
}
