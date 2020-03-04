import axios from 'axios';
import {
  SET_LISTS,
  REORDER_CARD,
  ADD_LIST,
  DELETE_LIST,
  CLEAR_LISTS,
  UPDATE_LIST
} from './types';

export function getLists(boardID) {
  return async dispatch => {
    try {
      const res = await axios.get(`/api/board?board_id=${boardID}`);

      dispatch({
        type: SET_LISTS,
        data: {
          lists: res.data.lists,
          boardTitle: res.data.title,
          boardID,
          boardArchived: res.data.archived,
          boardColor: res.data.color,
          boardMembers: res.data.members
        }
      });
    } catch (error) {
      console.log(error.message);
    }
  };
}

export function addList(title, boardID) {
  return async dispatch => {
    const config = {
      headers: {
        'Content-type': 'application/json'
      }
    };

    const body = JSON.stringify({ title });

    try {
      const res = await axios.post(`/api/list/${boardID}`, body, config);

      dispatch({
        type: ADD_LIST,
        data: { list: res.data }
      });
    } catch (error) {
      console.log(error.message);
    }
  };
}

export function updateList(listID, title, archived) {
  return async dispatch => {
    const config = {
      headers: {
        'Content-type': 'application/json'
      }
    };

    const body = JSON.stringify({ title, archived });

    try {
      const res = await axios.post(`/api/list/update/${listID}`, body, config);

      dispatch({
        type: UPDATE_LIST,
        data: { list: res.data }
      });
    } catch (error) {
      console.log(error.message);
    }
  };
}

export function deleteList(listID) {
  return async dispatch => {
    try {
      const res = await axios.delete(`/api/list/${listID}`);

      dispatch({
        type: DELETE_LIST,
        data: { listID }
      });
    } catch (error) {
      console.log(error.message);
    }
  };
}

export function reorderCard(
  startDroppableId,
  endDroppableId,
  startDroppableIndex,
  endDroppableIndex,
  draggableId
) {
  return async dispatch => {
    try {
      dispatch({
        type: REORDER_CARD,
        startDroppableId,
        endDroppableId,
        startDroppableIndex,
        endDroppableIndex
      });

      await axios.put(
        `/api/item/${startDroppableId}/${draggableId}/${endDroppableId}/${endDroppableIndex}`
      );
    } catch (error) {
      console.log(error.message);
    }
  };
}

export function clearLists() {
  return async dispatch => {
    dispatch({
      type: CLEAR_LISTS
    });
  };
}
