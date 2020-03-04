import {
  SET_BOARDS,
  ADD_BOARD,
  DELETE_BOARD,
  UPDATE_BOARD
} from '../actions/types';

const initialState = { loading: true, boards: [] };

function boards(state = initialState, action) {
  const { type, data } = action;

  switch (type) {
    case SET_BOARDS:
      return { loading: false, boards: [...data] };
    case ADD_BOARD:
      const { board } = data;
      return { ...state, boards: [...state.boards, board] };
    case DELETE_BOARD:
      const { boardID } = data;
      const boardIndex = state.boards.findIndex(board => boardID === board._id);
      const newState = { ...state };
      newState.boards.splice(boardIndex, 1);
      return newState;
    case UPDATE_BOARD:
      return updateBoard(state, action);
    default:
      return state;
  }
}

function updateBoard(state, action) {
  const { _id } = action.data.board;
  const boardIndex = state.boards.findIndex(board => _id === board._id);
  const newState = { ...state };
  newState.boards[boardIndex] = action.data.board;

  return newState;
}

export default boards;
