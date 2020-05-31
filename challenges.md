**Challenges:**

- After istalling a truffle box and when we try to connect to network, we have connected to test network, So to create a custom local Network,
- Follow the steps,
    - In Metamask -> Networks -> CstomRpc ->
        > n/w Name=> ANy name(GanacheCustom)
        > url  localhost rpc url(http://127.0.0.1:7545)
        > chainID ganache chain ID
    - Then To send ether to the account , 
        > truffle console
        > web3.eth.sendTransaction({from: accounts[0], to: "0xf0628770637D838121f7F614DC4990aEef0b3cDC",value: web3.utils.toWei("2", "ether")})
    - When u try to sign transaction the owner in the local ganache is differnet from the MetaMAsk account to sign contract.
    - To achieve that we need a HDWallet Provider
        > Install HD wallet and dotenv(for constant node process varialbes)
