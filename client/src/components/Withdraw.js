import React from 'react';

class Withdraw extends React.Component {

    handleSubmit = (event) => {
        this.withdraw();
        event.preventDefault();
    }

    withdraw = async () => {
        const contract = this.props.contract;
        const accounts = this.props.accounts;
        await contract.methods.withdrawEarn().send( { from: accounts[0] });
    }

    render() {
        return <div>
        <p>Please, press the button.</p>
        <p>Will you become a rich boy?</p>
         <form onSubmit={this.handleSubmit}>
            <input type="submit" value="Withdraw"/>
          </form>
        </div>
    }
}

export default Withdraw;
