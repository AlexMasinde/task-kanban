import { useEffect } from "react";
import { createContext, useContext, useReducer } from "react";

import { collection, query, getDocs, where } from "firebase/firestore";

import { database } from "../firebase";

import { useAuth } from "./AuthContext";

const ProjectsContext = createContext();

export function useProjects() {
  return useContext(ProjectsContext);
}

function reducer(state, action) {
  switch (action.type) {
    case "SET_PROJECTS":
      return { ...state, projects: action.payload };
    case "SET_SELECTED_PROJECT":
      return { ...state, selectedProject: action.payload };
    case "SET_PROJECTS_ERROR":
      return { ...state, projectsError: action.payload };
    case "SET_PROJECTS_LOADING":
      return { ...state, projectsLoading: action.payload };
    default:
      return state;
  }
}

const initialState = {
  projects: [],
  projectsError: null,
  projectsLoading: false,
  selectedProject: null,
};

export function ProjectsProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { currentUser } = useAuth();

  useEffect(() => {
    async function fetchProjects() {
      try {
        dispatch({ type: "SET_PROJECTS_LOADING", payload: true });
        dispatch({ type: "SET_PROJECTS_ERROR", payload: null });
        const projectsQuery = query(
          collection(database, "projects"),
          where("user", "==", currentUser.uid)
        );
        const dataSnapshot = await getDocs(projectsQuery);
        const projectsData = dataSnapshot.docs.map((doc) => {
          return { ...doc.data(), id: doc.id };
        });
        dispatch({ type: "SET_PROJECTS", payload: projectsData });
        dispatch({ type: "SET_PROJECTS_LOADING", payload: false });
      } catch (err) {
        dispatch({ type: "SET_PROJECTS_LOADING", payload: false });
        dispatch({
          type: "SET_PROJECTS_ERROR",
          payload: "Error loading projects: Try Again!",
        });
      }
    }
    fetchProjects();
  }, [currentUser]);

  const value = {
    ...state,
    dispatch,
  };

  return (
    <ProjectsContext.Provider value={value}>
      {children}
    </ProjectsContext.Provider>
  );
}
