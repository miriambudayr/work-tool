import React from 'react';
import { Link } from 'react-router-dom';
import './Landing.css';

const Landing = () => {
  return (
    <div className='landing'>
      <div className='landing-inner'>
        <h1>Welcome to WorkTool!</h1>
        <p>This Trello-style productivity app helps you get more done!</p>
        <div className='buttons'>
          <Link to='/login' className='btn-login'>
            Login
          </Link>
          <Link to='/register' className='btn-signup'>
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Landing;
