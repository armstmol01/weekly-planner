import React from 'react'
import './Account.css'
import Nav from '../nav/Nav'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import {IoMdArrowRoundBack } from 'react-icons/io'

const Account = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const resp = location.state.userData;
  console.log(resp);
  console.log(location.state);

  return (
    <div>
      <nav>
        <div className='link'>
          <IoMdArrowRoundBack className='back-arrow-icon' onClick={() => {navigate('/home', {state: {resp}})}}/>
        </div>
      </nav>
    </div>
  )
}

export default Account