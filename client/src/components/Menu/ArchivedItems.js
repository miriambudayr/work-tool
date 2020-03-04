import React, { Fragment } from 'react';
import { ReactComponent as ArchiveIcon } from '../archive.svg';

export default class ArchivedItems extends React.Component {
  constructor(props) {
    super(props);
  }

  getArchivedItems() {
    const { board, updateCard, deleteCard } = this.props;
    const activeLists = board.listsArray.filter(list => !list.archived);
    const archivedItems = [];

    for (var i = 0; i < activeLists.length; i++) {
      let currentList = activeLists[i];
      currentList.itemsArray.forEach(item => {
        if (item.archived) {
          archivedItems.push(
            <div className='archived-item' key={item._id}>
              <div className='archived-item-card'>
                {item.title}
                <div className='badges'>
                  <ArchiveIcon className='archived-item-icon' />
                  <div className='label'> Archived</div>
                </div>
              </div>
              <p className='archived-item-actions'>
                <a
                  className='send-to-board'
                  onClick={() => {
                    const { _id, title, due, description } = item;
                    updateCard(_id, {
                      title,
                      due,
                      description,
                      archived: false
                    });
                  }}
                >
                  Send to board
                </a>
                -
                <a
                  className='delete-item'
                  onClick={() => {
                    const { _id } = item;
                    deleteCard(_id, currentList._id);
                  }}
                >
                  Delete
                </a>
              </p>
            </div>
          );
        }
      });
    }

    if (archivedItems.length === 0) {
      return <div className='no-archives-found'>No archived items found</div>;
    }

    return <div className='archived-items-container'>{archivedItems}</div>;
  }

  render() {
    return <Fragment>{this.getArchivedItems()}</Fragment>;
  }
}
