import React from 'react'
import { useState, useEffect, useRef, useReducer } from 'react'
import './Day.css'
import TaskList from '../taskList/TaskList'
import { IoIosAdd } from 'react-icons/io'
import { BsCheck } from 'react-icons/bs'
import axios from 'axios'
import { AiOutlineReload } from 'react-icons/ai'

const Day = (props) => {
  // console.log(props.data);
  let title = props.data.title;
  let id = props.data.id;
  let day = props.data.day;
  let tasks = props.data.tasks;
  const [taskState, setTaskState] = useState(tasks);
  // let taskList = [];
  // const taskList = useRef([]);
  const [newTask, setNewTask] = useState("");
  const [active, setActive] = useState(false);
  // const [, forceUpdate] = useReducer((x) => x + 1, 0)
  // const [updateTasks, setUpdateTasks] = useState(false);

  // useEffect(() => {


  //   setTaskList(taskState.map(({content, id}, index) => {
  //     return (
  //       <div className='task' key={id} onClick={handleTaskClick}>
  //         <div className='check__box'></div>
  //         <p>{content}</p>
  //       </div>
  //     );
  //   }));
  // }, [taskState, setTaskState]);

  const addTask = async () => {
    // create new user account
    await axios.post('/api/add-task', {
      userId: id,
      day: day,
      task: document.getElementById('task-input').value
    })
    .then(updateTasks(document.getElementById('task-input').value)) // go back to login
    .catch(setActive(false));
  }

  const updateTasks = (taskContent) => {
    setActive(false);
    let temp = taskState;
    temp.unshift({id: temp.length + 1, user_id: id, day: day, content: taskContent});
    setTaskState(temp);
    document.getElementById('task-input').textContent = "";
  }

  // function makeTaskList(tasks) {
  //   let temp = tasks.map(({content, id}, index) => {
  //     return (
  //       <div className='task' key={id} onClick={handleTaskClick}>
  //         <div className='check__box'></div>
  //         <p>{content}</p>
  //       </div>
  //     );
  //   });
  //   return temp;
  // }

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
        <input id='task-input' spellCheck='false'></input>
      </div>:''}
      <TaskList data={{userId: id, day: day, tasks: taskState}} />
      {/* <div className='task'>
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
      </div> */}
    </section>
  )
}

export default Day;