import React, { Fragment } from 'react';
import MemberProfile from './MemberProfile';
import Invite from './Invite';

export default class Members extends React.Component {
  constructor(props) {
    super(props);
  }

  renderMembers() {
    const { board, toggleShowMemberProfile } = this.props;
    const membersArray = [];

    for (var i = 0; i < board.boardMembers.length; i++) {
      let member = board.boardMembers[i];
      let { name } = member;
      membersArray.push(
        <div
          className='user-icon'
          onClick={() => toggleShowMemberProfile(member)}
        >
          <span className='user-icon-text'>{name[0]}</span>
        </div>
      );
    }

    if (membersArray.length === 0) {
      return (
        <div className='no-members-found'>
          No members were found for this board.
        </div>
      );
    } else {
      return <div className='members-scrollable'>{membersArray}</div>;
    }
  }

  render() {
    const {
      showMemberProfile,
      toggleShowInvitePopup,
      toggleShowMemberProfile,
      displayedMember,
      board,
      showInvitePopup
    } = this.props;

    return (
      <Fragment>
        <div className='menu-members-title'>Members</div>
        <div className='invite-user' onClick={toggleShowInvitePopup}>
          <span className='invite-user-text'>Invite</span>
        </div>
        <div className='members-list'>
          {showMemberProfile ? (
            <MemberProfile
              className='member-profile'
              member={displayedMember}
              closeMemberProfilePopup={toggleShowMemberProfile}
              boardID={board.boardID}
            />
          ) : null}
          {showInvitePopup ? (
            <Invite closeInvitePopup={toggleShowInvitePopup} board={board} />
          ) : null}
          {this.renderMembers()}
        </div>
      </Fragment>
    );
  }
}
