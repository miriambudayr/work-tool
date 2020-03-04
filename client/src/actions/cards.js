import axios from 'axios';
import {
  ADD_CARD,
  SHOW_CARD_DETAIL,
  HIDE_CARD_DETAIL,
  DELETE_CARD,
  UPDATE_CARD
} from './types';

export function addCard(title, listID) {
  return async dispatch => {
    const config = {
      headers: {
        'Content-type': 'application/json'
      }
    };

    const body = JSON.stringify({ title });

    try {
      const res = await axios.post(`/api/item/${listID}`, body, config);

      dispatch({
        type: ADD_CARD,
        data: { listID: res.data.list, item: res.data }
      });
    } catch (error) {
      console.log(error.message);
    }
  };
}

export function deleteCard(cardID, listID) {
  return async dispatch => {
    try {
      dispatch({
        type: DELETE_CARD,
        data: { cardID, listID }
      });
      const res = await axios.delete(`/api/item/${cardID}/${listID}`);
    } catch (error) {
      console.log(error.message);
    }
  };
}

export function updateCard(itemID, { title, due, description, archived }) {
  return async dispatch => {
    const config = {
      headers: {
        'Content-type': 'application/json'
      }
    };

    const body = JSON.stringify({ title, due, description, archived });

    try {
      const res = await axios.post(`/api/item/update/${itemID}`, body, config);

      dispatch({
        type: UPDATE_CARD,
        data: { listID: res.data.list, item: res.data }
      });
    } catch (error) {
      console.log(error.message);
    }
  };
}
