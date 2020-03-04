import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Register from './components/Register';
import Login from './components/Login';
import Landing from './components/Landing';
import Alert from './components/Alert';
import BoardDeleted from './components/Board/BoardDeleted';
import Board from './components/Board/';
import { loadUser } from './actions/auth';
import { getBoards } from './actions/boards';
import { connect } from 'react-redux';
import { setAuthToken } from './utils';
import ArchivedBoards from './components/ArchivedBoards';
import './App.css';

if (localStorage.token) {
  setAuthToken(localStorage.token);
}

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showArchivedBoards: false
    };

    this.toggleShowArchivedBoards = this.toggleShowArchivedBoards.bind(this);
  }

  async componentDidMount() {
    const { loadUser, getBoards } = this.props;
    loadUser();
    getBoards();
  }

  toggleShowArchivedBoards() {
    this.setState({ showArchivedBoards: !this.state.showArchivedBoards });
  }

  render() {
    const { isAuthenticated, board } = this.props;
    const { showArchivedBoards } = this.state;

    const archivedBoardsModal = showArchivedBoards ? (
      <ArchivedBoards
        toggleShowArchivedBoards={this.toggleShowArchivedBoards}
      />
    ) : null;

    let styles = {
      backgroundColor: board.boardColor
    };

    if (board.boardArchived || !board.boardID) {
      styles.backgroundColor = '#f9fafc';
    }

    return (
      <div className='App'>
        <Router>
          <div>
            <Navbar />
            <section className='container' style={styles}>
              <Alert />
              <Switch>
                <Route
                  exact
                  path='/'
                  render={props => {
                    return isAuthenticated ? (
                      <Home
                        {...props}
                        toggleShowArchivedBoards={this.toggleShowArchivedBoards}
                      />
                    ) : (
                      <Landing />
                    );
                  }}
                />
                <Route exact path='/register' component={Register} />
                <Route exact path='/login' component={Login} />
                <Route path='/board' render={props => <Board {...props} />} />
                <Route exact path='/board-deleted' component={BoardDeleted} />
              </Switch>
            </section>
          </div>
        </Router>
        {archivedBoardsModal}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
  board: state.board
});

export default connect(mapStateToProps, {
  loadUser,
  getBoards
})(App);
