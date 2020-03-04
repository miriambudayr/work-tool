import React from 'react';
import ReactDOM from 'react-dom';
import { updateCard } from '../actions/cards';
import { formatDate, isPastDue } from '../utils';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { ReactComponent as CloseIcon } from './close.svg';
import { ReactComponent as RemoveDueDate } from './close-circle.svg';
import Flatpickr from 'react-flatpickr';
import './CardDetail.css';
import 'flatpickr/dist/themes/airbnb.css';

const cardDetailRoot = document.getElementById('modal-root');

class CardDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editingDescription: false,
      descriptionText: this.getCard().description,
      date: '',
      editingTitle: false,
      titleText: this.getCard().title
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.toggleEditingTitle = this.toggleEditingTitle.bind(this);
    this.toggleEditingDescription = this.toggleEditingDescription.bind(this);
  }

  toggleEditingDescription(e) {
    const { updateCard } = this.props;

    if (e.target.className === 'description-cancel') {
      return this.setState({
        editingDescription: false,
        descriptionText: this.getCard().description
      });
    }

    if (e.target.className === 'card-detail-description') {
      return this.setState({ editingDescription: true });
    }

    if (e.target.className === 'description-save') {
      const { descriptionText } = this.state;
      this.setState({ editingDescription: false });

      const card = this.getCard();
      const { title, due, archived, _id } = card;
      updateCard(_id, { title, due, description: descriptionText, archived });
    }
  }

  toggleEditingTitle(e) {
    if (e.target.className === 'card-detail-title') {
      this.setState({
        editingTitle: !this.state.editingTitle,
        titleText: this.getCard().title
      });
    }
  }

  handleInputChange(e) {
    if (e.target.className === 'description-textarea') {
      e.persist();
      e.target.style.height = '5px';
      e.target.style.height = e.target.scrollHeight + 'px';
      return this.setState({ descriptionText: e.target.value });
    }

    if (e.target.className === 'card-detail-title') {
      return this.setState({ titleText: e.target.value });
    }
  }

  handleKeyDown(e) {
    if (e.keyCode === 13) {
      const { updateCard, cardID, listID } = this.props;
      const { titleText } = this.state;
      const card = this.getCard();
      const { due, description, archived } = card;
      updateCard(cardID, {
        title: titleText,
        due,
        description,
        archived
      });
      return this.setState({ editingTitle: false, text: titleText });
    }

    if (e.keyCode === 27) {
      this.toggleEditingTitle(e);
    }
  }

  getCard() {
    const { board, listID, cardID } = this.props;

    const list = board.listsArray.find(list => list._id === listID);
    const card = list.itemsArray.find(item => item._id === cardID);

    return card;
  }

  render() {
    const { listID, board, updateCard, toggleShowCardDetail } = this.props;
    const {
      editingDescription,
      descriptionText,
      editingTitle,
      titleText
    } = this.state;

    const list = board.listsArray.find(list => list._id === listID);
    const card = this.getCard();
    const { title, description, archived, _id, due } = card;
    const pastDue = isPastDue(due);

    return ReactDOM.createPortal(
      <div
        className='card-detail-overlay'
        onClick={e => {
          if (e.target.className === 'card-detail-overlay') {
            toggleShowCardDetail();
          }
        }}
      >
        <div className='card-detail-inner'>
          <CloseIcon
            className='close-card-detail'
            onClick={toggleShowCardDetail}
          />

          <div className='card-detail-main'>
            {editingTitle ? (
              <textarea
                className='card-detail-title'
                value={titleText}
                onChange={this.handleInputChange}
                onKeyDown={this.handleKeyDown}
                autoFocus='true'
                onBlur={this.toggleEditingTitle}
              ></textarea>
            ) : (
              <div
                className='card-detail-title'
                onClick={this.toggleEditingTitle}
              >
                {titleText}
              </div>
            )}

            <div className='card-detail-list-name'>in list {list.title}</div>
            <h3>Description</h3>
            {editingDescription ? (
              <div>
                <textarea
                  autoFocus='true'
                  className='description-textarea'
                  value={descriptionText}
                  onChange={this.handleInputChange}
                  onKeyDown={this.handleKeyDown}
                ></textarea>
                <div className='description-controls'>
                  <button
                    className='description-save'
                    onClick={this.toggleEditingDescription}
                  >
                    Save
                  </button>
                  <CloseIcon
                    className='description-cancel'
                    onClick={this.toggleEditingDescription}
                  />
                </div>
              </div>
            ) : (
              <div
                className='card-detail-description'
                onClick={this.toggleEditingDescription}
              >
                {descriptionText
                  ? descriptionText
                  : 'Add a more detailed description...'}
              </div>
            )}
          </div>
          <div className='card-detail-side'>
            <div className={`date ${pastDue}`}>
              <h3>Due Date</h3>
              <div className='date-display'>
                <Flatpickr
                  value={formatDate(card.due)}
                  placeholder={'Set Due Date'}
                  onChange={date => {
                    let month = date[0].getUTCMonth() + 1;
                    let day = date[0].getUTCDate();
                    let year = date[0].getUTCFullYear();

                    let formattedDate = month + '/' + day + '/' + year;

                    updateCard(_id, {
                      title,
                      due: formattedDate,
                      description,
                      archived
                    });
                  }}
                  options={{ dateFormat: 'M d' }}
                />
                <RemoveDueDate
                  className={`remove-due-date ${due ? 'visible' : null}`}
                  onClick={() => {
                    updateCard(_id, {
                      title,
                      due: null,
                      description,
                      archived
                    });
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>,
      cardDetailRoot
    );
  }
}

CardDetail.propTypes = {
  updateCard: PropTypes.func.isRequired,
  board: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  board: state.board
});

export default connect(mapStateToProps, {
  updateCard
})(CardDetail);
