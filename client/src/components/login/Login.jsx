import React from 'react'
import './Login.css'
import { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import {BsArrowRightShort} from 'react-icons/bs'

const Login = () => {
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    // console.log(event.target.username.value);
    // console.log(event.target.password.value);
    setErrorMsg("");

    // request user data
    let url = '/api/login?username=' + event.target.username.value.toLowerCase()
              + '&password=' + event.target.password.value;
    fetch(url)
      .then(checkStatus)
      .then(res => res.json())
      .then(handleLogin)
      .catch(handleError)
  };

  const handleLogin = (resp) => {
    setErrorMsg("");
    // console.log(resp);
    navigate('home', {replace: false, state: {resp}});
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
    <div className='login__component'>
      {/* <div className='logo__container'>
        <h1>WerkWeek</h1>
        <h1>WerkWeek</h1>
        <h1>WerkWeek</h1>
        <h1>WerkWeek</h1>
      </div> */}
      <div className='login__container'>
        <h2 className='title'>get to werk!</h2>
        <p className='error__msg'>{errorMsg}</p>
        <form onSubmit={event => handleSubmit(event)}>
          <div>
            <input name='username' placeholder='username' className='username-input' required></input>
          </div>
          <div className='password__box'>
            <input type='password' name='password' placeholder='password' required></input>
            <button type="submit"><BsArrowRightShort className='btn__arrow'/></button>
          </div>
          <p>Don't have an account? </p>
          <Link to='/account' className='account-link'>Sign up</Link>
        </form>
        {/* <BsCalendar4Range className='calendar__icon'/> */}
      </div>
    </div>
  )
}

export default Login