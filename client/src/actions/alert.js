import uuid from 'uuid';
import { SET_ALERT, REMOVE_ALERT } from './types';

export function setAlert(msg, alertType) {
  return dispatch => {
    const id = uuid.v4();
    dispatch({
      type: SET_ALERT,
      data: { msg, alertType, id }
    });

    setTimeout(
      () =>
        dispatch({
          type: REMOVE_ALERT,
          data: { id }
        }),
      5000
    );
  };
}
