import React from 'react'
import './Login.css'
import { Link } from "react-router-dom";
import {BsArrowRightShort, BsCalendar3, BsCalendar4Range} from 'react-icons/bs'
import {AiOutlineCalendar} from 'react-icons/ai'

const Login = () => {
  return (
    <div className='login__component'>
      {/* <div className='logo__container'>
        <h1>WerkWeek</h1>
        <h1>WerkWeek</h1>
        <h1>WerkWeek</h1>
        <h1>WerkWeek</h1>
      </div> */}
      <div className='login__container'>
        <h2>get to werk!</h2>
        <form>
          <div>
            <input name='username' placeholder='username'></input>
            <button type="submit"><BsArrowRightShort className='btn__arrow'/></button>
          </div>
          <div>
            <input type='password' name='passcode' placeholder='password'></input>
            <button type="submit"><BsArrowRightShort className='btn__arrow'/></button>
          </div>
          <p>Don't have an account? </p>
          <Link to='/account' className='account-link'>Sign up</Link>
        </form>
        <BsCalendar4Range className='calendar__icon'/>
      </div>
    </div>
  )
}

export default Login