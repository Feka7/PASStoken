import React from 'react';

class Manage extends React.Component {

    state = {
        tokenId: null,
        operation: null,
        price: null,
        day: null,
        TokenURI: null,
        result: null
    }

    handleChange = (event) => {
        this.setState({tokenId: event.target.value});
      }

    handleChangePrice = (event) => {
         this.setState({price: event.target.value});
      }

    handleChangeDay = (event) => {
         this.setState({day: event.target.value});
      }

    handleChangeTokenURI = (event) => {
           this.setState({tokenURI: event.target.value});
    }

    handleChangeOperation = (event) => {
        this.setState({operation: event.target.value});
    }

    handleSubmit = (event) => {
        this.executeOperation();
        event.preventDefault();
    }

    //manage PASS his methods
    executeOperation = async () => {
        const contract = this.props.contract;
        const accounts = this.props.accounts;
        let result = null;
        let call = false;
        let response = null;

        switch(this.state.operation) {
            case "changeTokenURI":
                result = await contract.methods.changeTokenURI(this.state.tokenId, this.state.tokenURI).send( { from: accounts[0] });
                break;
            case "setOffer":
                result = await contract.methods.setOffer(
                    this.state.tokenId,
                    this.state.day,
                    this.state.price
                ).send( { from: accounts[0] });
                break;
            case "upgradeOffer":
                result = await contract.methods.upgradeOffer(
                    this.state.tokenId,
                    this.state.day,
                    this.state.price
                ).send( { from: accounts[0] });
                break;
            case "removeOffer":
                result = await contract.methods.removeOffer(this.state.tokenId).send( { from: accounts[0] });
                break;
            case "retrievePass":
                result = await contract.methods.retrievePass(this.state.tokenId).send( { from: accounts[0] });
                break;
            case "getDetails":
                result = await contract.methods.getDetails(this.state.tokenId).call( { from: accounts[0] });
                call = true;
                break;
            default:
                break;
        }
            if(call) {
                response = "Consumer: "+result[0]+
                                ", Status: "+result[1]+
                                ", Day: "+result[2]+
                                ", startDay: "+result[3]+
                                ", price: "+result[4];
                this.setState({ result: response });
            }
            else {
                response = "txHash: "+result.transactionHash;
                this.setState({ result: response});
            }
    }

    getTxHash = () => {
        if(this.state.result === null) return null;
        return (
                this.state.result
        );
    }

    getCorrectForm = () => {
        if(this.state.operation === "setOffer"
            || this.state.operation === "upgradeOffer") {
                return (
                    <div>
                        <label>Price(ETH):</label>
                        <br />
                        <input type="text" onChange={this.handleChangePrice}
                        style={{width: "20em"}} />
                        <br />
                        <label>Time(seconds):</label>
                        <br />
                        <input type="text" onChange={this.handleChangeDay}
                        style={{width: "20em"}} />
                    </div>)}
        else if (this.state.operation === "changeTokenURI") {
            return (
                <div>
                    <label>TokenURI:</label>
                    <br />
                    <input type="text" onChange={this.handleChangeTokenURI}
                      style={{width: '20em'}} />
                </div>
            )}
        else return null;
    }

    render() {
        return <div>
                <p>Manage all yours PASS.</p>
                <p>Select PASS with the unique ID and then choose
                the operation you would like to do.</p>
                 <form onSubmit={this.handleSubmit}>
                    <label>
                      tokenId:
                    </label>
                    <br />
                    <input type="text" onChange={this.handleChange}
                      style={{width: '20em'}} />
                    <div style={{padding: '7px'}}/>
                    <label htmlFor="operations">Choose operation:</label>
                    <br />
                    <select name="operations" id="operations" onChange={this.handleChangeOperation}>
                      <option>--select--</option>
                      <option value="changeTokenURI">Change TokenURI</option>
                      <option value="setOffer">Set new offer</option>
                      <option value="upgradeOffer">Upgrade current offer</option>
                      <option value="removeOffer">Remove current offer</option>
                      <option value="retrievePass">Retrieve the PASS</option>
                      <option value="getDetails">Get details of the PASS</option>
                    </select>
                    <br />
                    <div className="p-3">{this.getCorrectForm()}</div>
                    <input type="submit" value="Submit" />
                  </form>
                  <p className="py-3" style={{fontSize: "80%"}}>{this.getTxHash()}</p>
                </div>
    }
}

export default Manage;
