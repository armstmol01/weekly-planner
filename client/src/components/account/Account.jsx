import React from 'react'
import './Account.css'
import Nav from '../nav/Nav'
import { useLocation, useNavigate } from 'react-router-dom'

const Account = () => {
  const location = useLocation();
  const userData = location.state.userData;
  console.log(userData);
  console.log(location.state);

  return (
    <div>
      <Nav data='account'></Nav>
    </div>
  )
}

export default Account