import React from 'react';
import { Link } from 'react-router-dom';

const BoardArchived = props => {
  const { board, updateBoard, deleteBoard } = props;

  return (
    <div className='board-archived'>
      <h1>{`${board.boardTitle} is archived`}</h1>
      <p
        onClick={() => {
          updateBoard(board.boardID, board.boardTitle, false, board.boardColor);
        }}
      >
        Re-open
      </p>
      <Link
        onClick={() => {
          deleteBoard(board.boardID);
        }}
        className='delete-board'
        to='/board-deleted'
      >
        Permanently Delete Board...
      </Link>
    </div>
  );
};

export default BoardArchived;
