import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { updateBoard } from '../../actions/boards';
import { updateList } from '../../actions/board';
import { updateCard, deleteCard } from '../../actions/cards';
import BackgroundColor from './BackgroundColor';
import ArchivedItems from './ArchivedItems';
import ArchivedLists from './ArchivedLists';
import Members from './Members';
import { ReactComponent as CloseIcon } from '../close.svg';
import { ReactComponent as ArchiveIcon } from '../archive.svg';
import { ReactComponent as LeftArrowIcon } from '../left-arrow.svg';

import './Menu.css';

class Menu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      view: 'main',
      showInvitePopup: false,
      showMemberProfile: false,
      displayedMember: {}
    };

    this.changeView = this.changeView.bind(this);
    this.toggleShowInvitePopup = this.toggleShowInvitePopup.bind(this);
    this.toggleShowMemberProfile = this.toggleShowMemberProfile.bind(this);
  }

  toggleShowMemberProfile(member) {
    if (member) {
      this.setState({ showMemberProfile: true, displayedMember: member });
    } else {
      this.setState({ showMemberProfile: false, member: {} });
    }
  }

  toggleShowInvitePopup() {
    const { showInvitePopup } = this.state;
    this.setState({ showInvitePopup: !showInvitePopup });
  }

  changeView(view) {
    this.setState({ view });
  }

  renderMainMenu() {
    const { showInvitePopup, showMemberProfile, displayedMember } = this.state;
    const { board, updateBoard } = this.props;

    return (
      <Fragment>
        <div className='menu-members'>
          <Members
            board={board}
            toggleShowInvitePopup={this.toggleShowInvitePopup}
            toggleShowMemberProfile={this.toggleShowMemberProfile}
            showMemberProfile={showMemberProfile}
            displayedMember={displayedMember}
            showInvitePopup={showInvitePopup}
          />
        </div>
        <div className='menu-background'>
          <BackgroundColor board={board} updateBoard={updateBoard} />
        </div>
        <div className='menu-archives'>
          <h4 className='menu-archives-title'>Archives</h4>
          <ul className='archive-options'>
            <li
              className='see-archived-items'
              onClick={() => this.changeView('items')}
            >
              See Archived Items
            </li>
            <li
              className='see-archived-lists'
              onClick={() => this.changeView('lists')}
            >
              See Archived Lists
            </li>
            <li
              className='archive-board-button'
              onClick={() => {
                updateBoard(
                  board.boardID,
                  board.boardTitle,
                  true,
                  board.boardColor
                );
              }}
            >
              Archive Board <ArchiveIcon className='archive-board-icon' />{' '}
            </li>
          </ul>
        </div>
      </Fragment>
    );
  }

  render() {
    const { view } = this.state;
    const { board, updateCard, deleteCard, updateList } = this.props;
    let headerText;
    let menuBody;
    let returnButton = (
      <LeftArrowIcon
        className='menu-return-icon'
        onClick={() => this.changeView('main')}
      />
    );

    if (view === 'none') {
      return (
        <div className='show-menu' onClick={() => this.changeView('main')}>
          Show Menu
        </div>
      );
    }

    if (view === 'items') {
      headerText = 'Archived Items';
      menuBody = (
        <ArchivedItems
          board={board}
          updateCard={updateCard}
          deleteCard={deleteCard}
        />
      );
    } else if (view === 'lists') {
      headerText = 'Archived Lists';
      menuBody = <ArchivedLists board={board} updateList={updateList} />;
    } else {
      headerText = 'Menu';
      menuBody = this.renderMainMenu();
      returnButton = null;
    }

    return (
      <div className='menu'>
        <div className='menu-header'>
          <div className='menu-header-inner'>
            {returnButton}
            {headerText}
            <CloseIcon
              className='menu-close-icon'
              onClick={() => this.changeView('none')}
            />
          </div>
          <hr className='menu-divider'></hr>
        </div>
        <div className='menu-scrollable'>{menuBody}</div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  board: state.board
});

Menu.propTypes = {
  updateBoard: PropTypes.func.isRequired,
  updateList: PropTypes.func.isRequired,
  updateCard: PropTypes.func.isRequired,
  deleteCard: PropTypes.func.isRequired
};

export default connect(mapStateToProps, {
  updateBoard,
  updateList,
  updateCard,
  deleteCard
})(Menu);
