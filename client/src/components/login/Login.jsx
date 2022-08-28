import React from 'react'
import './Login.css'
import {BsArrowRightShort} from 'react-icons/bs'

const Login = () => {
  return (
    <div className='login__component'>
      <div className='logo__container'>
        <h1>WerkWeek</h1>
        <h1>WerkWeek</h1>
        <h1>WerkWeek</h1>
        <h1>WerkWeek</h1>
      </div>
      <div className='login__container'>
        <h2>get to werk!</h2>
        <form>
          <div>
            <input name='username' placeholder='username'></input>
            <button type="submit"><BsArrowRightShort className='btn__arrow'/></button>
          </div>
          <div>
            <input type='password' name='passcode' placeholder='passcode'></input>
            <button type="submit"><BsArrowRightShort className='btn__arrow'/></button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Login