import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Card from './Card';
import AddButton from './AddButton';
import { Droppable } from 'react-beautiful-dnd';
import { connect } from 'react-redux';
import { deleteList, updateList } from '../actions/board';
import { ReactComponent as ArchiveIcon } from './archive.svg';
import './List.css';

class List extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editing: false,
      text: this.props.title
    };

    this.toggleEditing = this.toggleEditing.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleArchiveList = this.handleArchiveList.bind(this);
  }

  handleArchiveList(e) {
    e.stopPropagation();
    const { updateList, listID, title } = this.props;
    updateList(listID, title, true);
  }

  toggleEditing() {
    this.setState({ editing: !this.state.editing });
  }

  handleInputChange(e) {
    this.setState({ text: e.target.value });
  }

  handleKeyDown(e) {
    if (e.keyCode === 13) {
      const { updateList, listID } = this.props;
      const { text } = this.state;
      updateList(listID, text, false);
      this.setState({ editing: false });
    }

    if (e.keyCode === 27) {
      this.setState({ editing: false, text: this.props.title });
    }
  }

  render() {
    const { listID, title, cards } = this.props;
    const { editing, text } = this.state;

    return (
      <Droppable droppableId={String(listID)}>
        {provided => (
          <div
            className='list-container'
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            <div className='list-inner'>
              <div className='list-header'>
                {editing ? (
                  <input
                    value={text}
                    onChange={this.handleInputChange}
                    onKeyDown={this.handleKeyDown}
                    autoFocus='true'
                  ></input>
                ) : (
                  <Fragment>
                    <h4 onClick={this.toggleEditing}>{title}</h4>
                    <ArchiveIcon
                      className='archive-list'
                      onClick={this.handleArchiveList}
                    />
                    <div className='archive-list-hover'>Archive</div>
                  </Fragment>
                )}
              </div>
              <div className='tasks'>
                {cards.map((card, i) => {
                  if (!card.archived) {
                    return (
                      <Card
                        title={card.title}
                        key={card._id}
                        id={card._id}
                        due={card.due}
                        description={card.description}
                        index={i}
                        listID={listID}
                      />
                    );
                  } else {
                    return null;
                  }
                })}

                {provided.placeholder}
              </div>
              <AddButton
                listID={listID}
                type={'card'}
                ref={this.addButtonElement}
              />
            </div>
          </div>
        )}
      </Droppable>
    );
  }
}

List.propTypes = {
  deleteList: PropTypes.func.isRequired,
  updateList: PropTypes.func.isRequired,
  board: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  board: state.board
});

export default connect(mapStateToProps, { deleteList, updateList })(List);
