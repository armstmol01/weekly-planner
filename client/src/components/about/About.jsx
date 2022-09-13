import React from 'react'
import './About.css'
import Nav from '../nav/Nav'

const About = () => {
  return (
    <div className="about__container">
      <Nav data='about' className='nav'></Nav>
      <div>
        <p>Enjoy this weekly planner to help your organize your week!</p>
        <p>How to use:</p>
        <ul>
          <li>click the + icon to create a task</li>
          <li>click the check icon to save task</li>
          <li>click on task to cross it out/check it off once completed</li>
          <li>double click task to delete it</li>
        </ul>
      </div>
    </div>
  )
}

export default About