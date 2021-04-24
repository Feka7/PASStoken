import React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import Create from './Create.js';
import Manage from './Manage.js';
import Rent from './Rent.js';

class Mint extends React.Component {

    render() {
      if (!this.props.web3) {
          return <div>
                    <h4>Connect your wallet for minting PASS token!</h4>
                </div>
      }
      return <div>
      <Tabs>
        <TabList>
          <Tab><h5>Create</h5></Tab>
          <Tab><h5>Manage</h5></Tab>
          <Tab><h5>Rent</h5></Tab>
        </TabList>

        <TabPanel>
          <Create
              web3={this.props.web3}
              accounts={this.props.accounts}
              contract={this.props.contract}
            />
        </TabPanel>
        <TabPanel>
         <Manage
             web3={this.props.web3}
             accounts={this.props.accounts}
             contract={this.props.contract}
         />
        </TabPanel>
        <TabPanel>
        <Rent
            web3={this.props.web3}
            accounts={this.props.accounts}
            contract={this.props.contract}
          />
        </TabPanel>
      </Tabs>
    </div>;
    }
}

export default Mint;
