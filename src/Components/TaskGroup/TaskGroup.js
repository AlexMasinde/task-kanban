import React, { useState } from "react";
import { useNavigate } from "react-router";

import { doc, updateDoc } from "@firebase/firestore";
import { database } from "../../firebase";

import { useTasks } from "../../contexts/TasksContext";

import TaskCard from "../TaskCard/TaskCard";

import add from "../../icons/add.svg";

import TaskGroupStyles from "./TaskGroup.module.css";

export default function TaskGroup({ taskGroup }) {
  const { tasks, setEditTask, setTasks } = useTasks();
  const [draggingOver, setDraggingOver] = useState(false);
  const [taskUpdateError, setTaskUpdateError] = useState(null);
  const navigate = useNavigate();

  const taskGroupTasks = tasks.filter((task) => task.status === taskGroup);

  function addTask() {
    setEditTask(null);
    navigate(`addtask/${taskGroup}`);
  }

  const backgroundColor =
    taskGroup === "Pending"
      ? "#1C5A7C"
      : taskGroup === "Ongoing"
      ? "#106354"
      : "#54117D";

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
            return <TaskCard taskGroup={taskGroup} task={taskGroupTask} />;
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
