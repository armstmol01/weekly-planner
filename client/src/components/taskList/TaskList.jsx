import React from 'react'
import { useEffect, useRef } from 'react';
import './TaskList.css'
import axios from 'axios'

const TaskList = (props) => {
  let tasks = props.data.tasks;
  let userId = props.data.userId;
  let day = props.data.day;
  const tasksRef = useRef(tasks);
  // console.log(tasks);

  const deleteTask = async (event) => {
    // console.log(event.currentTarget);
    event.currentTarget.classList.add('hidden');
    delete tasks[event.currentTarget.id]; // using index as id so we can delete task by index

    await axios.post('/api/delete-task', {
      userId: userId,
      day: day,
      task: event.currentTarget.querySelector('p').textContent
    });


    // DELETE from tasks where day = {given day}
    // AND content = {given content} OR id = {given id}
    // make async!
  }

  const handleTaskClick = (event) => {
    switch (event.detail) {
      case 1: {
        event.currentTarget.classList.toggle('completed');
        break;
      }
      case 2: {
        deleteTask(event);
        break;
      }
      default: {
        break;
      }
    }
  }

  return (
    tasks.map(({content, id}, index) => {
      return (
        <div className='task' id={index} key={index} onClick={handleTaskClick}>
          <div className='check__box'></div>
          <p>{content}</p>
        </div>
      );
    })
  )
}

export default TaskList