import React  from 'react';

class Intro extends React.Component {
    render() {
        return <div>
            <h3>PASS Token</h3>
                <p>PASS is a simply ERC721 Token that permitted you the control
                of your business with the security of the blockchain tecnology.
                PASS can be a ticket for football match, an online subscription or
                or a special permit for a restricted area.</p>
            <h3>Creator flow</h3>
                <ol>
                    <li>Connect your Metamask wallet</li>
                    <li>Compile the form with the description of the your NTF</li>
                    <li>Press the CREATE button and puff.. a new PASS appear!</li>
                    <li>Select a PASS that you have minted and set an offer</li>
                    <li>It's all! The PASS can now be rent by consumers</li>
                </ol>
            <h3>Consumer flow</h3>
                <ol>
                    <li>Connect your Metamask wallet</li>
                    <li>Select a PASS in the market</li>
                    <li>Rent your PASS</li>
                    <li>You are ready. As long as the pass is valid you will be able
                    to benefit from its privileges and no one will be able to deny it
                    </li>
                    <li>When your pass rental expires, you won't need to do anything</li>
                </ol>
            <h3>Why PASS?</h3>
                <ul>
                    <li>Mint NFT is an expansive operation in terms of gas, creator can
                    mint the token once and reuse it forever.</li>
                    <li>Creator can change the status of their PASS: set, upgrade or remove
                    whenever you want.</li>
                    <li>Consumers are guaranteed to always be able
                    to prove the token rental.</li>
                </ul>
            </div>

    }
}

export default Intro;
