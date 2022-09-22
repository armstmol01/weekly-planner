import React from 'react'
import { Link, useNavigate } from "react-router-dom";
import './Nav.css'
import {IoMdArrowRoundBack} from 'react-icons/io'
import {FiSettings} from 'react-icons/fi'
import {RiSettings4Fill} from 'react-icons/ri'
import {MdManageAccounts} from 'react-icons/md'



const Nav = (props) => {
  const activeNav = props.data;
  const backDest = () => {
    if (props.data === 'delete') {
      return '/'; // if account exists go back to week
    } else {
      return -1; // if account is deleted, go back to login
    }
  }
  const navigate = useNavigate();

  // set as 'active' or ''
  return (
    <nav>
      {/* <Link to='/' id={activeNav === 'home' ? 'name' : ''} className={activeNav === 'home' ? 'home link' : 'link'}>{activeNav==='home'?'Molly\'s':<IoMdArrowRoundBack className='back-arrow-icon'/>}</Link> */}
      {activeNav === 'login' ? <Link to='/' id='name' className='link'>{'werkweek'}</Link> : <div className='link'><IoMdArrowRoundBack className='back-arrow-icon' onClick={() => {navigate(backDest())}}/></div>}
      {activeNav === 'login' || activeNav === 'about' ? <Link to='/about' className={activeNav === 'about'? 'about link' : 'link'}>about</Link> : ''}
    </nav>
  )
}

export default Nav