import React from 'react'
import './Account.css'
import { useState } from 'react';
import {useNavigate } from "react-router-dom"
import Nav from '../nav/Nav'
import {BsArrowRightShort, BsCalendar3, BsCalendar4Range} from 'react-icons/bs'

const Account = () => {
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const axios = require('axios');

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log("new user");
    console.log(event.target.username.value);
    console.log(event.target.password.value);
    setErrorMsg("");
    let user = event.target.username.value;
    let pword = event.target.password.value;

    // create new user account
    axios.post('/api/new-user', {
      'username': user,
      'password': pword
    })
    .then(checkStatus)
    .then(handleNewUser) // go back to login
    .catch(handleError);
  };

  const handleNewUser = (resp) => {
    setErrorMsg("");
    console.log(resp);
    navigate('login', {replace: false});
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
    <div className="account__container">
      <Nav data='account' className='nav'></Nav>
      <form onSubmit={event => handleSubmit(event)}>
          <p>Enter a username and password</p>
          <input name='username' placeholder='username'></input>
          <input name='password' placeholder='password'></input>
          <button type="submit">Create account</button>
          <p className='error__msg'>{errorMsg}</p>
      </form>
    </div>
  )
}

export default Account