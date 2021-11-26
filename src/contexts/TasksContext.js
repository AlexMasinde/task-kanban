import { createContext, useContext, useEffect, useState } from "react";
import { collection, getDocs, query, where } from "@firebase/firestore";

import { database } from "../firebase";

import { useProjects } from "./ProjectsContext";

const TasksContext = createContext();

export function useTasks() {
  return useContext(TasksContext);
}

export function TasksProvider({ children }) {
  const [tasksLoading, setTasksLoading] = useState(false);
  const [tasksError, setTasksError] = useState(null);
  const [tasks, setTasks] = useState([]);
  const { selectedProject } = useProjects();

  useEffect(() => {
    async function fetchTasks() {
      try {
        setTasksError(null);
        setTasksLoading(true);
        const tasksQuery = query(collection(database, "tasks"));
        const tasksData = await getDocs(
          tasksQuery,
          where("projectId", "==", selectedProject.id)
        );
        const tasks = tasksData.docs.map((doc) => {
          return { ...doc.data(), id: doc.id };
        });
        setTasks(tasks);
        setTasksLoading(false);
      } catch (err) {
        console.log(err);
        setTasksError("Could not load tasks");
        setTasksLoading(false);
      }
    }
    fetchTasks();
  }, [selectedProject]);

  const value = {
    tasks,
    tasksLoading,
    tasksError,
    setTasks,
  };

  return (
    <TasksContext.Provider value={value}>{children}</TasksContext.Provider>
  );
}
