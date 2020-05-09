import React, { Component } from 'react';
import _ from 'lodash';
import './App.css';
import { parse } from './utils';

const socket = new WebSocket("wss://hometask.eg1236.com/game1/");

const INITIAL_LEVEL = 1

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { data: {} }
  }

  componentDidMount() {
    socket.onmessage = this.handleData
    socket.onopen = this.start
    socket.onerror = this.handleError
  }

  start = (e) => {
    socket.send("help")
    socket.send(`new ${INITIAL_LEVEL}`)
    socket.send("map")
  }

  open = (row, col) => {
    socket.send(`open ${col} ${row}`)
    socket.send("map");
  }

  setlevel = (e) => {
    console.log('level: ', e.target.value)
    const level = e.target.value

    if (level > 4) {
      alert("Level must be less than 5!")
    }

    socket.send(`new ${level}`)
    socket.send("map");
  }

  handleData = (e) => {
    console.log('DATA --> ', e.data)
    const stateData = _.cloneDeep(this.state.data);
    const newStateData = _.assign(stateData, parse(e.data))

    this.setState({ data: newStateData });
  }

  handleError = (e) => {
    alert(e.data)
  }

  handleClick = (e) => {
    const id = e.target.id.split('-')

    this.open(id[0], id[1])
  }

  handleRightClick = (e) => {
    e.preventDefault();
    e.target.classList.add("intent");
  }

  renderMap = () => {
    const { data } = this.state

    if (!data.map) {
      return null
    }

    const preparedData = data.map.split("\n").filter(d => d !== "")

    return _.map(preparedData, (rowdata, ind) => (
      <div key={ind}  className="row-wrapper">
        {this.renderRow(ind, rowdata)}
      </div>
      )
    )
  }

  renderRow = (index, data) => {
    return _.map(data, (coldata, j) => {
      const sign = coldata === '□' ? '' : coldata
       
      return (
      <div
        id={`${index}-${j}`} key={j}  
        className="row"
        onClick={this.handleClick}
        onContextMenu={this.handleRightClick}
      >
        {sign}
      </div>
      )
    })
  }

  renderStatus = () => {
    const { data } = this.state

    if (!data.open) {
      return null
    }

    return <div className="status">Status: {data.open}  </div>
  }

  renderLevel = () => {
  const { data } = this.state

  const level = data.new ? data.new : INITIAL_LEVEL
  
  return <div className="level">Level: 
    <input type="range" max={4} min={1} name="level" defaultValue={INITIAL_LEVEL}
     onChange={this.setlevel}/>
  </div>
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <h2>Minesweeper</h2>
        </div>
        <div className="info-wrapper">
          {this.renderLevel()}
          {this.renderStatus()}
        </div>
        {this.renderMap()}
      </div>
    );
  }
}

export default App;
