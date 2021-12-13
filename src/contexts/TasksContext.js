import { createContext, useContext, useEffect, useState } from "react";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
} from "@firebase/firestore";
import { captureException } from "@sentry/react";

import { database } from "../firebase";

import { useAuth } from "./AuthContext";

const TasksContext = createContext();

export function useTasks() {
  return useContext(TasksContext);
}

export function TasksProvider({ children }) {
  const [tasksLoading, setTasksLoading] = useState(false);
  const [tasksError, setTasksError] = useState(null);
  const [editTask, setEditTask] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [deleteTask, setDeleteTask] = useState(null);
  const [notification, setNotification] = useState(true);

  const { currentUser } = useAuth();

  useEffect(() => {
    if (!currentUser) return;
    async function fetchTasks() {
      try {
        setTasksError(null);
        setTasksLoading(true);
        const tasksQuery = query(
          collection(database, "tasks"),
          where("user", "==", currentUser.uid),
          orderBy("createdAt", "desc")
        );
        const tasksData = await getDocs(tasksQuery);
        const tasks = tasksData.docs.map((doc) => {
          return { ...doc.data(), id: doc.id };
        });
        setTasks(tasks);
        setTasksLoading(false);
      } catch (err) {
        captureException(err);
        setTasksError("Could not load tasks");
        setTasksLoading(false);
      }
    }
    fetchTasks();
  }, [currentUser]);

  const value = {
    tasks,
    tasksLoading,
    tasksError,
    editTask,
    deleteTask,
    notification,
    setNotification,
    setDeleteTask,
    setEditTask,
    setTasks,
  };

  return (
    <TasksContext.Provider value={value}>{children}</TasksContext.Provider>
  );
}
