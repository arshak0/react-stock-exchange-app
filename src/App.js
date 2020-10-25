import React from 'react';
import logo from './logo.svg';
import './App.css';
import './styles/main.css';

class App extends React.Component {

  constructor(props) {
    super(props);
    this.handleStartButton=this.handleStartButton.bind(this);
    this.handleStatisticsButton=this.handleStatisticsButton.bind(this);
    this.state = {
      allStocks: [],
      allValues: [],
      averageValue: null,
      showStatistics: false
    }
  }

  //Clicking the "Start" button
  handleStartButton = e => {
    e.preventDefault();

    this.handleSocket();
  };

  handleSocket = e => {
    const { allStocks, allValues } = this.state;

    // Socket Open Code Start
    var socket = new WebSocket("wss://trade.trademux.net:8800/?password=1234");

    let forSetStateValue=[];
    let forSetStateStock=[];

    socket.onopen = () => {
      console.log("Connection setuped");
    };

    socket.onclose = e => {
      if (e.wasClean) {
        console.log('Connection is closed clean');
      } else {
        console.log('Connection Lost');
      }
      console.log('Code: ' + e.code + ' Reason: ' + e.reason);
    };

    socket.onmessage = e => {
      forSetStateStock.push( {id: JSON.parse(e.data).id, value: JSON.parse(e.data).value} );
      forSetStateValue.push( JSON.parse(e.data).value );
      this.setState({
        allStocks: forSetStateStock,
        allValues: forSetStateValue
      });
    };

    socket.onerror = function(error) {
      console.log(" Error " + error.message);
    };
    //-- Socket Open Code End
  }

  handleStatisticsButton = e => {
    e.preventDefault();
    this.handleStatisticsShow();
  };

  handleStatisticsShow = e => {

    this.setState({
      showStatistics: true
    })

    let forStatistics = 0;
    this.state.allValues.forEach( element => {
      forStatistics+=element;
    })
    this.setState({
      averageValue: forStatistics/this.state.allValues.length
    })
    console.log(this.state.allValues)
    console.log( forStatistics/this.state.allValues.length );
  }

  render () {
    return (
      <div>
        <h1>App for Stock Exchange</h1>
        <div>
          <form>
            <button onClick={this.handleStartButton} >Start</button>
          </form>
          <form>
            <button onClick={this.handleStatisticsButton} >Statistics</button>
          </form>
        </div>
        {this.state.showStatistics && <div className="statisticsBlock">
          <p>Среднее арифметическое</p>
            <p>{this.state.averageValue}</p>
          <p>Стандартное отклонение</p>
          <p></p>
          <p>Мода</p>
          <p></p>
          <p>Медиана</p>
          <p></p>
        </div>}
      </div>
    )
  }
}

export default App;
