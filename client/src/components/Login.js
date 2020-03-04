import React, { Fragment } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { setAlert } from '../actions/alert';
import { login } from '../actions/auth';
import './Login.css';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: ''
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  onSubmit(e) {
    const { login } = this.props;
    const { email, password } = this.state;

    e.preventDefault();
    login({ email, password });
  }

  render() {
    const { email, password } = this.state;
    const { isAuthenticated } = this.props;

    if (isAuthenticated) {
      return <Redirect to='/' />;
    }

    return (
      <div className='login-container'>
        <h1>Log in to WorkTool</h1>
        <div>
          <div>
            <input
              type='email'
              placeholder='Email Address'
              name='email'
              required
              value={email}
              className='email'
              onChange={e => this.onChange(e)}
            />
          </div>
          <div>
            <input
              type='password'
              placeholder='Password'
              name='password'
              className='password'
              minLength='6'
              required
              value={password}
              onChange={e => this.onChange(e)}
            />
          </div>
          <input onClick={e => this.onSubmit(e)} type='submit' value='Log In' />
        </div>
        <p>
          Don't have an account? <Link to='/register'>Sign up</Link>
        </p>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated
});

Login.propTypes = {
  setAlert: PropTypes.func.isRequired,
  login: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool
};

export default connect(mapStateToProps, { setAlert, login })(Login);
