import React from 'react'
import './Account.css'
import Nav from '../nav/Nav'
import {BsArrowRightShort, BsCalendar3, BsCalendar4Range} from 'react-icons/bs'

const Account = () => {
  return (
    <div className="account__container">
      <Nav data='account' className='nav'></Nav>
      <form>
          <p>Enter a username and password</p>
          <input name='username' placeholder='username'></input>
          <input type='password' name='passcode' placeholder='password'></input>
          <button type="submit">Create account</button>
      </form>
    </div>
  )
}

export default Account