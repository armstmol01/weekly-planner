import React from 'react'
import './Home.css'
import Nav from '../nav/Nav'
import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom' // for passed in state from navigate()
import { IoIosAdd } from 'react-icons/io'

const Home = (props) => {
  const location = useLocation();
  const userData = location.state.resp;
  const [loaded, setLoaded] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

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

  const inputBox = (add) => {
    if (add) {
      return <input className='task__input'></input>;
    } else {
      return <></>;
    }
  }

  return (
    <>
      <Nav data='home'></Nav>
      <div className="week__container">
        <section className='mon'>
          <IoIosAdd className='fixed__btn'/>
          <p className='day-title'>Mon</p>
          <div className='spacing'><br></br></div>
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
        <section className='tue'>
          <IoIosAdd className='fixed__btn'/>
          <p className='day-title'>Tue</p>
        </section>
        <section className='wed'>
          <IoIosAdd className='fixed__btn'/>
          <p className='day-title'>Wed</p>
        </section>
        <section className='thu'>
          <IoIosAdd className='fixed__btn'/>
          <p className='day-title'>Thu</p>
          <ul>
            <li>Math 1.2-1.3</li>
            <li>English Essay</li>
          </ul>
        </section>
        <section className='fri'>
          <IoIosAdd className='fixed__btn'/>
          <p className='day-title'>Fri</p>
        </section>
        <section className='sat'>
          <IoIosAdd className='fixed__btn'/>
          <p className='day-title'>Sat</p>
        </section>
        <section className='sun'>
          <IoIosAdd className='fixed__btn'/>
          <p className='day-title'>Sun</p>
        </section>
        <section className='notes'>
          <IoIosAdd className='fixed__btn'/>
          <p className='notes-title'>Notes</p>
          <textarea className='notes-input'></textarea>
        </section>
      </div>
    </>
  )
}

export default Home