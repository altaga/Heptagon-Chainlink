import React, { Component } from 'react';
import reactAutobind from 'react-autobind';
import Login from './screens/login/login';
import Main from './screens/main/main';
import ContextModule from './utils/contextModule';

class App extends Component {
  constructor(props) {
    super(props);
    reactAutobind(this);
  }

  static contextType = ContextModule;

  componentDidMount() {
  }

  componentWillUnmount() {

  }

  render() {
    return (
      <div>
        {
          this.context.value.page === 1 &&
          <Login />
        }
        {
          this.context.value.page === 2 &&
          <Main />
        }
      </div>
    );
  }
}

export default App;