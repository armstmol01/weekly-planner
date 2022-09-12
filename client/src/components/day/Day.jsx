import React from 'react'
import { useState, useEffect } from 'react'
import './Day.css'
import { IoIosAdd } from 'react-icons/io'
import { BsCheck } from 'react-icons/bs'
import axios from 'axios'

const Day = (props) => {
  let title = props.data.title;
  let id = props.data.id;
  let day = props.data.day;
  let tasks = props.data.tasks;
  const [newTask, setNewTask] = useState("");
  const [taskList, setTaskList] = useState([]);
  const [active, setActive] = useState(false);

  useEffect(() => {
    makeTaskList(tasks);
  }, []);

  const addTask = async () => {
    // create new user account
    await axios.post('/api/new-user', {
      userId: id,
      day: day,
      task: newTask
    })
    .then(displayNewTask(newTask)) // go back to login
    .catch(setActive(false));
  }

  const displayNewTask = (taskContent) => {
    setActive(false);
    let currTaskList = taskList;
    let newKey = taskList.length;
    currTaskList.push(
      <div className='task' key={newKey}>
        <div className='check__box'></div>
        <p>{taskContent}</p>
      </div>
    );
    setTaskList(currTaskList);
    // reset input
    let input = document.getElementById('task-input');
    input.textContent = '';
  }

  function makeTaskList(tasks) {
    let temp = tasks.map(({day, content}, index) => {
      return (
        <div className='task' key={index}>
          <div className='check__box'></div>
          <p>{content}</p>
        </div>
      );
    });
    setTaskList(temp);
  }

  // const handleNewUser = (res) => {
  //   console.log(res);
  //   setErrorMsg('');
  //   setSuccessMsg('Created new user! Please return to login');
  //   // setTimeout(() => {navigate(-1)}, 2000); // return to the previous page (login)
  // }

  // const handleError = (error) => {
  //   console.log(error);
  //   setErrorMsg(error.response.data);
  // }

  return (
    <section className={title}>
      {active===false?<IoIosAdd className='fixed__btn' onClick={() => {setActive(true)}}/>:<BsCheck className='fixed__btn' onClick={() => {addTask()}}/>}
      <p className='day-title'>{title}</p>
      <div className='spacing'><br></br></div>
      {active===true?<div className='task new-task'>
        <div className='check__box'></div>
        <input id='task-input' spellCheck='false' onChange={(event) => {setNewTask(event.target.value)}}></input>
      </div>:''}
      <div className='task'>
        <div className='check__box'></div>
        <p>Math 1.2-1.3 jgiggihggojfnaknadk feiowhfehiefiof ejhfeiohifhewifhei</p>
      </div>
      <div className='task completed'>
        <div className='check__box'></div>
        <p>English Essay</p>
      </div>
      <div className='task completed'>
        <div className='check__box'></div>
        <p>CSE333 Project</p>
      </div>
      <div className='task'>
        <div className='check__box'></div>
        <p>CSE484 Project</p>
      </div>
      <div className='task'>
        <div className='check__box'></div>
        <p>Math 1.2-1.3</p>
      </div>
      <div className='task completed'>
        <div className='check__box'></div>
        <p>English Essay</p>
      </div>
      <div className='task completed'>
        <div className='check__box'></div>
        <p>CSE333 Project</p>
      </div>
      <div className='task'>
        <div className='check__box'></div>
        <p>CSE484 Project</p>
      </div>
    </section>
  )
}

export default Day