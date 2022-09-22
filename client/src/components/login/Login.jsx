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
    let url = '/api/login?username=' + encodeURIComponent(event.target.username.value.toLowerCase())
              + '&password=' + encodeURIComponent(event.target.password.value);
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
      <div className='login__container'>
        <h2 className='title'>ok wrrrk...</h2>
        <p className='error__msg'>{errorMsg}</p>
        <form onSubmit={event => handleSubmit(event)}>
          <div className='input__container'>
            <div>
              <input type='text' name='username' placeholder='username' className='username-input' autocorrect='off' autocapitalize='none' required></input>
            </div>
            <div className='password__box'>
              <input type='password' name='password' placeholder='password' autocorrect='off' autocapitalize='none' required></input>
              <button type="submit"><BsArrowRightShort className='btn__arrow'/></button>
            </div>
          </div>
          <p>Don't have an account? </p>
          <Link to='/sign-up' className='signup-link'>Sign up</Link>
        </form>
      </div>
    </div>
  )
}

export default Login