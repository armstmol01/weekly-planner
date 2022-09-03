import React from 'react'
import './Home.css'
import Nav from '../nav/Nav'
import { useState } from 'react'

const Home = (props) => {
  const userData = this.props.data;

  return (
    <>
      <Nav data='home'></Nav>
      <div className="week__container">
        <section className='mon'>
          <ul>
            <li>Math 1.2-1.3</li>
            <li>English Essay</li>
          </ul>
        </section>
        <section className='tue'></section>
        <section className='wed'></section>
        <section className='thu'>
          <ul>
            <li>Math 1.2-1.3</li>
            <li>English Essay</li>
          </ul>
        </section>
        <section className='fri'></section>
        <section className='sat'></section>
        <section className='sun'></section>
      </div>
    </>
  )
}

export default Home