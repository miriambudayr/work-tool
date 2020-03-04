import { combineReducers } from 'redux';
import alert from './alert';
import auth from './auth';
import boards from './boards';
import board from './board';

export default combineReducers({ alert, auth, boards, board });
