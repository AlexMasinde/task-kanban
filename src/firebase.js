import { initializeApp } from "firebase/app";
import { getFirestore, collection } from "firebase/firestore";
import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

initializeApp(firebaseConfig);

const database = getFirestore();
const auth = getAuth();

//collections
const projects = collection(database, "projects");
const tasks = collection(database, "tasks");

//authentication
const signinWithEmail = async (email, password) =>
  await signInWithEmailAndPassword(auth, email, password);

const createAccountWithEmail = async (email, password) =>
  await createUserWithEmailAndPassword(auth, email, password);

const authenticateWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  await signInWithPopup(auth, provider);
};
const userLogout = async () => await signOut(auth);

const authStateChanged = () =>
  onAuthStateChanged(auth, (user) => {
    return user;
  });

export {
  projects,
  tasks,
  signinWithEmail,
  createAccountWithEmail,
  userLogout,
  authStateChanged,
  authenticateWithGoogle,
};
