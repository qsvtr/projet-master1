import React, {useContext, useEffect} from 'react';
import {Button, Navbar} from 'react-bootstrap';
import Web3 from "web3";
import GlobalState from "../../contexts/GlobalState";
import Diplome from "../../abis/Diplome.json";

function Header() {
    const [state, setState] = useContext(GlobalState);
    useEffect(() => {
        setState(state => ({...state}))
    }, []);
    console.log(state)

    const connectMetaMask = async () => {
        console.log('clicked')
        if (window.hasOwnProperty("ethereum") && window.ethereum.hasOwnProperty("isMetaMask")) {
            window.web3 = new Web3(window.ethereum);
            window.ethereum.enable();
            const chainId = await window.web3.eth.getChainId()
            if (chainId === 43113) { // Avalanche Network Testnet Fuji
                const accounts = await window.web3.eth.getAccounts();
                const contract_address = "0xa6d55043FDe319156327B093dc8E0A5555F3D614"
                const contract = new window.web3.eth.Contract(Diplome.abi, contract_address);
                setState({connected: true, address: accounts[0], error: null, contract: contract})
            } else {
                setState({connected: false, address: null, error: {metamaskNotInstalled: false, wrongChainId: true}})
            }
        } else {
            setState(({connected: false, address: null, error: {metamaskNotInstalled: true, wrongChainId: false}}))
        }
    }

    return(
        <Navbar bg="dark" variant="dark">
            <Navbar.Brand href="/">
                <img
                    alt=""
                    src="logo192.png"
                    width="30"
                    height="30"
                    className="d-inline-block align-top"
                />{' '}
                DiplomaFactory
            </Navbar.Brand>
            {!state.connected && <Button className='mr-1' color='#FF6B00' onClick={connectMetaMask}>Connect with Metamask</Button>}
            {state.connected && state.address && <p style={{color: "white"}}>connected with {state.address}</p>}
        </Navbar>
    );
}

export default Header;
