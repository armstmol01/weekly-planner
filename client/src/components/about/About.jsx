import React from 'react'
import './About.css'
import Nav from '../nav/Nav'
import DEMO from '../../assets/bestdemo1.gif'
import { IoIosAdd } from 'react-icons/io'
import { BsCheck } from 'react-icons/bs'
import { GrGithub } from 'react-icons/gr'

// const style = {display: 'inline'};

const About = () => {
  return (
    <>
      <Nav data='about' className='nav'></Nav>
      <div className="about__container">
        <div className='direction__container'>
          <h3>Enjoy this simple planner <br></br>to help manage your week</h3>
          <div className='icon__container'>
            <IoIosAdd/>
            <p>create task</p></div>
          <div className='icon__container'>
            <BsCheck/>
            <p>save task</p></div>
          <p>click  to check off</p>
          <p>double click to delete</p>
          <a href="https://github.com/armstmol01" target="_blank" rel="noreferrer noopener" className='github-link' >
            <GrGithub/>
            <p>armstmol01</p>
          </a>

        </div>
        <img src={DEMO} alt="demo of the site" className='demo'></img>
      </div>
    </>

  )
}

export default About