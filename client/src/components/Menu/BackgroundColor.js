import React, { Fragment } from 'react';

export default class BackgroundColor extends React.Component {
  constructor(props) {
    super(props);
    this.changeBoardColor = this.changeBoardColor.bind(this);
  }

  changeBoardColor(color) {
    const { board, updateBoard } = this.props;
    updateBoard(board.boardID, board.boardTitle, board.boardArchived, color);
  }

  renderTiles() {
    let colors = [
      'rgb(0, 121, 191)',
      'rgb(210, 144, 52)',
      'rgb(81, 152, 57)',
      'rgb(176, 70, 50)',
      'rgb(137, 96, 158)',
      'rgb(205, 90, 145)',
      'rgb(75, 191, 107)',
      'rgb(0, 174, 204)',
      'rgb(131, 140, 145)'
    ];

    let tilesArray = [];

    colors.forEach(color => {
      tilesArray.push(
        <div
          className='backgrounds-tile'
          onClick={() => {
            this.changeBoardColor(color);
          }}
          style={{ backgroundColor: color }}
        ></div>
      );
    });

    return tilesArray;
  }

  render() {
    return (
      <Fragment>
        <h4 className='menu-background-title'>Change Background</h4>
        <div className='background-tiles'>{this.renderTiles()}</div>
      </Fragment>
    );
  }
}
