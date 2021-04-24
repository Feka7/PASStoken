import React from 'react';
import { Card, Spinner } from 'react-bootstrap';

class Market extends React.Component {

    state = {
        pass: null
    }

    loadPass = () => {
        this.getPass();
        if(this.state.pass === null) {
            return <Spinner animation="border" role="status" />
        } else {
            return <div>
                {this.state.pass.map(item => (
                <Card className="my-2 p-2" key={item.id}>
                <p>Operation: {item.type}</p>
                <p>PassId: {item.itemId}</p>
                <p>Time: {item.day}</p>
                <p>Price: {item.price}</p>
                </Card>
                ))}
            </div>
        }
    }

    /*
        retrieve the event that fired in the last twenty blocks
    */
    getPass = async () => {
        let id = 0;
        const contract = this.props.contract;
        const blockNumber = await this.props.web3.eth.getBlockNumber();
        if(this.state.blockNumber === null) return null;
        const lastOffers = await contract.getPastEvents('Offer', {
              fromBlock: blockNumber - 20,
              toBlock: blockNumber
            });
        const lastUpgrades = await await contract.getPastEvents('Upgrade', {
              fromBlock: blockNumber - 20,
              toBlock: blockNumber
            });
        let items = [];

        lastOffers.forEach((item) => {
            let obj = {
                id: id+=1,
                type: "Offer",
                itemId: item.returnValues.itemId,
                day: item.returnValues.day,
                price: item.returnValues.price
            }
            items.push(obj);
        });

        lastUpgrades.forEach((item) => {
            let obj = {
                id: id+=1,
                type: "Upgrade",
                itemId: item.returnValues.itemId,
                day: item.returnValues.day,
                price: item.returnValues.price
            }
            items.push(obj);
        });
        items.reverse();
        this.setState( { pass: items});
    }

    render() {
      return <div>
      {this.loadPass()}
      </div>
    }
}

export default Market;
