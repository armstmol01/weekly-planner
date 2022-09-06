import React from 'react'
import './About.css'
import Nav from '../nav/Nav'

const About = () => {
  return (
    <div className="about__container">
      <Nav data='about' className='nav'></Nav>
    </div>
  )
}

export default About