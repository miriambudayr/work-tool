import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { addBoardMember } from '../../actions/boards';
import { ReactComponent as CloseIcon } from '../close.svg';
import { searchUser } from '../../utils';

import './Invite.css';

const inviteRoot = document.getElementById('modal-root');

class Invite extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: '',
      users: []
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSearchUsers = this.handleSearchUsers.bind(this);
    this.handleAddBoardMember = this.handleAddBoardMember.bind(this);
  }

  handleInputChange(e) {
    this.setState({ text: e.target.value });
  }

  handleAddBoardMember(memberEmail) {
    const { board, addBoardMember } = this.props;
    addBoardMember(board.boardID, memberEmail);
  }

  renderUsers() {
    const { users } = this.state;

    if (users.length) {
      const usersArray = [];
      for (var i = 0; i < users.length; i++) {
        let user = users[i];
        usersArray.push(
          <div className='user-container'>
            <div className='user-inner'>
              <div className='user-info'>
                <div className='user-icon'>
                  <span className='user-icon-text'>{users[i].name[0]}</span>
                </div>
                <div className='user-name'>{users[i].name}</div>
                <div className='email'>{users[i].email}</div>
              </div>
              <div
                className='invite-user-button'
                onClick={() => {
                  this.handleAddBoardMember(user.email);
                }}
              >
                <span className='invite-user-text'>Invite</span>
              </div>
            </div>
          </div>
        );
      }

      return usersArray;
    } else {
      return (
        <div className='user-container'>
          <div className='no-users-found'>No users found</div>
        </div>
      );
    }
  }

  async handleSearchUsers(e) {
    const users = await searchUser(this.state.text);

    if (users) {
      this.setState({ users: users.data });
    } else {
      this.setState({ users: [] });
    }
  }

  render() {
    const { closeInvitePopup } = this.props;
    return ReactDOM.createPortal(
      <div
        className='invite-popup-container'
        onClick={e => {
          if (e.target.className === 'invite-popup-container') {
            closeInvitePopup();
          }
        }}
      >
        <div className='invite-member'>
          <div className='invite-member-title'>
            <span>Invite To Board</span>
            <CloseIcon
              className='close-invite-popup'
              onClick={e => {
                closeInvitePopup();
              }}
            />
          </div>
          <div className='invite-member-inner'>
            <div className='member-search-container'>
              <input
                className='member-search'
                type='text'
                placeholder='Email address or name'
                autoFocus='true'
                onChange={this.handleInputChange}
                onKeyDown={e => {
                  if (e.keyCode === 13) {
                    this.handleSearchUsers(e);
                  }
                }}
              ></input>
              <div
                onClick={e => {
                  this.handleSearchUsers(e);
                }}
                className='member-search-button'
              >
                Search
              </div>
            </div>
            <div className='users-scrollable'> {this.renderUsers()}</div>
          </div>
        </div>
      </div>,
      inviteRoot
    );
  }
}

export default connect(null, {
  addBoardMember
})(Invite);
