import React from 'react'
import { useState, useRef} from 'react'
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
  const enterKeyPress = useRef(false);
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
      task: newTask.current.trim()
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
    document.querySelector('.task-input').textContent = "";
    // if user hits enter to submit task, add new task input
    // for ease of creating multiple tasks
    if (enterKeyPress.current) {
      enterKeyPress.current = false;
      setTimeout(() => {activeTask();}, 10);
    }
  }

  const activeTask = () => {
    setActive(true);
    // important that it's delayed to make sure elem is rendered
    setTimeout(() => {
      let elem = document.getElementById(scrollBottom);
      elem.scrollIntoViewIfNeeded(false)}, 10);
  }

  // making the task container a form allows user to submit
  // task w/ 'enter' key
  const handleSubmit = (event) => {
    event.preventDefault();
    if (active) {
      addTask();
    } else {
      activeTask();
    }
  }

  // allows us to differentiate between submitting by pressing enter
  // key in input box and by clicking on submit button
  // when we press enter key we want another input box to appear
  const updateEnterKeyPress = (event) => {
    if (event.keyCode === 13) {
      enterKeyPress.current = true;
    }
  }

  return (
    <section className={title}>
      <p className='day-title'>{title}</p>
      <form className='tasks__container' onSubmit={event => handleSubmit(event)}>
        <button id='fixed__btn' type='submit'>{active===false?<IoIosAdd/>:<BsCheck/>}</button>
        <div className='spacing'><br></br></div>
        <TaskList data={{userId: id, day: day, tasks: taskState}} />
        {active===true?<div id={scrollBottom} className='input__task new-task'>
          <div className='check__box'></div>
          <input className='task-input' autoFocus type='text' default="" spellCheck='false' onBlur={event => handleSubmit(event)} onKeyDown = {event => updateEnterKeyPress(event)} onChange={(event) => {newTask.current = event.target.value}}></input>
        </div>: ''}
      </form>
    </section>
  )
}

export default Day;