import React, { Component } from "react";
import Reimbursement from "./contracts/Reimbursement.json";
// import getWeb3 from "./getWeb3";
import Web3 from "web3";
import "./App.css";
import EmployerComponent from './EmployerComponent';
import EmployeeComponent from './EmployeeComponent';
import { Spinner, Button, Badge } from 'react-bootstrap'

class App extends Component {
  state = { storageValue: 0, web3: null, accounts: null, contract: null, contract_address:"", contract_balance:0 , isOwner:false,users:[],accountBalance:0};

  getAccountData = async () =>{
    const {accounts, isOwner} = this.state;
    const users=[
      {address:"0x021fF8EdA7751b17C24526Dde2167b2Ce206bF33",ownerAddress:isOwner && accounts[0],status:"pending", amount:0.05,type:"Iot device reimbursement",date:new Date().toLocaleDateString()},
      {address:"0x021fF8EdA7751b17C24526Dde2167b2Ce206bF33",ownerAddress:isOwner && accounts[0],status:"pending", amount:1, type:"Flight charges",date:new Date().toLocaleDateString()},
      {address:"0x021fF8EdA7751b17C24526Dde2167b2Ce206bF33",ownerAddress:isOwner && accounts[0],status:"pending", amount:2, type:"postpaid reimbursement",date:new Date().toLocaleDateString()}
    ];
    this.setState({users:users})
  }
  componentDidMount(){
      this.loadData();
    
  }
  getAccountBalance = async () => {
    const accountBalance = await this.web3.eth.getBalance(this.state.accounts[0]);
    let balance = await this.web3.utils.fromWei(accountBalance, 'ether')

    // const accountBalance = await this.web3.utils.fromWei(this.web3.eth.getBalance(this.web3.eth.coinbase)); 

    this.setState({accountBalance: Number(balance).toFixed(4)});
  }

  loadData = async () => {
    try {
      // Get network provider and web3 instance.
      const provider = new Web3.providers.HttpProvider("http://127.0.0.1:8545");
      this.web3 = await  new Web3(window.ethereum) || window.web3 ||  new Web3(provider);

      // Use web3 to get the user's accounts.
      this.accounts = await this.web3.eth.getAccounts(); 
      if(this.accounts.length <= 0){
          this.props.history.push('/');
      }
      // Get the contract instance.
      this.networkId = await this.web3.eth.net.getId();
      this.reimburseInstance = new this.web3.eth.Contract(
        Reimbursement.abi,
        Reimbursement.networks[this.networkId] && Reimbursement.networks[this.networkId].address,
      );
      const contractAddr = Reimbursement.networks[this.networkId].address;
      let Owner = false;
      await this.reimburseInstance.methods.owner().call().then(address=>{
        if(address){
          if(address === this.accounts[0]){
            Owner = true;
          }
        }
      })
      
      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3:this.web3, accounts:this.accounts, contract: this.reimburseInstance,contract_address:contractAddr,isOwner:Owner},this.contractBalance);
    } catch (error) {
      // Catch any errors for any of the above operations.
      this.props.history.push('/');
      console.error(error);
    }
  };
  contractBalance = async() =>{
    const balance = await this.web3.eth.getBalance(this.state.contract_address);
    let balanceInEther= await this.web3.utils.fromWei(balance, 'ether')

    this.setState({
      contract_balance:balanceInEther
    },this.getAccountData) 
    this.getAccountBalance();
    // window.ethereum.on('accountsChanged',(accounts)=>{
    //   // window.location.reload();
    //   console.log(accounts[0] === this.state.accounts[0]);
    // })
  }
  addEther = async () => {
    
    const { accounts, contract } = this.state;
    const response= await this.web3.eth.sendTransaction({from: accounts[0],to:this.state.contract_address, value:this.web3.utils.toWei("1", "ether")});
    this.contractBalance();
    // Stores a given value, 5 by default.
    // await contract.methods.set(5).send({ from: accounts[0] });

    // Get the value from the contract to prove it worked.
    // const response = await contract.methods.get().call();

    // Update state with the result.
    this.setState({ storageValue: response });
  };

  requestReimbursement =  (data) =>{
  console.log(data);
  
    const { accounts } = this.state;
    const {address, amount} =  data;
    const val = this.web3.utils.toWei(amount.toString(), "ether");
    
    this.reimburseInstance.methods.requestAllowance(val, accounts[0]).send({from:accounts[0]}).then(response=>{
      console.log(response);
    });
  }
  setReimburseStatus = () =>{
    const { accounts } = this.state;
    this.reimburseInstance.methods.setReimburseStatus(accounts[0], true).send({from:accounts[0]}).then(response=>{
      console.log(response);
    });
  }
  withDraworSendMoney = async (data) =>{
    let {amount, address} = data;
    const { accounts } = this.state;
    const amountToWei = this.web3.utils.toWei(amount.toString(), "ether");
    console.log(amountToWei, `"${address}"`);
    const response = await this.reimburseInstance.methods.withDrawMoney(`${address}`, amountToWei.toString()).send({from:accounts[0]});  
    this.contractBalance();  
  }
  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    //   <Spinner animation="border" role="status">
    //   <span className="sr-only">Loading...</span>
    // </Spinner>
    }
    const {accountBalance, isOwner, accounts,contract_address, contract_balance, users} =this.state;
    return (
      <div className="App">
        <p className="title">Reimbursement App </p>
        <Button className="balance" variant="primary">
          Ether <Badge variant="light">{accountBalance}</Badge>
          <span className="sr-only">unread messages</span>
      </Button>
        {isOwner ? 
            accounts && <EmployerComponent isOwner={isOwner} accounts={accounts} 
            contract_address={contract_address} contract_balance={contract_balance} 
            addEther={this.addEther} setReimburseStatus={this.setReimburseStatus} users={users}
            withDraworSendMoney ={this.withDraworSendMoney}
          />
          :
          accounts &&  <EmployeeComponent accounts={accounts}  addEther={this.addEther} 
           setReimburseStatus={this.setReimburseStatus} users={users} requestReimbursement={this.requestReimbursement}
          />
        }
      </div>
    );
  }
}

export default App;
