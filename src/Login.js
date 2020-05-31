import React, { Component } from "react";
import getWeb3 from "./getWeb3";
import login from './images/metamask-login.png';

class Login extends Component{
  state = { web3: null};

    componentDidMount(){
      window.addEventListener('load',async()=>{
        const isLogin = await (window.ethereum && window.ethereum.selectedAddress);
        if(isLogin){
            this.props.history.push('/dashboard');
        }
      })
    }
    login = async () =>{
        try {
            // Get network provider and web3 instance.
            // await this.loginAccount();
            this.web3 = await getWeb3();
            
      
            // Use web3 to get the user's accounts.
            this.accounts = await this.web3.eth.getAccounts();
            
      
            // Get the contract instance.
            this.networkId = await this.web3.eth.net.getId();
            
            this.setState({web3: this.web3});
            
          } catch (error) {
            alert( `Failed to load web3, accounts, or contract. Check console for details.`,);
            console.error(error);
          }
        };
    render(){
        if(this.state.web3){
            this.props.history.push('/dashboard');
        }
        return (
         <div className="login" onClick={this.login} >
              <h2>Welcome to Reimbursement App!</h2><br/>
             <img class="login-btn" src={login} />
         </div>
        );
    }
}

export default Login;
