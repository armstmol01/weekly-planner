import React from 'react'
import './Account.css'
import Nav from '../nav/Nav'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import {IoMdArrowRoundBack } from 'react-icons/io'

const Account = () => {
  const navigate = useNavigate(); // navigate to login screen after deletion
  const location = useLocation();
  const resp = location.state.userData;
  console.log(resp);
  console.log(location.state);

  return (
    <div>
      <Nav data='account' />
    </div>
  )
}

export default Account