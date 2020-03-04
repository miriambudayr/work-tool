import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { login, logout } from '../actions/auth';
import { connect } from 'react-redux';
import './Navbar.css';

class Navbar extends React.Component {
  constructor(props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit() {
    const { isAuthenticated, logout } = this.props;

    if (isAuthenticated) {
      logout();
    }
  }

  render() {
    const { isAuthenticated, user, board } = this.props;

    if (isAuthenticated) {
      return (
        <nav
          className={`navbar ${
            board.loading || board.boardArchived ? null : 'board-page'
          }`}
        >
          <div>
            <Link to='/' className='nav-link'>
              Home
            </Link>
          </div>
          <div>
            {user ? <a className='nav-link'>{user.name}</a> : null}
            <Link
              onClick={e => this.onSubmit(e)}
              className='nav-link'
              to='/login'
            >
              Log Out
            </Link>
          </div>
        </nav>
      );
    } else {
      return (
        <nav className='navbar'>
          <div>
            <Link to='/' className='nav-link'>
              WorkTool
            </Link>
          </div>
          <div>
            <Link to='/register' className='nav-link'>
              Sign Up
            </Link>
            <Link to='/login' className='nav-link'>
              Login
            </Link>
          </div>
        </nav>
      );
    }
  }
}

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
  user: state.auth.user,
  board: state.board
});

Navbar.propTypes = {
  login: PropTypes.func.isRequired,
  logout: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
  user: PropTypes.object,
  board: PropTypes.object
};

export default connect(mapStateToProps, { login, logout })(Navbar);
