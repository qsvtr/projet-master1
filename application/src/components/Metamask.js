import Web3 from "web3";
import {Button} from "react-bootstrap";
import React from "react";

export default class Metamask extends React.Component {
    constructor() {
        super();
        this.state = {
            connected: false,
            address: null,
            error: {
                metamaskNotInstalled: false,
                wrongChainId: false
            }
        };
    }

    connectMetaMask = async () => {
        // important to implement
        // ethereum.on('chainChanged', (_chainId) => window.location.reload());

        if (window.hasOwnProperty("ethereum") && window.ethereum.hasOwnProperty("isMetaMask")) {
            window.web3 = new Web3(window.ethereum);
            window.ethereum.enable();
            const chainId = await window.web3.eth.getChainId()
            if (chainId === 43114 || chainId === 43113) { // Avalanche Network Mainnet and Fuji
                const accounts = await window.web3.eth.getAccounts();
                this.setState(({connected: true, address: accounts[0], error: {metamaskNotInstalled: false, wrongChainId: false}}))
            } else {
                this.setState(({connected: true, address: null, error: {metamaskNotInstalled: false, wrongChainId: true}}))
            }
        } else {
            this.setState(({connected: false, address: null, error: {metamaskNotInstalled: true, wrongChainId: false}}))
        }
    }

    render() {
        return(
            <div>
                <>
                    {!this.state.connected && !this.state.error.metamaskNotInstalled && !this.state.error.wrongChainId
                    && <Button className='mr-1' color='#FF6B00' onClick={this.connectMetaMask}>Connect to a wallet</Button>}
                    {this.state.connected && !this.state.error.metamaskNotInstalled && !this.state.error.wrongChainId && <p>connected with {this.state.address}</p>}
                    {this.state.error.metamaskNotInstalled && <p>you need to install Metamask ((link to the tutorial)</p>}
                    {this.state.error.wrongChainId && <p>need to be connected to good chainId (link to the tutorial)</p>}
                </>
            </div>
        );
    }
}
