import axios from 'axios';
import { SET_BOARDS, ADD_BOARD, DELETE_BOARD, UPDATE_BOARD } from './types';

export function getBoards() {
  return async dispatch => {
    try {
      const res = await axios.get('/api/board/all');
      dispatch({ type: SET_BOARDS, data: res.data });
    } catch (error) {
      console.log(error.message);
    }
  };
}

export function addBoard(title) {
  return async dispatch => {
    const config = {
      headers: {
        'Content-type': 'application/json'
      }
    };

    const body = JSON.stringify({ title });

    try {
      const res = await axios.post(`/api/board`, body, config);

      dispatch({
        type: ADD_BOARD,
        data: { board: res.data }
      });
    } catch (error) {
      console.log(error.message);
    }
  };
}

export function deleteBoard(boardID) {
  return async dispatch => {
    try {
      dispatch({
        type: DELETE_BOARD,
        data: { boardID }
      });
      const res = await axios.delete(`/api/board/${boardID}`);
    } catch (error) {
      console.log(error.message);
    }
  };
}

export function updateBoard(boardID, title, archived, color) {
  return async dispatch => {
    const config = {
      headers: {
        'Content-type': 'application/json'
      }
    };

    const bodyObj = { title, archived, color };

    const body = JSON.stringify(bodyObj);

    try {
      const res = await axios.post(`/api/board/${boardID}`, body, config);

      dispatch({
        type: UPDATE_BOARD,
        data: {
          board: res.data
        }
      });
    } catch (error) {
      console.log(error.message);
    }
  };
}

export function addBoardMember(boardID, memberEmail) {
  return async dispatch => {
    try {
      const res = await axios.post(
        `/api/board/member/${boardID}/${memberEmail}`
      );

      dispatch({
        type: UPDATE_BOARD,
        data: {
          board: res.data
        }
      });
    } catch (error) {
      console.log(error.message);
    }
  };
}

export function removeBoardMember(boardID, memberID) {
  return async dispatch => {
    try {
      const res = await axios.delete(
        `/api/board/member/${boardID}/${memberID}`
      );

      dispatch({
        type: UPDATE_BOARD,
        data: {
          board: res.data
        }
      });
    } catch (error) {
      console.log(error.message);
    }
  };
}
