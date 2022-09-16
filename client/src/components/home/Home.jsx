import React from 'react'
import './Home.css'
import { useState, useRef, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom' // for passed in state from navigate()
import Nav from '../nav/Nav'
import Day from '../day/Day'
import axios from 'axios'
var moment = require('moment');

const Home = (props) => {
  const location = useLocation();
  const userData = location.state.resp;
  const notes = useRef("");
  const [loaded, setLoaded] = useState(false);
  const [errorMsg, setErrorMsg] = useState("Ok");
  const [tasks, setTasks] = useState([[], [], [], [], [], [], []]);
  const [keys, setKeys] = useState([0, 7, 14, 28, 35, 42, 49]); // keys can't conflict w/ eachother

  useEffect(() => {
    let urlTasks = "/api/tasks?id=" + userData.id;
    fetch(urlTasks)
     .then((res) => (res.json()))
     .then(sortTasks)
     .catch(handleError);
    let urlNotes = "/api/notes?id=" + userData.id;
    fetch(urlNotes)
     .then((res) => (res.json()))
     .then(setNotes)
     .catch(handleError);
    //  window.onbeforeunload = saveNotes;
    //  return () => {
    //   window.onbeforeunload("null")
    //  };
  }, []); // [] = callback function on first render

  const clearWeek = async () => {
    // console.log("CLEARING WEEK");
    axios.post('/api/delete-week', {
      userId: userData.id
    })
    .catch(handleError);
    // clear tasks (update keys to rerender Day components)
    setTasks([[], [], [], [], [], [], []]);
    // notes.current = "";
    RenderDays();
  }

  const saveNotes = async (notesContent) => {
    // console.log("SAVING NOTES");
    // console.log("notes value to save: " + notes);
    await axios.post('/api/save-notes', {
      userId: userData.id,
      notes: notesContent || "" // notes.current
    })
    .catch(handleError);
  }

  const setNotes = (res) => {
    notes.current = res.notes;
    // document.getElementById('notesbox').value = res.notes;
  }

  const sortTasks = (res) => {
    // array of task arrays, corressponding to day
    // 1 = mon, ... , 7 = sun
    let tasks = res.tasks;
    let week = [[], [], [], [], [], [], []];
    for (let i = 0; i < tasks.length; i++) {
      week[tasks[i].day - 1].unshift(tasks[i]); // indices 0 - 6 hold days 1 - 7
    }
    // console.log(week);
    // console.log(week[0]);
    setLoaded(true);
    setTasks(week);
  }

  const RenderDays = () => {
    let temp = keys;
    for (let i = 0; i < keys.length; i++) {
      temp[i] = keys[i] + 1;
    }
    setKeys(temp);
  }

  const handleError = (error) => {
    // console.log(error);
    setLoaded(false);
    // console.log(error);
    if (error.response) {
      // console.log(error.response.data);
      setErrorMsg(error.response.data);
    }
  }

  return (
    <>
      <Nav data='home'></Nav>
      <h2 className='week-title'>{moment().format('dddd').toLowerCase()}</h2>
      {loaded?
      <div className="week__container">
        <p className='clear-btn' onClick={clearWeek}>clear</p>
        <div className='weekdays__container'>
          <Day data={{id: userData.id, day: 1, tasks: tasks[0], title: 'mon'}} key={keys[0]} />
          <Day data={{id: userData.id, day: 2, tasks: tasks[1], title: 'tue'}} key={keys[1]}/>
          <Day data={{id: userData.id, day: 3, tasks: tasks[2], title: 'wed'}} key={keys[2]}/>
          <Day data={{id: userData.id, day: 4, tasks: tasks[3], title: 'thu'}} key={keys[3]}/>
          <Day data={{id: userData.id, day: 5, tasks: tasks[4], title: 'fri'}} key={keys[4]}/>
        </div>
        <div className='weekend__container'>
          <Day data={{id: userData.id, day: 6, tasks: tasks[5], title: 'sat'}} key={keys[5]}/>
          <Day data={{id: userData.id, day: 7, tasks: tasks[6], title: 'sun'}} key={keys[6]}/>
          <section className='notes'>
            <p className='notes-title'>Notes</p>
            <textarea id='notesbox' className='notes-input' spellCheck='false' defaultValue={notes.current} onBlur={(event) => saveNotes(event.currentTarget.value)}></textarea>
          </section>
        </div>
      </div> : ''
      }
    </>
  )
}

export default Home; // React.memo(component)