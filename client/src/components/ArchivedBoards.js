import React from 'react';
import ReactDOM from 'react-dom';
import './ArchivedBoards.css';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { updateBoard, deleteBoard } from '../actions/boards';
import { ReactComponent as ArchiveIcon } from './archive.svg';
import { ReactComponent as ReopenIcon } from './reopen.svg';
import { ReactComponent as DeleteIcon } from './delete.svg';

const modalRoot = document.getElementById('modal-root');

class ArchivedBoards extends React.Component {
  constructor(props) {
    super(props);
    this.getArchivedBoards = this.getArchivedBoards.bind(this);
  }

  getArchivedBoards() {
    const { boards, updateBoard, deleteBoard } = this.props;
    const archivedBoards = [];

    for (var i = 0; i < boards.boards.length; i++) {
      let currentBoard = boards.boards[i];
      if (currentBoard.archived) {
        archivedBoards.push(
          <li className='archived-board' key={currentBoard._id}>
            <div className='archived-board-title'> {currentBoard.title}</div>
            <div className='action-buttons'>
              <button
                className='reopen'
                onClick={() => {
                  updateBoard(
                    currentBoard._id,
                    currentBoard.title,
                    false,
                    currentBoard.color
                  );
                }}
              >
                <ReopenIcon className='reopen-icon' />
                Re-open
              </button>
              <button
                className='delete'
                onClick={() => {
                  deleteBoard(currentBoard._id);
                }}
              >
                <DeleteIcon className='delete-icon' />
                Delete
              </button>
            </div>
          </li>
        );
      }
    }

    if (archivedBoards.length === 0) {
      return null;
    }

    return archivedBoards;
  }

  render() {
    const { toggleShowArchivedBoards } = this.props;
    const archivedBoards = this.getArchivedBoards();

    return ReactDOM.createPortal(
      <div
        className='archived-boards-overlay'
        onClick={e => {
          if (e.target.className === 'archived-boards-overlay') {
            toggleShowArchivedBoards(e);
          }
        }}
      >
        <div className='archived-boards-inner'>
          <div clasName='title-container'>
            <ArchiveIcon className='archive-icon' />
            <h2 className='archived-boards-title'>Archived Boards</h2>
          </div>

          <div className='archived-boards-main'>
            {archivedBoards ? (
              <ul>{archivedBoards}</ul>
            ) : (
              <div className='no-archived-boards'>
                <p>No boards have been archived</p>
              </div>
            )}
          </div>
        </div>
      </div>,
      modalRoot
    );
  }
}

ArchivedBoards.propTypes = {
  updateBoard: PropTypes.func.isRequired,
  deleteBoard: PropTypes.func.isRequired,
  boards: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  boards: state.boards
});

export default connect(mapStateToProps, { updateBoard, deleteBoard })(
  ArchivedBoards
);
