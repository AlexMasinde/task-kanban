import React from "react";
import { useNavigate } from "react-router";

import { useTasks } from "../../contexts/TasksContext";

import TaskCard from "../TaskCard/TaskCard";

import add from "../../icons/add.svg";

import TaskGroupStyles from "./TaskGroup.module.css";

export default function TaskGroup({ taskGroup }) {
  const navigate = useNavigate();
  const { tasks, setEditTask } = useTasks();

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

  return (
    <div className={TaskGroupStyles.container}>
      <div
        className={TaskGroupStyles.header}
        style={{ background: `${backgroundColor}` }}
      >
        <h3>{`${taskGroup} Tasks`}</h3>
      </div>
      <div className={TaskGroupStyles.cardscontainer}>
        {taskGroupTasks.map((taskGroupTask) => {
          return <TaskCard taskGroup={taskGroup} task={taskGroupTask} />;
        })}
        <div onClick={addTask} className={TaskGroupStyles.add}>
          <img src={add} alt="add task" />
          <p>Add Task</p>
        </div>
      </div>
    </div>
  );
}
