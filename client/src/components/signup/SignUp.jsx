import React from 'react'
import './SignUp.css'
import { useState } from 'react';
import Nav from '../nav/Nav'

const SignUp = () => {
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const axios = require('axios');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMsg("");
    let user = event.target.username.value.toLowerCase();
    let pword = event.target.password.value;

    // create new user account
    await axios.post('/api/new-user', {
      username: user,
      password: pword
    })
    .then(handleNewUser) // go back to login
    .catch(handleError);
  };

  const handleNewUser = (res) => {
    // console.log(res);
    setErrorMsg('');
    setSuccessMsg('Created new user! Please return to login');
    // setTimeout(() => {navigate(-1)}, 2000); // return to the previous page (login)
  }

  const handleError = (error) => {
    // console.log(error);
    setErrorMsg(error.response.data);
  }

  return (
    <div className="signup__container">
      <Nav data='signup' className='nav'></Nav>
      <form onSubmit={event => handleSubmit(event)}>
          <p>Enter a username and password</p>
          <input name='username' placeholder='username' type='text' required></input>
          <input name='password' placeholder='password' type='text' required></input>
          <button type="submit">Create account</button>
          {errorMsg === '' ? <p className='success__msg'>{successMsg}</p>:<p className='error__msg'>{errorMsg}</p>}
      </form>
    </div>
  )
}

export default SignUp