import React, { Component } from 'react';
import { Button,Table  } from 'react-bootstrap';

export default class EmployerComponent  extends Component{
    render(){
        const {isOwner, accounts, contract_address, contract_balance, addEther, setReimburseStatus,users, withDraworSendMoney} = this.props;
        console.log("welcome Employer");
        
        return(
            <div>
                <p className="dashboard-title"> {isOwner && "Welcome Admin/Owner" }</p>
                My Address is : {accounts[0]}
                <p>contract Address: {contract_address}</p>
                <p>contract Address Balance: {contract_balance} Ether</p>
                <Button variant="primary" onClick={addEther}>Add ether to smart contract</Button>{' '}
                <Table striped bordered  size="sm">
                    <thead>
                        <tr>
                        <th>#</th>
                        <th>Address</th>
                        <th>Request Address</th>
                        <th>Date</th>
                        <th>Type</th>
                        <th>Amount</th>
                        <th>Request</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((data,i)=>(
                        <tr key={i}>
                            <td>{i+1}</td>
                            <td>{data.ownerAddress}</td>
                            <td>{data.address}</td>
                            <td>{data.date}</td>
                            <td>{data.type}</td>
                            <td>{data.amount}</td>
                            <td>
                                <Button variant="info"  onClick={()=>withDraworSendMoney(data)}>Approve</Button>{' '}
                            </td>
                        </tr>
                        ))}
                    </tbody>
                    </Table>
            </div>
        )
    }
}