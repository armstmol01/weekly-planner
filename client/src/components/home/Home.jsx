import React from 'react'
import './Home.css'
import Nav from '../nav/Nav'
import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom' // for passed in state from navigate()
import { IoIosAdd } from 'react-icons/io'
import { BsCheck } from 'react-icons/bs'
import Day from '../day/Day'

const Home = (props) => {
  const location = useLocation();
  const userData = location.state.resp;
  const [loaded, setLoaded] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [notes, setNotes] = useState(false);

  useEffect(() => {
    setLoaded(false);
    let url = "/api/tasks?id=" + userData.id;
    fetch(url)
       .then((res) => (res.json()))
       .then(checkStatus)
       .then(handleResponse)
       .catch(handleError);
  }, []);

  const handleResponse = async (res) => {

    setLoaded(true);
  }

  const sortTasks = (tasks) => {
    // array of task arrays, corressponding to day
    // 1 = mon, ... , 7 = sun
    console.log(tasks);
    let week = [[], [], [], [], [], [], []];
    for (let k = 0; k < tasks.length; k++) {}
  }

  const checkStatus = async (res) => {
    if (!res.ok) {
      let message = await res.text();
      throw new Error(message);
    }
    return res;
  }

  const handleError = (error) => {
    setErrorMsg(error.message);
  }

  return (
    <>
      <Nav data='home'></Nav>
      <h2 className='week-title'>this week</h2>
      <div className="week__container">
        <div className='weekdays__container'>
          <Day data={{id: userData.id, day: 1, tasks: [], title: 'mon'}} />
          <Day data={{id: userData.id, day: 2, tasks: [], title: 'tue'}} />
          <Day data={{id: userData.id, day: 3, tasks: [], title: 'wed'}} />
          <Day data={{id: userData.id, day: 4, tasks: [], title: 'thu'}} />
          <Day data={{id: userData.id, day: 5, tasks: [], title: 'fri'}} />
        </div>
        <div className='weekend__container'>
          <Day data={{id: userData.id, day: 6, tasks: [], title: 'sat'}} />
          <Day data={{id: userData.id, day: 7, tasks: [], title: 'sun'}} />
          <section className='notes'>
            <p className='notes-title'>Notes</p>
            <textarea className='notes-input' spellCheck='false'></textarea>
          </section>
        </div>
      </div>
    </>
  )
}

export default Home