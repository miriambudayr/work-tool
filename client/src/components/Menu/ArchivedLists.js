import React, { Fragment } from 'react';
import { ReactComponent as ReopenIcon } from '../reopen.svg';

export default class ArchivedLists extends React.Component {
  constructor(props) {
    super(props);
  }

  getArchivedLists() {
    const { board, updateList } = this.props;
    const archivedLists = [];

    for (var i = 0; i < board.listsArray.length; i++) {
      let currentList = board.listsArray[i];
      if (currentList.archived) {
        archivedLists.push(
          <li className='archived-list' key={currentList._id}>
            <div className='archived-list-name'>
              <span>{currentList.title}</span>
            </div>
            <div className='archived-list-action'>
              <button
                className='reopen-list-button'
                onClick={() => {
                  updateList(currentList._id, currentList.title, false);
                }}
              >
                <ReopenIcon className='reopen-list-icon' />
                Send to board
              </button>
            </div>
          </li>
        );
      }
    }

    if (archivedLists.length === 0) {
      return <div className='no-archives-found'>No archived lists found</div>;
    }

    return <ul className='archived-lists-container'>{archivedLists}</ul>;
  }

  render() {
    return <Fragment>{this.getArchivedLists()}</Fragment>;
  }
}
