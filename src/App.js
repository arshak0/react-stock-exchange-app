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
      standardDeviation: null,
      modas: null,
      modasValue: null,
      mediana: null,
      showStatistics: false,
      connected: false,
      calculationTime: null
    }
  }

  //Clicking the "Start" button
  handleStartButton = e => {
    e.preventDefault();
    this.setState({
      connected: true
    })

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

    let timeFirst = (new Date()).getTime();

    this.setState({
      showStatistics: true
    })

    let forAverageValue = 0;
    let averageValue = 0
    this.state.allValues.forEach( element => {
      forAverageValue+=element;
    })
    averageValue = forAverageValue/this.state.allValues.length
    this.setState({
      averageValue: averageValue
    })

    let forStandardDeviation = 0
    this.state.allValues.forEach( element => {
      forStandardDeviation += ( element - averageValue )*( element - averageValue );
    })
    this.setState({
      standardDeviation: Math.sqrt( forStandardDeviation/this.state.allValues.length )
    })
    
    //Finding out the moda
    var objectDataset = {
      most: [],
      mostValue: 0
    };
  
    this.state.allValues.forEach( current => {
      if (!objectDataset[current]) {
        objectDataset[current] = 0;
      }
  
      objectDataset[current]++;
      //
      if ( objectDataset.most.length===0 ) {
          objectDataset.most = [current];
          objectDataset.mostValue = 1;
      }
      else if ( objectDataset[current] >= objectDataset[ objectDataset.most[0] ] ) {
        if ( objectDataset[current] === objectDataset[ objectDataset.most[0] ] ) {
          if ( !objectDataset.most.includes( current ) ) {
            objectDataset.most.push( current );
          }
          objectDataset.mostValue = objectDataset[current];
        }
        else {
          objectDataset.most=[current];
          objectDataset.mostValue = objectDataset[current];
        }
      }
      //
    });

    this.setState({
      modas: objectDataset.most,
      modasValue: objectDataset.mostValue
    })
    //-- End of Finding out the moda

    //Finding out the mediana
    let for_mediana=[];
    this.state.allValues.forEach( (element, index) => {
      for_mediana[index] = this.state.allValues[index]
      
    })

    for_mediana.sort( (a, b) => {
        return a - b;
    });

    if ( for_mediana.length%2!==0 ) {
      this.setState({
        mediana: for_mediana[ Math.floor( for_mediana.length/2 ) ]
      })
    }
    else {
      this.setState({
        mediana: (   for_mediana[ for_mediana.length/2 ] + for_mediana[ for_mediana.length/2 - 1 ]  )/2
      })
    }
    //-- End of Finding out the mediana
    
    let timeSecond = (new Date()).getTime();

    if ( (timeSecond - timeFirst)!==0 ) {
      this.setState({
        calculationTime: timeSecond - timeFirst
      })
    }
    else {
      this.setState({
        calculationTime: 1
      })
    }   

    this.consoleLogs( objectDataset, for_mediana );
  }

  consoleLogs = ( objectDataset, for_mediana ) => {
    console.log( '-----------------' );
    console.log( 'Сколько раз встречается мода/моды' );
    console.log( objectDataset.mostValue );
    console.log( 'Все значения' );
    console.log( this.state.allValues );
    console.log( 'Отсортированный массив для медианы' );
    console.log( for_mediana );
    console.log( '-----------------' );
  }

  render () {
    const { modas } = this.state;

    return (
      <div className="app_body">

        <div className="headline_block">
          <img className="app_logo" src="/icon_logo.png" alt=""></img>
          <h1 className="app_h1">App for Stock Exchange</h1>
          <h2 className="app_h2"> По нажатию на “Старт” происходит подключение к эмулятору для получения котировок онлайн.
            При нажатии на кнопку “Статистика” отображает на странице такие статистические значения: среднее, стандартное отклонение,
            моду, медиану. Расчеты осуществляются по всем полученным данным от момента старта до текущего момента нажатия кнопки
            “Статистика”, кнопку можно нажимать сколько угодно раз для получения новых результатов на текущее время.</h2>
          <div  className="app_author_name_div">
            <p className="app_author_name">Arshak Ishkhanyan </p>
          </div>
        </div>


        <div className="app_main_body">
          <div className="app_buttons_div">
            <form className="app_button_form">
              <button className="app_button" onClick={this.handleStartButton} >Start</button>
            </form>
            <form className="app_button_form">
              <button className="app_button" onClick={this.handleStatisticsButton} >Statistics</button>
            </form>
            {this.state.connected && <div className="app_started">
              <span className="app_connected_status app_connected_success"><i className="app_connected_pulse"></i>Connected</span>
            </div>}
          </div>
          {this.state.showStatistics && <div className="app_statisticsBlock">
            <p className="statistics_headline">Среднее арифметическое</p>
              <p className="statistics_result"> { this.state.averageValue.toFixed(2) } </p>
            <p className="statistics_headline">Стандартное отклонение</p>
              <p className="statistics_result"> { this.state.standardDeviation.toFixed(2) } </p>
            <p className="statistics_headline">Мода/Моды</p>
              <div className="app_modas_div">
                {modas.map( moda => <p className = "app_modas_div_p statistics_result" > {moda} </p> )}
              </div>
            <p className="statistics_headline">Сколько раз встречается мода/моды</p>
              <p className="statistics_result"> { this.state.modasValue } </p>
            <p className="statistics_headline mediana_headline">Медиана</p>
              <p className="statistics_result"> { this.state.mediana } </p>
            <p className="statistics_headline">Время вычислений (в миллисекундах)</p>
              <p className="statistics_result"> { this.state.calculationTime } </p>
          </div>}
        </div>
      </div>
    )
  }
}

export default App;
