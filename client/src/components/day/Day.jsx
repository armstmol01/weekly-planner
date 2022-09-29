import React from 'react'
import { useState, useEffect, useRef, useReducer } from 'react'
import './Day.css'
import TaskList from '../taskList/TaskList'
import { IoIosAdd } from 'react-icons/io'
import { BsCheck } from 'react-icons/bs'
import axios from 'axios'

const Day = (props) => {
  // console.log(props.data);
  let title = props.data.title;
  let id = props.data.id;
  let day = props.data.day;
  let tasks = props.data.tasks;
  let scrollBottom = 'special-' + props.data.title.substring(0,3);
  const newTask = useRef("");
  const [taskState, setTaskState] = useState(tasks);
  const [active, setActive] = useState(false);

  const addTask = async () => {
    // create new task
    if (!newTask.current.trim().length) {
      newTask.current = "";
      setActive(false);
      return;
    }

    await axios.post('/api/add-task', {
      userId: id,
      day: day,
      task: newTask.current.trim() // document.getElementById('task-input').value
    })
    .then(updateTasks(newTask.current))
    .catch(setActive(false));
  }

  const updateTasks = (taskContent) => {
    setActive(false);
    // important in case that user adds an empty task by newTask is still value of previous
    newTask.current = "";
    let temp = taskState;
    temp.push({id: temp.length + 1, user_id: id, day: day, content: taskContent});
    setTaskState(temp);
    document.getElementById('task-input').textContent = "";
  }

  const activeTask = () => {
    setActive(true);
    // important that it's delayed to make sure elem is rendered
    setTimeout(() => {
      let elem = document.getElementById(scrollBottom);
      elem.scrollIntoView(false)}, 10);
  }

  return (
    <section className={title}>
      {active===false?<IoIosAdd className='fixed__btn' onClick={() => activeTask()}/>:<BsCheck className='fixed__btn' onClick={() => {addTask()}}/>}
      <p className='day-title'>{title}</p>
      <div className='spacing'><br></br></div>
      <div id='tasks__container'>
        <TaskList data={{userId: id, day: day, tasks: taskState}} />
        {active===true?<div id={scrollBottom} className='task new-task'>
          <div className='check__box'></div>
          <input id='task-input' default="" spellCheck='false' onChange={(event) => {newTask.current = event.target.value}}></input>
        </div>: ''}
      </div>
    </section>
  )
}

export default Day;