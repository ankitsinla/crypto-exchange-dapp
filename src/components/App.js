import React, { Component } from 'react';
import Web3 from 'web3';
import './App.css';
import Token from '../abis/Token.json'
import EthSwap from '../abis/EthSwap.json'
import Navbar from './Navbar'
import Main from './Main'

class App extends Component {

  async componentWillMount() {
      await this.loadWeb3()
      await this.loadBlockChainData()
  }

  async loadBlockChainData(){
    const web3 = window.web3

    const accounts = await web3.eth.getAccounts()
    this.setState({account : accounts[0]})
    const ethBalance = await web3.eth.getBalance(this.state.account)
    this.setState({ethBalance})

    //load token contract
    const abi = Token.abi
    const networkId = await web3.eth.net.getId()
    const tokenData = Token.networks[networkId]
    if(tokenData){
      const token = new web3.eth.Contract(abi,tokenData.address)
      this.setState({token})
      let tokenBalance = await token.methods.balanceOf(this.state.account).call()
      this.setState({tokenBalance : tokenBalance.toString()})
    }else{
      window.alert('Token contract not deployes to detected network')
    }

    //load ethswap contract
    const EthSwapData = EthSwap.networks[networkId]
    if(EthSwapData){
      const ethSwap = new web3.eth.Contract( EthSwap.abi,EthSwapData.address)
      this.setState({ethSwap})
    }else{
      window.alert('EthSwap contract not deployes to detected network')
    }

  
    this.setState({loading:false})
  }

  async loadWeb3(){
    if(window.ethereum){
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable()
    }
    else if(window.web3){
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else{
      window.alert('Non-ethereum browser , pleases install metamask')
    }

  }

  buyTokens = (etherAmount) => {
    this.setState({loading:true})
    console.log(this.state.account,'account',etherAmount)
    this.state.ethSwap.methods.buyTokens().send({value:etherAmount, from: this.state.account}).on('transactionHash', (hash) => {
      this.setState({ loading: false })
    })
  }

  sellTokens = (tokenAmount) => {
    this.setState({loading:true})
    this.state.token.methods.approve(this.state.ethSwap.address, tokenAmount).send({from: this.state.account}).on('transactionHash', (hash) => {
      this.state.ethSwap.methods.sellTokens(tokenAmount).send({from: this.state.account}).on('transactionHash', (hash) => {
        this.setState({ loading: false })
      })
    })
  }

  constructor(props) {
    super(props)
    this.state = {
      account : '',
      token : {},
      ethSwap: {},
      tokenBalance : '0',
      ethBalance : '0',
      loading : true
    }
  }

  render() {
    let content
    
    if(this.state.loading){
      content =<p id='loader' className='text-center'>Loading....</p>
    }else{
      content = <Main ethBalance = {this.state.ethBalance}
                      tokenBalance = {this.state.tokenBalance}
                      buyTokens = {this.buyTokens}
                      sellTokens = {this.sellTokens}/>
    }

    return (
      <div>
        <Navbar account = {this.state.account}/>
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">
                
                
                {content}
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
