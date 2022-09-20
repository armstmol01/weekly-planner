import React, {useState, useRef} from 'react'
import './Account.css'
import Nav from '../nav/Nav'
import { useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios'
import emailjs from 'emailjs-com';
import {HiEmojiSad} from 'react-icons/hi'

const Account = () => {
  // const navigate = useNavigate(); // navigate to login screen after deletion
  const location = useLocation();
  const resp = location.state.userData;
  console.log(resp);
  const [accountStatus, setAccountStatus] = useState('account');

  const form = useRef();

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs.sendForm('service_a4c1ahh', 'template_9ai70jw', form.current, 'PCGoNLqyNBc20wHVA')
      .then((result) => {
          console.log(result.text);
      }, (error) => {
          console.log(error.text);
      });

      e.target.reset();
  };

  const deleteAccount = async () => {
    setAccountStatus("delete");
    console.log(resp.id);
    console.log(resp.username);
    await axios.post('/api/delete-user', {
      id: resp.id,
      username: resp.username // notes.current
    })
    .catch((err) => {console.log(err)});
  }

  return (
    <div className='account__component'>
      <Nav className='nav' data={accountStatus} />
      <div className="account__body">
        <div className="account__container">
          <h2>How goes it <span className='username'>{resp.username}</span>?</h2>
          <div className='manage__container'>
            <h3>Manage account</h3>
            {accountStatus === "account" ? <div className="delete-btn" onClick={deleteAccount}>Delete account</div> :
            <div>
              <p>Account deleted</p>
              <div className='delete__msg'>
                <p className='sorry-msg'>Sorry to see you go</p>
                <HiEmojiSad className='sad-icon'/>
              </div>
            </div>
            }
          </div>
        </div>
        <form  ref={form} onSubmit={sendEmail}>
          <h3>Document an issue</h3>
          <label>Title</label>
          <input type="text" name="name" required></input>
          <label>Bug description</label>
          <textarea name="message"rows='6' cols='20' required/>
          <input type="email" name="email" placeholder='Your email' required />
          <button type="submit">Send</button>
          {/* <input type="submit" value="Send"/> */}
        </form>
      </div>
    </div>
  )
}

export default Account