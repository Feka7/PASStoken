import React from 'react';

class Create extends React.Component {

    state = {
        blockNumber: null,
        txHash: null,
        tokenURI: "",
        tokenId: null,
        alert: false
     };

    handleChange = (event) => {
        this.setState({tokenURI: event.target.value});
      }

    handleSubmit = (event) => {
        this.createPass();
        event.preventDefault();
    }

    createPass = async () => {
      const contract = this.props.contract;
      const accounts = this.props.accounts;
      //const blockNumber = await this.props.web3.eth.getBlockNumber();
      const n = await contract.methods.createPass(this.state.tokenURI).send( { from: accounts[0] });
      this.setState({ blockNumber: n.blockNumber, txHash: n.transactionHash});
      this.idPassCreated();
    };

    idPassCreated = async () => {
        const contract = this.props.contract;
        if(this.state.blockNumber === null || this.state.txHash === null) return null;
        this.setState({ alert: true });
        const lastBlock = this.state.blockNumber;
        const bidRevealedEvents = await contract.getPastEvents('Create', {
              fromBlock: lastBlock,
              toBlock: lastBlock
            });
        this.setState({ alert: false });
        if (bidRevealedEvents.length === 0) {
              this.setState({
                  tokenId: "There was a problem. Your pass does not appear to have been minted :("});
        } else {
              this.setState({ tokenId: `Your PASS is minted! The ID is: ${ bidRevealedEvents[0].returnValues.itemId}`});
          }
      };

      getAlert = () => {
          if(!this.state.alert) return null;
          return <p>One moment please, your PASS Id is coming :D</p>
      }


    render() {
        return <div>
                <p>Create you Pass with just one click.</p>
                <p>If you have a tokerURI, you can enter it now.
                However, it will be possible to change it later.</p>
                <p>Don't have a web space for your tokenURI? No problem.
                 The PASS site offers a tokenURI reserved for each new PASS minted.
                 Read in the manager section how to get it.</p>
                 <form onSubmit={this.handleSubmit}>
                    <label>
                      tokenURI:
                    </label>
                    <br />
                    <input type="text" onChange={this.handleChange}
                      placeholder="leave blank if you don't have a tokenURI"
                      style={{width: '20em'}} />
                    <br />
                    <div className="p-2" />
                    <input type="submit" value="Submit"/>
                  </form>
                  <div>{this.getAlert()}</div>
                  <div>{this.state.tokenId}</div>
                </div>


    }
}

export default Create;
