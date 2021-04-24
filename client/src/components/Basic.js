import React from 'react';

class Basic extends React.Component {
    state = {
        tokenId: null,
        isConsumer: false,
        try: false
    }

    handleChange = (event) => {
        this.setState({tokenId: event.target.value});
      }

    handleSubmit = (event) => {
        this.isConsumer();
        event.preventDefault();
    }

    isConsumer = async () => {
        const contract = this.props.contract;
        const accounts = this.props.accounts;
        const n = await contract.methods.isConsumer(this.state.tokenId).call( { from: accounts[0] });
        this.setState({ isConsumer: n, try: true});
    }

    //A basic example: only consumer that rent the PASS can see the secret string
    showSecret = () => {
        if(!this.state.isConsumer) {
            if(this.state.try) return <p> You do not have permission to access :( </p>
            else return null
        }
        else {
            return <div>
                <p>Ooops... There is nothing :P</p>
                <p>However, your permission is ok!</p>
                </div>
        }
    }

    render() {
        return <div>
                <p>Test if you are a consumer.</p>
                <p>Enter the id of the passage you have rented and try it.</p>
                 <form onSubmit={this.handleSubmit}>
                    <label>
                      tokenId:
                    </label>
                    <br />
                    <input type="text" onChange={this.handleChange}
                      style={{width: '20em'}} />
                    <br />
                    <div className="p-2" />
                    <input type="submit" value="Submit"/>
                  </form>
                  <div>{this.showSecret()}</div>
                </div>
    }
}
export default Basic;
