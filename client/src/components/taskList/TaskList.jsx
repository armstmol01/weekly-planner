import React from 'react'
import './TaskList.css'
import axios from 'axios'

const TaskList = (props) => {
  let tasks = props.data.tasks;
  let userId = props.data.userId;
  let day = props.data.day;
  // console.log(tasks);

  const deleteTask = async (event) => {
    event.currentTarget.classList.add('hidden');
    delete tasks[event.currentTarget.id]; // using index as id so we can delete task by index

    await axios.post('/api/delete-task', {
      userId: userId,
      day: day,
      task: event.currentTarget.querySelector('p').textContent
    }).catch();
  }

  const checkTask = async (task, checkedStatus) => { // task = event.currentTarget
    await axios.post('/api/check-task', {
      userId: userId,
      day: day,
      task: task.querySelector('p').textContent,
      checkedStatus: checkedStatus
    }).catch();
  }

  const handleTaskClick = (event) => {
    switch (event.detail) {
      case 1: {
        event.currentTarget.classList.toggle('completed');
        let checkedStatus = event.currentTarget.classList.contains('completed');
        // this fixes the checked bug after adding a task!
        // since props aren't changed/no new fetch call when we add a task
        // the .completed is associated w/ index not the task itself, so we have to make
        // sure to update props whenever a task is checked so .completed will "belong" to the task
        tasks[event.currentTarget.id].checked = event.currentTarget.classList.contains('completed');
        checkTask(event.currentTarget, checkedStatus);
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
    tasks.map(({content, checked, id}, index) => {
      let cName = 'task';
      if (checked) {
        cName += ' completed';
      }

      return (
        <div className={cName} id={index} key={index} onClick={handleTaskClick}>
          <div className='check__box'></div>
          <p>{content}</p>
        </div>
      );
    })
  )
}

export default TaskList