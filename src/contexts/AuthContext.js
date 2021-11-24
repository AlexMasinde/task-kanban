import React, { createContext, useContext, useEffect, useState } from "react";

import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";

import { auth } from "../firebase";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  function userSignup(email, password) {
    return createUserWithEmailAndPassword(auth, email, password);
  }

  function userLogin(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  function googleSignin() {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider);
  }

  function deleteAccount() {
    return auth.currentUser.delete();
  }

  function userSingOut() {
    return signOut(auth);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
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
    userSingOut,
    userLogin,
    googleSignin,
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
