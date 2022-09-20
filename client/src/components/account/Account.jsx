import React, {useState} from 'react'
import './Account.css'
import Nav from '../nav/Nav'
import { useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios'

const Account = () => {
  // const navigate = useNavigate(); // navigate to login screen after deletion
  const location = useLocation();
  const resp = location.state.userData;
  console.log(resp);
  const [accountStatus, setAccountStatus] = useState('account');

  return (
    <div className='account__component'>
      <Nav className='nav' data={accountStatus} />
      <div className="account__body">
        <div className="account__container">
          <h2>How goes it <span className='username'>{resp.username}</span>?</h2>
          <div className='manage__container'>
            <h3>Manage Account</h3>
            <div className="delete-btn">delete account</div>
          </div>
        </div>
        <form action='mailto:mamolly01@gmail.com'
          method='POST'
          enctype='text/plain'
          name='EmailForm'>
          <h3>Document an issue</h3>
          <label for="name">Title</label>
          <input type="text" name="name"></input>
          <label for="ContactComment">Bug description</label>
          <textarea id='ContactComment' rows='6' cols='20'/>
          <button type="submit">Send</button>
          {/* <input type="submit" value="Send"/> */}
        </form>
      </div>
    </div>
  )
}

export default Account