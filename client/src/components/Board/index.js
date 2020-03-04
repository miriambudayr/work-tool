import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import List from '../List';
import BoardDeleted from './BoardDeleted';
import BoardArchived from './BoardArchived';
import { connect } from 'react-redux';
import { DragDropContext } from 'react-beautiful-dnd';
import { reorderCard, clearLists } from '../../actions/board';
import { updateBoard, deleteBoard } from '../../actions/boards';
import AddButton from '../AddButton';
import Loading from '../Loading';
import Menu from '../Menu';
import './Board.css';

class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showInvitePopup: false,
      editing: false,
      text: ''
    };
    this.handleDrag = this.handleDrag.bind(this);
    this.toggleEditing = this.toggleEditing.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  componentWillUnmount() {
    const { clearLists } = this.props;
    clearLists();
  }

  toggleEditing() {
    this.setState({
      editing: !this.state.editing,
      text: this.props.board.boardTitle
    });
  }

  handleInputChange(e) {
    this.setState({ text: e.target.value });
  }

  handleKeyDown(e) {
    if (e.keyCode === 13) {
      const { updateBoard, board } = this.props;
      const { text } = this.state;
      updateBoard(board.boardID, text, false, board.boardColor);
      this.setState({ editing: false });
    }
    if (e.keyCode === 27) {
      this.setState({ editing: false, text: this.props.title });
    }
  }

  handleDrag(result) {
    const { destination, source, draggableId, type, droppableId } = result;

    const { reorderCard } = this.props;

    if (!destination) {
      return;
    }

    reorderCard(
      source.droppableId,
      destination.droppableId,
      source.index,
      destination.index,
      draggableId
    );
  }

  renderBoardPage() {
    const { board } = this.props;
    const { editing, text } = this.state;

    return (
      <div className='board-page-container'>
        <div className='board-header'>
          <div className='board-title-container'>
            {editing ? (
              <input
                className='board-edit-input'
                value={text}
                onChange={this.handleInputChange}
                onKeyDown={this.handleKeyDown}
                autoFocus='true'
              ></input>
            ) : (
              <div className='board-title' onClick={this.toggleEditing}>
                {board.boardTitle}
              </div>
            )}
          </div>
          <Menu />
        </div>
        <div className='lists-container'>
          <div className='lists-inner'>
            <DragDropContext onDragEnd={this.handleDrag}>
              {board.listsArray.map(list => {
                if (!list.archived) {
                  return (
                    <List
                      key={list._id}
                      listID={list._id}
                      listArchived={list.archived}
                      title={list.title}
                      cards={list.itemsArray}
                    />
                  );
                } else {
                  return null;
                }
              })}

              <AddButton list type={'list'} boardID={board.boardID} />
            </DragDropContext>
          </div>
        </div>
      </div>
    );
  }

  render() {
    const { board, updateBoard, deleteBoard } = this.props;

    if (board.loading) {
      return <Loading />;
    } else {
      if (board.boardID === null) {
        return <BoardDeleted />;
      }

      if (board.boardArchived) {
        return (
          <BoardArchived
            board={board}
            updateBoard={updateBoard}
            deleteBoard={deleteBoard}
          />
        );
      }

      return <Fragment>{this.renderBoardPage()}</Fragment>;
    }
  }
}

Board.propTypes = {
  board: PropTypes.array,
  clearLists: PropTypes.func.isRequired,
  updateBoard: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  board: state.board
});

export default connect(mapStateToProps, {
  reorderCard,
  clearLists,
  updateBoard,
  deleteBoard
})(Board);
