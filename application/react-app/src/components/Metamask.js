import './Metamask.css';
import Web3 from "web3";
import {Button} from "react-bootstrap";
import React from "react";
import Diplome from '../abis/Diplome.json'
import axios from "axios"

export default class Metamask extends React.Component {
    constructor() {
        super();
        this.state = {
            connected: false,
            address: null,
            error: {
                metamaskNotInstalled: false,
                wrongChainId: false
            },
            nfts: []
        };
    }

    connectMetaMask = async () => {
        // important to implement?
        // ethereum.on('chainChanged', (_chainId) => window.location.reload());

        if (window.hasOwnProperty("ethereum") && window.ethereum.hasOwnProperty("isMetaMask")) {
            window.web3 = new Web3(window.ethereum);
            window.ethereum.enable();
            const chainId = await window.web3.eth.getChainId()
            if (chainId === 43114 || chainId === 43113) { // Avalanche Network Mainnet and Fuji
                const accounts = await window.web3.eth.getAccounts();

                // get nfts
                const contract_address = "0xa6d55043FDe319156327B093dc8E0A5555F3D614"
                const contract = new window.web3.eth.Contract(Diplome.abi, contract_address);

                const totalSupply = await contract.methods.totalSupply().call()
                const ntfs = [];
                for (let i = 1; i <= totalSupply; i++) {
                    let ipfs_link = await contract.methods.tokenURI(i).call()
                    await axios.get(ipfs_link)
                        .then(res => {
                            console.log(res.data)
                            ntfs.push(res.data)
                        })
                        .catch(err => console.log(err))
                }
                this.setState({connected: true, address: accounts[0], error: {metamaskNotInstalled: false, wrongChainId: false}, nfts: ntfs})
            } else {
                this.setState({connected: true, address: null, error: {metamaskNotInstalled: false, wrongChainId: true}})
            }
        } else {
            this.setState(({connected: false, address: null, error: {metamaskNotInstalled: true, wrongChainId: false}}))
        }
    }

    render() {
        return(
            <div>
                {/* button connect */}
                {!this.state.connected && !this.state.error.metamaskNotInstalled && !this.state.error.wrongChainId
                && <Button className='mr-1' color='#FF6B00' onClick={this.connectMetaMask}>Connect with Metamask</Button>}

                {/* metamask not installed */}
                {this.state.error.metamaskNotInstalled && <p>you need to install Metamask ((link to the tutorial)</p>}

                {/* not connected to the good chainID (Avalanche Mainnet or Testnet */}
                {this.state.error.wrongChainId && <p>need to be connected to good chainId (link to the tutorial)</p>}

                {/* display NFTs */}
                {this.state.connected && !this.state.error.metamaskNotInstalled && !this.state.error.wrongChainId &&
                <div>
                    <p>connected with {this.state.address}</p>
                    <div className="row text-center">
                        {console.log(this.state.nfts)}

                        {this.state.nfts.length < 1 ?  <p>no nft found</p> : null}

                        {this.state.nfts.map((nft, key) => {
                            return (
                                <div key={key} className="col-md-3 mb-3">
                                    <p>{nft.name}</p>
                                    <p>{nft.description}</p>
                                    <p>{nft.attributes.lastname} {nft.attributes.firstname} {nft.attributes.year}</p>
                                    <img className="photo" src={nft.image} alt="img"/>
                                </div>
                            )
                        })}
                    </div>
                </div>
                }
            </div>
        );
    }
}
