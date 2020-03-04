import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { ReactComponent as AddIcon } from './plus.svg';
import { ReactComponent as CloseIcon } from './close.svg';
import { addList } from '../actions/board';
import { addCard } from '../actions/cards';
import './AddButton.css';

class AddButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inputOpen: false,
      text: ''
    };

    this.handleAddList = this.handleAddList.bind(this);
    this.handleAddCard = this.handleAddCard.bind(this);
    this.openInput = this.openInput.bind(this);
    this.closeInput = this.closeInput.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  handleAddList() {
    const { addList, boardID } = this.props;
    const { text } = this.state;
    if (text) {
      addList(text, boardID);
    }

    this.setState({ text: '' });
  }

  handleAddCard() {
    const { listID, addCard } = this.props;
    const { text } = this.state;

    if (text) {
      addCard(text, listID);
    }

    this.setState({ text: '' });
  }

  openInput() {
    this.setState({ inputOpen: true });
  }

  closeInput() {
    this.setState({ inputOpen: false, text: '' });
  }

  handleInputChange(e) {
    e.persist();
    e.target.style.height = '5px';
    e.target.style.height = e.target.scrollHeight + 'px';

    this.setState({ text: e.target.value });
  }

  handleKeyDown(e) {
    if (e.keyCode === 13) {
      if (e.target.className === 'add-list-input') {
        return this.handleAddList();
      } else {
        return this.handleAddCard();
      }
    }

    if (e.keyCode === 27) {
      this.setState({ inputOpen: false, text: '' });
    }
  }

  renderAddButton() {
    const { type } = this.props;
    const buttonText =
      type === 'list' ? 'Add another list' : 'Add another card';
    const className =
      type === 'list' ? 'button-container-list' : 'button-container-card';

    return (
      <div className={className} onClick={this.openInput}>
        <div className='add-button'>
          <AddIcon className='add-icon' />
          <div className='button-text'>{buttonText}</div>
        </div>
      </div>
    );
  }

  renderInput() {
    const { list } = this.props;
    const buttonTitle = list ? 'Add List' : 'Add Card';

    if (list) {
      return (
        <div className='add-list-form'>
          <input
            className='add-list-input'
            value={this.state.text}
            placeholder='Enter list title...'
            autoFocus='true'
            onChange={this.handleInputChange}
            onKeyDown={this.handleKeyDown}
          ></input>
          <div className='add-list-controls'>
            <input
              onClick={this.handleAddList}
              type='submit'
              value={buttonTitle}
              className='submit-button'
            />
            <CloseIcon className='cancel-btn' onClick={this.closeInput} />
          </div>
        </div>
      );
    } else {
      return (
        <div className='add-card'>
          <div className='add-card-form'>
            <textarea
              autoFocus='true'
              onChange={this.handleInputChange}
              onKeyDown={this.handleKeyDown}
              placeholder='Enter title for this card...'
              value={this.state.text}
            ></textarea>
          </div>
          <div className='add-card-controls'>
            <input
              onClick={this.handleAddCard}
              type='submit'
              value={buttonTitle}
              className='submit-button'
            />
            <CloseIcon className='cancel-btn' onClick={this.closeInput} />
          </div>
        </div>
      );
    }
  }

  render() {
    const { inputOpen } = this.state;
    return inputOpen ? this.renderInput() : this.renderAddButton();
  }
}

AddButton.propTypes = {
  addCard: PropTypes.func.isRequired,
  addList: PropTypes.func.isRequired
};

export default connect(null, { addCard, addList })(AddButton);
