import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { getLists } from '../actions/board';
import { addBoard, deleteBoard } from '../actions/boards';
import { ReactComponent as CloseIcon } from './close.svg';
import Loading from './Loading';
import './Home.css';

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      createBoard: false,
      text: ''
    };

    this.renderBoards = this.renderBoards.bind(this);
    this.toggleCreateBoard = this.toggleCreateBoard.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleAddBoard = this.handleAddBoard.bind(this);
    this.handleDeleteBoard = this.handleDeleteBoard.bind(this);
  }

  toggleCreateBoard() {
    this.setState({ createBoard: !this.state.createBoard, text: '' });
  }

  handleInputChange(e) {
    this.setState({ text: e.target.value });
  }

  handleAddBoard() {
    const { text } = this.state;
    const { addBoard } = this.props;

    this.setState({ createBoard: false, text: '' });

    if (text) {
      addBoard(text);
    }
  }

  handleDeleteBoard(e, boardID) {
    e.stopPropagation();
    const { deleteBoard } = this.props;

    deleteBoard(boardID);
  }

  renderCreateBoard() {
    const { createBoard, text } = this.state;

    if (createBoard) {
      return (
        <div className='new-board-form'>
          <div className='new-board-form-inner'>
            <input
              value={text}
              placeholder='Add board title'
              autoFocus='true'
              onChange={this.handleInputChange}
              onKeyDown={this.handleKeyDown}
            ></input>
            <div className='new-board-controls'>
              <input
                onClick={this.handleAddBoard}
                type='submit'
                value='Create Board'
              />
              <CloseIcon className='cancel' onClick={this.toggleCreateBoard} />
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className='new-board-container' onClick={this.toggleCreateBoard}>
          <div className='new-board'>
            {' '}
            <div className='new-board-title'>Create new board</div>
          </div>
        </div>
      );
    }
  }

  renderBoards() {
    const { boards, getLists } = this.props;

    return (
      <div className='home-inner'>
        {boards.boards.map(board => {
          if (!board.archived) {
            return (
              <Link
                to={`/board`}
                className='board-container'
                onClick={() => {
                  getLists(board._id);
                }}
              >
                <div
                  className='board-card'
                  style={{ backgroundColor: board.color }}
                >
                  <div className='board-card-title' key={board._id}>
                    {board.title}
                  </div>
                </div>
              </Link>
            );
          }
        })}

        {this.renderCreateBoard()}
      </div>
    );
  }

  render() {
    const { toggleShowArchivedBoards, boards } = this.props;

    if (boards.loading) {
      return <Loading />;
    } else {
      return (
        <div className='home-container'>
          <div className='home-header'>
            <h1 className='home-title'>Personal Boards</h1>
            <div
              className='archived-boards-action'
              onClick={toggleShowArchivedBoards}
            >
              See archived boards
            </div>
          </div>
          {this.renderBoards()}
        </div>
      );
    }
  }
}

Home.propTypes = {
  boards: PropTypes.object,
  getLists: PropTypes.func.isRequired,
  addBoard: PropTypes.func.isRequired,
  deleteBoard: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  boards: state.boards
});

export default connect(mapStateToProps, {
  getLists,
  addBoard,
  deleteBoard
})(Home);
