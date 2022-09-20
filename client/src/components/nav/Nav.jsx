import React from 'react'
import { Link } from "react-router-dom";
import './Nav.css'
import {IoMdArrowRoundBack} from 'react-icons/io'
import {FiSettings} from 'react-icons/fi'
import {RiSettings4Fill} from 'react-icons/ri'
import {MdManageAccounts} from 'react-icons/md'



const Nav = (props) => {
  const activeNav = props.data;
  // const homeProps = props.data.homeProps;
  // console.log(props.data.active);
  // console.log(props.data.homeProps);
  // React.Element()

  // set as 'active' or ''
  return (
    <nav>
      {/* <Link to='/' id={activeNav === 'home' ? 'name' : ''} className={activeNav === 'home' ? 'home link' : 'link'}>{activeNav==='home'?'Molly\'s':<IoMdArrowRoundBack className='back-arrow-icon'/>}</Link> */}
      {activeNav === 'login' ? <Link to='/' id='name' className='link'>{'WerkWeek'}</Link> : <Link to='/' className='link'><IoMdArrowRoundBack className='back-arrow-icon'/></Link>}
      {activeNav !== 'signup' && activeNav !== 'home' && activeNav !== 'account' ? <Link to='/about' className={activeNav === 'about'? 'about link' : 'link'}>about</Link> : ''}
    </nav>
  )
}

export default Nav