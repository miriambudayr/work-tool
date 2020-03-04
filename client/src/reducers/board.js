import {
  SET_BOARD,
  REORDER_CARD,
  ADD_CARD,
  DELETE_CARD,
  UPDATE_CARD,
  ADD_LIST,
  DELETE_LIST,
  UPDATE_LIST,
  UNSET_BOARD,
  UPDATE_BOARD,
  DELETE_BOARD
} from '../actions/types';

const initialState = {
  boardTitle: '',
  listsArray: [],
  boardID: null,
  loading: true,
  boardArchived: false,
  boardColor: null,
  boardMembers: []
};

function board(state = initialState, action) {
  const { type, data } = action;

  switch (type) {
    case SET_BOARD:
      let {
        lists,
        boardTitle,
        boardID,
        boardArchived,
        boardColor,
        boardMembers
      } = data;
      return {
        listsArray: [...lists],
        boardTitle,
        boardID,
        loading: false,
        boardArchived,
        boardColor: boardColor,
        boardMembers
      };
    case DELETE_BOARD:
      return {
        boardTitle: '',
        listsArray: [],
        boardID: null,
        loading: false,
        boardColor: null,
        boardMembers: []
      };
    case UNSET_BOARD:
      return {
        listsArray: [],
        boardTitle: '',
        boardID: null,
        loading: true,
        boardArchived: true,
        boardColor: null,
        boardMembers: []
      };
    case UPDATE_BOARD:
      return updateBoard(state, action);
    case REORDER_CARD:
      return reorderCard(state, action);
    case ADD_CARD:
      return addCard(state, action);
    case DELETE_CARD:
      return deleteCard(state, action);
    case UPDATE_CARD:
      return updateCard(state, action);
    case ADD_LIST:
      return addList(state, action);
    case UPDATE_LIST:
      return updateList(state, action);
    case DELETE_LIST:
      return deleteList(state, action);
    default:
      return state;
  }
}

function updateBoard(state, action) {
  let { title, archived, color, members } = action.data.board;
  return {
    ...state,
    boardTitle: title,
    boardArchived: archived,
    boardColor: color,
    loading: false,
    boardMembers: members
  };
}

function updateList(state, action) {
  let { list } = action.data;
  let listID = list._id;

  const newState = { ...state };

  newState.listsArray = newState.listsArray.map(el => {
    if (el._id === listID) {
      list.itemsArray = el.itemsArray;
      return { ...list };
    } else {
      return el;
    }
  });

  return newState;
}

function addList(state, action) {
  let { list } = action.data;
  let {
    boardTitle,
    listsArray,
    boardID,
    boardArchived,
    boardColor,
    boardMembers
  } = state;

  return {
    listsArray: [...listsArray, { ...list, itemsArray: [] }],
    boardTitle,
    boardID,
    boardArchived,
    boardColor,
    boardMembers
  };
}

function deleteList(state, action) {
  let { listID } = action.data;
  const newState = { ...state };
  const listIndex = newState.listsArray.findIndex(list => list._id === listID);
  newState.listsArray.splice(listIndex, 1);
  return newState;
}

function updateCard(state, action) {
  const { item, listID } = action.data;
  const newState = { ...state };
  const list = newState.listsArray.find(list => list._id === listID);
  list.itemsArray = list.itemsArray.map(card => {
    if (item._id === card._id) {
      return item;
    } else {
      return card;
    }
  });

  return newState;
}

function addCard(state, action) {
  const { item, listID } = action.data;
  const newState = { ...state };
  const list = newState.listsArray.find(list => list._id === listID);
  list.itemsArray.push(item);
  return newState;
}

function deleteCard(state, action) {
  const { listID, cardID } = action.data;
  const newState = { ...state };
  const list = newState.listsArray.find(list => list._id === listID);
  const itemIndex = list.itemsArray.findIndex(item => item._id === cardID);
  list.itemsArray.splice(itemIndex, 1);
  return newState;
}

function reorderCard(state, action) {
  const {
    startDroppableId,
    endDroppableId,
    startDroppableIndex,
    endDroppableIndex
  } = action;

  const newState = {
    ...state
  };

  const { listsArray } = newState;

  if (startDroppableId === endDroppableId) {
    const list = listsArray.find(list => startDroppableId === list._id);
    const item = list.itemsArray.splice(startDroppableIndex, 1)[0];
    list.itemsArray.splice(endDroppableIndex, 0, item);
  } else {
    const startList = listsArray.find(list => startDroppableId === list._id);
    const endList = listsArray.find(list => endDroppableId === list._id);
    const item = startList.itemsArray.splice(startDroppableIndex, 1)[0];
    endList.itemsArray.splice(endDroppableIndex, 0, item);
  }

  return newState;
}

export default board;
