import React, { Component } from 'react';
import { Table, Button  } from 'react-bootstrap';


export default class EmployeeComponent  extends Component{
    render(){
        const { accounts, addEther, requestReimbursement, users} = this.props;
        console.log("welcome employee");
        console.log(users);
               
        return(
            <div className="employee">
                <p className="dashboard-title">Welcome Litmus7 Tribe</p>
                My Account : {accounts[0]}
                {/* <button onClick={addEther} >Add ether</button> */}
                {/* <button onClick={requestReimbursement}>Reimbursement request</button> */}

                <Table striped bordered  size="sm">
                    <thead>
                        <tr>
                        <th>#</th>
                        <th>Address</th>
                        {/* <th>Status</th> */}
                        <th>Date</th>
                        <th>Type</th>
                        <th>Amount</th>
                        <th>Request</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((data,i)=>(
                        <tr>
                            <td>{i+1}</td>
                            <td>{data.address}</td>
                            <td>{data.date}</td>
                            <td>{data.type}</td>
                            {/* <td>{data.status}</td> */}
                            <td>{data.amount}</td>
                            <td>
                                <Button variant="secondary" onClick={()=>requestReimbursement(data)} >Request</Button>{' '}
                            </td>
                        </tr>
                        ))}
                    </tbody>
                    </Table>
            </div>
            
        )
    }
}