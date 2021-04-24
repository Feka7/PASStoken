import React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import Market from './Market.js';
import Basic from './Basic.js';
import Withdraw from './Withdraw.js';

class Consumer extends React.Component {

    render() {
      if (!this.props.web3) {
          return <div />;
      }
      return <div>
      <Tabs>
        <TabList>
          <Tab><h5>Market</h5></Tab>
          <Tab><h5>Example</h5></Tab>
          <Tab><h5>Withdraw</h5></Tab>
        </TabList>

        <TabPanel>
          <Market
              web3={this.props.web3}
              accounts={this.props.accounts}
              contract={this.props.contract}
            />
        </TabPanel>
        <TabPanel>
        <Basic
            web3={this.props.web3}
            accounts={this.props.accounts}
            contract={this.props.contract}
          />
        </TabPanel>
        <TabPanel>
        <Withdraw
            web3={this.props.web3}
            accounts={this.props.accounts}
            contract={this.props.contract}
          />
        </TabPanel>
      </Tabs>
    </div>;
    }
}

export default Consumer;
