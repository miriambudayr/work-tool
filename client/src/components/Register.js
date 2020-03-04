import React from 'react';
import { connect } from 'react-redux';
import { setAlert } from '../actions/alert';
import { register } from '../actions/auth';
import PropTypes from 'prop-types';
import { Link, Redirect } from 'react-router-dom';
import './Register.css';

class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      email: '',
      password: '',
      confirmationPassword: ''
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  onSubmit(e) {
    const { password, confirmationPassword, name, email } = this.state;
    const { setAlert, register } = this.props;
    e.preventDefault();

    if (password !== confirmationPassword) {
      setAlert('Passwords do not match', 'danger');
    } else {
      register({ name, email, password });
    }
  }

  render() {
    const { name, email, password, confirmationPassword } = this.state;
    const { isAuthenticated } = this.props;

    if (isAuthenticated) {
      return <Redirect to='/' />;
    }

    return (
      <div className='register-container'>
        <h1>Sign Up to WorkTool</h1>
        <div>
          <div>
            <input
              value={name}
              onChange={e => this.onChange(e)}
              type='text'
              placeholder='Name'
              name='name'
              className='name'
              required
            />
          </div>
          <div>
            <input
              type='email'
              placeholder='Email Address'
              name='email'
              className='email'
              required
              value={email}
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
          <div>
            <input
              type='password'
              placeholder='Confirm Password'
              name='confirmationPassword'
              className='password'
              minLength='6'
              value={confirmationPassword}
              onChange={e => this.onChange(e)}
            />
          </div>
          <input
            onClick={e => this.onSubmit(e)}
            type='submit'
            value='Register'
          />
        </div>
        <p>
          Already registered? <Link to='/login'>Sign In</Link>
        </p>
      </div>
    );
  }
}

Register.propTypes = {
  setAlert: PropTypes.func.isRequired,
  register: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool
};

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps, { setAlert, register })(Register);
