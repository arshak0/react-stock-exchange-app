import React from 'react';
import logo from './logo.svg';
import './App.css';
import './styles/main.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }

  render () {
  return (
    <div className="App">
      <header className="App-header">
        <hr>App for Stock Exchange</hr>
      </header>
      <div>
        <form>
          <button>Start</button>
        </form>
        <form>
          <button>Statistics</button>
        </form>
      </div>
    </div>
  )
  }
}

export default App;
