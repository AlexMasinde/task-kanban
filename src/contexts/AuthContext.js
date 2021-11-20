import React, { createContext, useContext, useEffect, useState } from "react";
import {
  authenticateWithGoogle,
  createAccountWithEmail,
  signinWithEmail,
  userLogout,
} from "../firebase";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  function userSignup(email, password) {
    return createAccountWithEmail(email, password);
  }

  function userLogin(email, password) {
    return signinWithEmail(email, password);
  }

  function withGoogle() {
    return authenticateWithGoogle;
  }

  function deleteAccount() {
    return auth.currentUser.delete();
  }

  function signout() {
    return userLogout();
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    loading,
    setCurrentUser,
    userSignup,
    signout,
    userLogin,
    withGoogle,
    deleteAccount,
  };

  return (
    <>
      {loading && <div>Loading</div>}
      {!loading && (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
      )}
    </>
  );
}
