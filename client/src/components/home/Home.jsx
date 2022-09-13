import React from 'react'
import './Home.css'
import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom' // for passed in state from navigate()
import Nav from '../nav/Nav'
import Day from '../day/Day'

const Home = (props) => {
  const location = useLocation();
  const userData = location.state.resp;
  const [loaded, setLoaded] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [notes, setNotes] = useState(false);
  const [tasks, setTasks] = useState([[], [], [], [], [], [], []]);

  useEffect(() => {
    let url = "/api/tasks?id=" + userData.id;
    fetch(url)
     .then((res) => (res.json()))
     .then(sortTasks)
     .catch(handleError);
  }, []); // [] = callback function on first render

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

  const handleError = (error) => {
    console.log(error);
    setLoaded(false);
    setErrorMsg(error.response.data);
  }

  return (
    <>
      <Nav data='home'></Nav>
      <h2 className='week-title'>this week</h2>
      {loaded?
      <div className="week__container">
        <div className='weekdays__container'>
          <Day data={{id: userData.id, day: 1, tasks: tasks[0], title: 'mon'}} />
          <Day data={{id: userData.id, day: 2, tasks: tasks[1], title: 'tue'}} />
          <Day data={{id: userData.id, day: 3, tasks: tasks[2], title: 'wed'}} />
          <Day data={{id: userData.id, day: 4, tasks: tasks[3], title: 'thu'}} />
          <Day data={{id: userData.id, day: 5, tasks: tasks[4], title: 'fri'}} />
        </div>
        <div className='weekend__container'>
          <Day data={{id: userData.id, day: 6, tasks: tasks[5], title: 'sat'}} />
          <Day data={{id: userData.id, day: 7, tasks: tasks[6], title: 'sun'}} />
          <section className='notes'>
            <p className='notes-title'>Notes</p>
            <textarea className='notes-input' spellCheck='false'></textarea>
          </section>
        </div>
      </div> : ''
      }
    </>
  )
}

export default Home; // React.memo(component)