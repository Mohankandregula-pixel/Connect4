import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router,Link,NavLink,Redirect,Prompt} from 'react-router-dom';
import Route from 'react-router-dom/Route';




function Hole(props){
  return <div className="Hole"><div className={props.value}></div></div>
}

function Slat(props){
    return <div className="Slat" onClick={() => props.handleClick()}>
      {[...Array(props.holes.length)].map((x, j) => 
        <Hole key={j} value={props.holes[j]}></Hole>)}
      </div>
 }

class Board extends Component {

  constructor() {
    super();
    this.state = {
      boardState: new Array(7).fill(new Array(6).fill(null)),
      player1:1,
      player2:2,
      player1color: 'Red',
      player2color:'Blue',
      playerTurn:'Red',
      gameMode: '',
      gameSelected: false,
      winner: ''
    }
  }

  selectedGame(mode){
    this.setState({
       gameMode: mode,
       gameSelected: true, 
       boardState: new Array(7).fill(new Array(6).fill(null))
    })
  }

  makeMove(slatID){
    const boardCopy = this.state.boardState.map(function(arr) {
      return arr.slice();
    });
    if( boardCopy[slatID].indexOf(null) !== -1 ){
      let newSlat = boardCopy[slatID].reverse()
      newSlat[newSlat.indexOf(null)] = this.state.playerTurn
      newSlat.reverse()
      this.setState({
        playerTurn: (this.state.playerTurn === 'Red') ? 'Blue' : 'Red',
        boardState: boardCopy
      })
    }
  }

  /*Only make moves if winner doesn't exist*/
  handleClick(slatID) {
    if(this.state.winner === ''){
      this.makeMove(slatID)
    }
  }
  
  /*check the winner and make AI move IF game is in AI mode*/
  componentDidUpdate(){
    var win = checkWinner(this.state.boardState)
    

    console.log(win)
    if(this.state.winner !== win){
      console.log(this.state.winner)
      this.setState({ winner : win })
      console.log(this.state.winner)
    } else {
       if(this.state.gameMode === 'ai' && this.state.playerTurn === 'Blue'){
        let validMove = -1;
        while(validMove === -1){
          let slat = Math.floor((Math.random() * 7))
          if(this.state.boardState[slat].indexOf(null) !== -1){
            validMove = slat
          }else{
            validMove = -1
          }
        }
        this.makeMove(validMove)
       }
    }
  }

  render(){

    /*If a winner exists display the name*/
    let winnerMessageStyle
    if(this.state.winner !== ""){
      winnerMessageStyle = "winnerMessage appear"
    }else {
      winnerMessageStyle = "winnerMessage"
    }

    /*Contruct slats allocating column from board*/
    let slats = [...Array(this.state.boardState.length)].map((x, i) => 
      <Slat 
          key={i}
          holes={this.state.boardState[i]}
          handleClick={() => this.handleClick(i)}
      ></Slat>
    )

    return (
      <div>
        {this.state.gameSelected &&
          <div className="Board">
            {slats}
          </div>
        }
        <div className={winnerMessageStyle}>{this.state.winner}</div>
        {(!this.state.gameSelected || this.state.winner !== '') &&
          <div>
            <button onClick={() => this.selectedGame('human')}>Play Game</button>
          </div>
        }
      </div>
    )
  }
}

class App extends Component {
  constructor(props){
    super(props)
    this.state={
      launch:false

    }
  }
  render(){
    if(this.state.launch){
      return (<Hello />)
    }
    else{
      return this.renderHTML()
    }
  }

  launch=()=>{
    this.setState({
      launch:true
    })
  }
  
  renderHTML(){
    return (
      <div>
      <h1 class="App">Mohan's Connect4</h1>

<h3 class="App"><u>Instructions to be followed</u></h3>
<p class="App">In Connect4,the first player starting Connect Four by dropping one of their yellow discs into the center column of an empty game board. The two players then alternate turns dropping one of their discs at a time into an unfilled column, until the second player, with red discs, achieves a diagonal four in a row, and wins the game. If the board fills up before either player achieves four in a row, then the game is a draw.</p>
<div>
<button class="button" onClick={this.launch}>Launch Game</button>
</div>
    </div>
    
    )
  }
  
} 


    



class Hello extends Component {
  constructor(props){
    super(props)
    this.state={
      input1:"",
      input2:""
    }

  }

  UpdateResponse1=(event)=>{
    this.setState({
      input1:event.target.value
    })
  }

  UpdateResponse2=(event)=>{
    this.setState({
      input2:event.target.value
    })
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Mohan Connect IV</h2>
          <label>First player:</label>&nbsp;&nbsp;
          < input onChange={this.UpdateResponse1} value={this.state.input1} />&nbsp;&nbsp;&nbsp;
          <label>Second player:</label>&nbsp;&nbsp;
          < input onChange={this.UpdateResponse2} value={this.state.input2} />
        </div>
        <div className="Game">
          <Board></Board>
        </div>
      </div>
    );
  }
}

function checkLine(a,b,c,d) {
    return ((a !== null) && (a === b) && (a === c) && (a === d));
}

function checkWinner(bs) {
    for (let c = 0; c < 7; c++)
        for (let r = 0; r < 4; r++)
            if (checkLine(bs[c][r], bs[c][r+1], bs[c][r+2], bs[c][r+3]))
              
                return bs[c][r]+' Wins!'

    for (let r = 0; r < 6; r++)
         for (let c = 0; c < 4; c++)
             if (checkLine(bs[c][r], bs[c+1][r], bs[c+2][r], bs[c+3][r]))
                 return bs[c][r]+' Wins!'

    for (let r = 0; r < 3; r++)
         for (let c = 0; c < 4; c++)
             if (checkLine(bs[c][r], bs[c+1][r+1], bs[c+2][r+2], bs[c+3][r+3]))
                 return bs[c][r]+' Wins!'

    for (let r = 0; r < 4; r++)
         for (let c = 3; c < 6; c++)
             if (checkLine(bs[c][r], bs[c-1][r+1], bs[c-2][r+2], bs[c-3][r+3]))
                 return bs[c][r]+' Wins!'

    return "";
}



export default App;


