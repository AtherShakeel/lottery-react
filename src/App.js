import React, { Component } from 'react';
import './App.css';
import web3 from './web3';
import lottery from './lottery';

class App extends Component {
  // constructor(props) {
  //   super(props);

  //   this.state = {manager: 'gayab'};
  // }

  //*properties could be initialized like this also using ES2016 syntax, this will directly put the state variable in the constructor function',
  state = {manager: 'gayab', players: [], balance: '', value:'', message:'',lastWinner:'', prizeAmount: 0};


   async componentDidMount () {
    const manager =  await lottery.methods.manager().call();
    const players =  await lottery.methods.getPlayersList().call();
    const balance =  await web3.eth.getBalance(lottery.options.address);
    const lastWinner = await lottery.methods.lastWinner().call();
    let prizeAmount =  await lottery.methods.prizeAmount().call();
        prizeAmount =  web3.utils.fromWei(prizeAmount, 'ether');  //* converting wei into ether


    //this.setState({manager: manager, players: players, balance: balance}); //* since the property and variable names are same we can condense this code into the following syntex

    this.setState({ manager, players, balance, lastWinner, prizeAmount});

   };

    onSubmit = async (Event) => {
      Event.preventDefault();

      const accounts = await web3.eth.getAccounts();

      this.setState({ message: 'Please wait while the network confirms the transaction...'});

      await lottery.methods.enterLottery().send ({
        from: accounts[0],
        value: web3.utils.toWei(this.state.value, 'ether')
      });

      this.setState({message: 'You have been entered into the Lottery!  All the best for the draw!'})

    };

    onClick = async () => {
      const accounts = await web3.eth.getAccounts();

      this.setState({ message: 'Please wait while the network confirms the transaction...'});
      const winningAmount =  web3.utils.fromWei(this.state.balance, 'ether')

      await lottery.methods.pickWinner().send ({
        from: accounts[0]
      });

      const winner =  await lottery.methods.lastWinner().call();

      this.setState({
        message: winner + ' has won ' + winningAmount + ' ether. Congratulations! ',
        lastWinner: winner,
        prizeAmount: winningAmount});

    };


  render() {
    return (
      <div>

        <h2> Lottery Contract </h2>
        <p> This contract is managed by {this.state.manager}.
            There are currently {this.state.players.length} people entered,
            competing to win {web3.utils.fromWei(this.state.balance, 'ether' )} ether!.

            Winner of the last contest was {this.state.lastWinner} who won {this.state.prizeAmount} ether!
        </p>

        <hr />

        <form onSubmit={this.onSubmit}>
          <h4> Want to try your luck?</h4>
          <div>
            <label> Amount of ether to enter </label>
            <input
              value={this.state.value}
              onChange={Event =>  this.setState ({value: Event.target.value})}
            />
          </div>
          <button>Enter</button>
        </form>

        <hr />

        <h4> Ready to pick a winner? </h4>
        <button onClick={this.onClick}> Pick winner</button>

        <hr />

        <h1> {this.state.message}</h1>

      </div>
    );
  }
}

export default App;
