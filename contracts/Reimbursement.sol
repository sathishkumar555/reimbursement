pragma solidity ^0.6.0;

import "@openzeppelin/contracts/ownership/Ownable.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";



// import 'https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol';
// import 'https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/math/SafeMath.sol';

contract Reimbursement is Ownable{
    
    struct RequestPayment{
        uint amount;
        bool requestStatus;
    }
    using SafeMath for uint;

    event AllowanceRequest(address indexed fromAddress ,address indexed toAddress ,uint amount, bool status);
    event SetStatus(address indexed toAddress , bool status);
    event MoneyReceived(address indexed from , uint _amount);
    event MoneySent(address indexed _beneficiary, uint _amount);
    mapping(address => RequestPayment) public allowance;
    
    function requestAllowance(uint _amount, address payable _reqEmployeeAddress) public  {
        emit AllowanceRequest(msg.sender, _reqEmployeeAddress, _amount,  allowance[_reqEmployeeAddress].requestStatus);
        allowance[_reqEmployeeAddress].amount = _amount; 
        allowance[_reqEmployeeAddress].requestStatus = true;
    }
    
    function setReimburseStatus(address  _reqEmployeeAddress, bool _status) public onlyOwner{
        emit SetStatus(_reqEmployeeAddress, _status);
        allowance[_reqEmployeeAddress].requestStatus = _status;
    }
    
    modifier employeeStatus(address _reqEmployeeAddress){
        require(allowance[_reqEmployeeAddress].requestStatus == true,"Please Approve the request and try again");
        _;
    }
    
    function reduceAllowance(address _reqEmployeeAddress, uint _amount) public employeeStatus(_reqEmployeeAddress){
      require(allowance[_reqEmployeeAddress].amount >= _amount ,"You are not allowed");
      allowance[_reqEmployeeAddress].amount = allowance[_reqEmployeeAddress].amount.sub(_amount);
      allowance[_reqEmployeeAddress].requestStatus = false;

    }
    
    function withDrawMoney(address payable _reqEmployeeAddress, uint _amount ) public onlyOwner{
        // require(contractBalance() >= _amount,"Not enough funds in your smart contract.Please add the Funds to  try again");
        // if((_reqEmployeeAddress != owner())){
        //     reduceAllowance(_reqEmployeeAddress, _amount);
        // }
        //  emit MoneySent(_reqEmployeeAddress , _amount);
        _reqEmployeeAddress.transfer(_amount);
    }
    
    function getBalance(address payable _reqEmployeeAddress) public view returns(uint){
        return _reqEmployeeAddress.balance;
    }
    
    function contractBalance() public view returns(uint){
        return address(this).balance;
    }
    
    function renounceOwnership() public override{
        revert("can't renounce ownership here");
    }
    
    receive() external payable{
         emit MoneyReceived(msg.sender , msg.value);
    }
    
}