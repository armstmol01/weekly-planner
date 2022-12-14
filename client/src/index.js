import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './index.css';
import App from './App';
import About from './components/about/About';
import Account from './components/account/Account';
import Home from './components/home/Home';
import reportWebVitals from './reportWebVitals';
import SignUp from './components/signup/SignUp';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path='' element={<App />} />
        <Route path='about' element={<About />} />
        <Route path='home' element={<Home />} />
        <Route path='sign-up' element={<SignUp />} />
        <Route path='account' element={<Account />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
