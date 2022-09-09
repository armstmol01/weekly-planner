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
    await axios.post('/api/new-user', {
      username: user,
      password: pword
    })
    .then(checkStatus)
    .then(handleNewUser) // go back to login
    .catch(handleError);
  };

  const handleNewUser = (res) => {
    setErrorMsg("");
    console.log(res);
    navigate(-1); // return to the previous page (login)
  }

  const checkStatus = async (res) => {
    if (res.status !== 200) {
      console.log(res.status);
      let message = res.data;
      console.log(message);
      throw new Error(message);
    }
    return res;
  }

  const handleError = (error) => {
    console.log(error);
    setErrorMsg(error.data);
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