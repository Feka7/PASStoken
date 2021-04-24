import React from 'react';
import './App.css';
import Intro from './components/Intro.js';
import Mint from './components/Mint.js';
import Consumer from './components/Consumer.js'
import { Nav, Container, Row, Col } from 'react-bootstrap';
import { BsHeartFill } from "react-icons/bs";
import PassToken from "./contracts/PassToken.json";
import getWeb3 from "./getWeb3";

class App extends React.Component {

    state = {  web3: null, accounts: null, contract: null };

    componentDidMount = async () => {
       try {
         // Get network provider and web3 instance.
         const web3 = await getWeb3();

         // Use web3 to get the user's accounts.
         const accounts = await web3.eth.getAccounts();

         // Get the contract instance.
         const networkId = await web3.eth.net.getId();
         const deployedNetwork = PassToken.networks[networkId];
         const instance = new web3.eth.Contract(
           PassToken.abi,
           deployedNetwork && deployedNetwork.address,
         );

         // Set web3, accounts, and contract to the state, and then proceed with an
         // example of interacting with the contract's methods.
         this.setState({ web3, accounts, contract: instance });
       } catch (error) {
         // Catch any errors for any of the above operations.
         alert(
           `Failed to load web3, accounts, or contract. Check console for details.`,
         );
         console.error(error);
       }
   };

  render() {
     return <div>
            <Nav fill className="justify-content-center header">
                <Nav.Item className="header">
                    <Nav.Link className="header">
                        Guide
                    </Nav.Link>
                </Nav.Item>
                <Nav.Item className="header">
                    <Nav.Link className="header">
                        PASS
                    </Nav.Link>
                </Nav.Item>
                <Nav.Item className="header">
                    <Nav.Link className="header">
                        Market
                    </Nav.Link>
                </Nav.Item>
            </Nav>
            <Container fluid>
                <Row>
                    <Col className="main">
                        <Intro />
                    </Col>
                    <Col className="main">
                    <Mint
                        web3={this.state.web3}
                        accounts={this.state.accounts}
                        contract={this.state.contract}
                    />
                    </Col>
                    <Col className="main">
                    <Consumer
                        web3={this.state.web3}
                        accounts={this.state.accounts}
                        contract={this.state.contract}
                    />
                    </Col>
                </Row>
                <Row>
                    <Col className="footer">
                        <p>Powered with {<BsHeartFill style={{color: 'red'}}/>}
                         &nbsp;by Feka7</p>
                    </Col>
                </Row>
            </Container>
            </div>
    }
}
export default App;
