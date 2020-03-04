import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { deleteCard, updateCard } from '../actions/cards';
import PropTypes from 'prop-types';
import CardDetail from './CardDetail';
import { connect } from 'react-redux';
import { formatDate, isPastDue } from '../utils';
import { ReactComponent as ArchiveIcon } from './archive.svg';
import { ReactComponent as DescriptionIcon } from './description.svg';
import { ReactComponent as ClockIcon } from './clock.svg';

import './Card.css';

class Card extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showCardDetail: false
    };
    this.handleArchiveCard = this.handleArchiveCard.bind(this);
    this.toggleShowCardDetail = this.toggleShowCardDetail.bind(this);
  }

  toggleShowCardDetail() {
    this.setState({ showCardDetail: !this.state.showCardDetail });
  }

  handleArchiveCard(e) {
    e.stopPropagation();
    const { id, updateCard, title, due, description } = this.props;
    updateCard(id, { title, due, description, archived: true });
  }

  render() {
    const { title, id, index, listID, due, description } = this.props;
    const { showCardDetail } = this.state;
    const pastDue = isPastDue(due);

    return (
      <div>
        <Draggable draggableId={String(id)} index={index}>
          {provided => (
            <span
              onClick={() => this.toggleShowCardDetail()}
              className='card-container'
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
            >
              <span className='card-title'> {title}</span>
              <ArchiveIcon
                className='archive-card'
                onClick={this.handleArchiveCard}
              />
              <div className='archive-hover'>Archive</div>

              <div className='card-badges'>
                {due ? (
                  <div className={`card-date ${pastDue}`}>
                    <ClockIcon className='clock-icon' />
                    {formatDate(due)}
                  </div>
                ) : null}

                {description ? (
                  <div className='card-description'>
                    <DescriptionIcon />
                  </div>
                ) : null}
              </div>
            </span>
          )}
        </Draggable>
        {showCardDetail ? (
          <CardDetail
            listID={listID}
            cardID={id}
            toggleShowCardDetail={this.toggleShowCardDetail}
          />
        ) : null}
      </div>
    );
  }
}

Card.propTypes = {
  deleteCard: PropTypes.func.isRequired,
  updateCard: PropTypes.func.isRequired
};

export default connect(null, {
  deleteCard,
  updateCard
})(Card);
