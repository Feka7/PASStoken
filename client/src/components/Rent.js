import React from 'react';

class Rent extends React.Component {

    state = {
        tokenId: null,
         price: null,
        txHash: null
    }

    handleChange = (event) => {
        this.setState({tokenId: event.target.value});
      }

    handleChangePrice = (event) => {
        this.setState({price: event.target.value});
    }

    handleSubmit = (event) => {
        this.rentPass();
        event.preventDefault();
    }

    rentPass = async () => {
        const contract = this.props.contract;
        const accounts = this.props.accounts;
        const n = await contract.methods.rentPass(this.state.tokenId).send({
            from: accounts[0],
            value: this.state.price,
        });
         this.setState({ txHash: n.transactionHash});
    }

    getTxHash = () => {
        if(this.state.txHash === null) return null;
        return this.state.txHash
    }

    render() {
          return (
            <div>
            <p>Select the PASS with his Id and then give it ;)</p>
            <form onSubmit={this.handleSubmit}>
              <label>TokenId</label>
                <br />
                <input type="text" value={this.state.tokenId} onChange={this.handleChange} />
                <br />
                <label>Price:</label>
                <br />
                <input type="text" value={this.state.price} onChange={this.handleChangePrice} />
                <br />
              <input type="submit" value="Submit" className="my-2"/>
            </form>
            <p className="py-3" style={{fontSize: "80%"}}>{this.getTxHash()}</p>
            </div>
          );
      }
}

export default Rent;
