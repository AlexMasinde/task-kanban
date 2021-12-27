import React, { useState } from "react";
import { useNavigate } from "react-router";

import { doc, updateDoc } from "@firebase/firestore";
import { database } from "../../firebase";

import { useTasks } from "../../contexts/TasksContext";
import { useProjects } from "../../contexts/ProjectsContext";

import TaskCard from "../TaskCard/TaskCard";

import add from "../../icons/add.svg";

import TaskGroupStyles from "./TaskGroup.module.css";
import { deleteSavedItem } from "../../utils/localStorage";

export default function TaskGroup({ taskGroup }) {
  const { tasks, setTasks } = useTasks();
  const { selectedProject } = useProjects();
  const [draggingOver, setDraggingOver] = useState(false);
  const [taskUpdateError, setTaskUpdateError] = useState(null);
  const navigate = useNavigate();

  const taskGroupTasks = tasks.filter(
    (task) => task.status === taskGroup && task.projectId === selectedProject.id
  );

  function addTask() {
    deleteSavedItem("taskToEdit");
    navigate(`addtask/${taskGroup}`);
  }

  const backgroundColor =
    taskGroup === "Pending"
      ? "#54117D"
      : taskGroup === "Ongoing"
      ? "#106354"
      : taskGroup === "Completed"
      ? "#71441B"
      : "#6E6D6D";

  function handleDragOver(e) {
    e.preventDefault();
    setDraggingOver(true);
  }

  async function handleDrop(e) {
    const id = e.dataTransfer.getData("text/plain");
    const task = tasks.find((task) => task.id === id);
    if (task.status === taskGroup) return;
    const previousTaskGroup = task.status;
    task.status = taskGroup;
    setTasks([...tasks]);
    try {
      const updateData = { status: taskGroup };
      const taskQuery = doc(database, "tasks", task.id);
      await updateDoc(taskQuery, updateData);
    } catch (err) {
      task.status = previousTaskGroup;
      setTasks([...tasks]);
      setTaskUpdateError("Could not update task! Try again");
      setTimeout(() => {
        setTaskUpdateError(null);
      }, 3000);
    }
  }

  return (
    <>
      <div className={TaskGroupStyles.container}>
        <div
          className={TaskGroupStyles.header}
          style={{ background: `${backgroundColor}` }}
        >
          <h3>{`${taskGroup} Tasks`}</h3>
        </div>
        <div
          onDragOver={(e) => handleDragOver(e)}
          onDrop={(e) => handleDrop(e)}
          className={TaskGroupStyles.cardscontainer}
        >
          {taskGroupTasks.map((taskGroupTask) => {
            return (
              <TaskCard
                taskGroup={taskGroup}
                task={taskGroupTask}
                key={taskGroupTask.id}
              />
            );
          })}
          <div onClick={addTask} className={TaskGroupStyles.add}>
            <img src={add} alt="add task" />
            <p>Add Task</p>
          </div>
        </div>
      </div>
      {taskUpdateError && (
        <div className={TaskGroupStyles.taskupdateerror}>
          <p>Could not update task! Try again</p>
        </div>
      )}
    </>
  );
}
