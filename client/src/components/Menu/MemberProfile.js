import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { removeBoardMember } from '../../actions/boards';
import { ReactComponent as CloseIcon } from '../close.svg';
import { searchUser } from '../../utils';

import './MemberProfile.css';

const memberProfileRoot = document.getElementById('modal-root');

class MemberProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: '',
      users: []
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSearchUsers = this.handleSearchUsers.bind(this);
  }

  handleInputChange(e) {
    this.setState({ text: e.target.value });
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
    const {
      closeMemberProfilePopup,
      member,
      removeBoardMember,
      boardID
    } = this.props;
    return ReactDOM.createPortal(
      <div
        className='member-profile-popup-container'
        onClick={e => {
          if (e.target.className === 'member-profile-popup-container') {
            closeMemberProfilePopup();
          }
        }}
      >
        <div className='member-profile'>
          <div className='member-profile-title'>
            <div className='user-icon'>
              <span className='user-icon-text'> {member.name[0]}</span>
            </div>
            <div className='member-name'>{member.name}</div>
            <div className='member-profile-email'>{member.email}</div>
            <CloseIcon
              className='close-member-profile-popup'
              onClick={e => {
                closeMemberProfilePopup();
              }}
            />
          </div>
          <div className='member-profile-inner'>
            <div
              className='remove-member'
              onClick={() => {
                removeBoardMember(boardID, member._id);
                closeMemberProfilePopup();
              }}
            >
              Remove Member
            </div>
          </div>
        </div>
      </div>,
      memberProfileRoot
    );
  }
}

export default connect(null, {
  removeBoardMember
})(MemberProfile);
