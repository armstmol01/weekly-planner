import React from 'react'
import './Home.css'
import { useState, useRef, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom' // for passed in state from navigate()
import Nav from '../nav/Nav'
import Day from '../day/Day'
import axios from 'axios'
import {FiSettings} from 'react-icons/fi'
import {IoMdArrowRoundBack} from 'react-icons/io'
var moment = require('moment');

const Home = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const userData = location.state.resp;
  const weekDates = useRef(['','','','','','','']);
  const notes = useRef("");
  const [loadedTasks, setLoadedTasks] = useState(false);
  const [loadedNotes, setLoadedNotes] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [tasks, setTasks] = useState([[], [], [], [], [], [], []]);
  const [keys, setKeys] = useState([0, 7, 14, 28, 35, 42, 49]); // keys won't conflict w/ eachother

  useEffect(() => {
    let urlTasks = "/api/tasks?id=" + encodeURIComponent(userData.id);
    fetch(urlTasks)
     .then((res) => (res.json()))
     .then(sortTasks)
     .catch(handleError);
    let urlNotes = "/api/notes?id=" + encodeURIComponent(userData.id);
    fetch(urlNotes)
     .then((res) => (res.json()))
     .then(setNotes)
     .catch(handleError);
    // notes will display correctly
    // instead of sometimes rendering when notes.current = ""
    // (its initial value)

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
    // clear notes
    document.getElementById("notesbox").value = "";
    notes.current = "";
    // update week display
    RenderDays();
  }

  const saveNotes = async (notesContent) => {
    // console.log("SAVING NOTES");
    // console.log(notesContent);
    let content = notesContent || "";
    await axios.post('/api/save-notes', {
      userId: userData.id,
      notes: content.trim() // notes.current
    })
    .catch(handleError);
  }

  const setNotes = (res) => {
    notes.current = res.notes;
    setLoadedNotes(true);
    // document.getElementById('notesbox').value = res.notes;
  }

  const sortTasks = (res) => {
    // array of task arrays, corressponding to day
    // 1 = mon, ... , 7 = sun
    let tasks = res.tasks;
    let week = [[], [], [], [], [], [], []];
    for (let i = 0; i < tasks.length; i++) {
      // unshift = add to front of list
      week[tasks[i].day - 1].push(tasks[i]); // indices 0 - 6 hold days 1 - 7
    }
    weekDates.current = getWeekDates();
    setTasks(week);
    setLoadedTasks(true);
  }

  const getWeekDates = () => {
    let week = [];
    // Sunday before--our version of--the week begins
    let day = moment().startOf('week');

    // if today is Sunday, we want to display it
    // and the previous week
    if (moment().weekday() === 0) {
      // start week w/ prev Monday to current Sunday
      day = day.subtract(7, 'days');
    }

    // calculate the dates of the 7 day week
    for (let i = 0; i < 7; i++) {
      day = day.add(1, 'days');
      let dateString = day.format('MMDD');
      let monthDate = dateString.slice(0, 2);
      let dayDate = dateString.slice(2);
      // if 05-02 display display 5-2
      if (monthDate.slice(0, 1) === '0') {
        monthDate = monthDate.slice(1);
      }
      if (dayDate.slice(0, 1) === '0') {
        dayDate = dayDate.slice(1);
      }
      week.push(monthDate + '-' + dayDate);
    }

    return week;
  }

  const RenderDays = () => {
    let temp = keys;
    for (let i = 0; i < keys.length; i++) {
      temp[i] = keys[i] + 1;
    }
    setKeys(temp);
  }

  const NavToAccount = () => {
    navigate('/account', {state: {userData}});
  }

  const handleError = (error) => {
    // console.log(error);
    setLoadedTasks(false);
    setLoadedNotes(false);
    // if (error.response) {
    //   // console.log(error.response.data);
    //   setErrorMsg(error.response.data);
    // } else {
    setErrorMsg("Failed to load resources");
    // }
  }

  return (
    <div className='home__container'>
      {/* <Nav data='home'></Nav> */}
      <nav>
        <div className='link'>
          <IoMdArrowRoundBack className='back-arrow-icon' onClick={() => {navigate(-1)}}/>
        </div>
        <div className='link'>
          <FiSettings className='account-icon' onClick={NavToAccount}/>
        </div>
      </nav>
      <h2 className='week-title fadeIn'>{moment().format('dddd').toLowerCase()}</h2>
      {loadedTasks && loadedNotes ?
      <div className='week__container fadeIn'>
        <p className='clear-btn' onClick={clearWeek}>clear</p>
        <div className='weekdays__container'>
          <Day data={{id: userData.id, day: 1, tasks: tasks[0], title: 'mon ' + weekDates.current[0]}} key={keys[0]} />
          <Day data={{id: userData.id, day: 2, tasks: tasks[1], title: 'tue ' + weekDates.current[1]}} key={keys[1]}/>
          <Day data={{id: userData.id, day: 3, tasks: tasks[2], title: 'wed ' + weekDates.current[2]}} key={keys[2]}/>
          <Day data={{id: userData.id, day: 4, tasks: tasks[3], title: 'thu ' + weekDates.current[3]}} key={keys[3]}/>
          <Day data={{id: userData.id, day: 5, tasks: tasks[4], title: 'fri ' + weekDates.current[4]}} key={keys[4]}/>
        </div>
        <div className='weekend__container'>
          <Day data={{id: userData.id, day: 6, tasks: tasks[5], title: 'sat ' + weekDates.current[5]}} key={keys[5]}/>
          <Day data={{id: userData.id, day: 7, tasks: tasks[6], title: 'sun ' + weekDates.current[6]}} key={keys[6]}/>
          <section className='notes'>
            <p className='notes-title'>Notes</p>
            <textarea id='notesbox' className='notes-input' spellCheck='false' defaultValue={notes.current} onBlur={() => {saveNotes(document.getElementById('notesbox').value)}}></textarea>
          </section>
        </div>
      </div> :
      <div className='error__container'>
        <p className='error__msg'>{errorMsg}</p>
      </div>
      }
    </div>
  )
}

export default Home; // React.memo(component)