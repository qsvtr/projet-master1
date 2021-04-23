import React, {useContext, useEffect} from 'react';
import { Button} from 'react-bootstrap';
import Web3 from "web3";
import GlobalState from "../../contexts/GlobalState";
import Diplome from "../../abis/Diplome.json";
import {Link} from "react-router-dom";
import AuthService from "../../services/auth.service";

function Header() {
    const [state, setState] = useContext(GlobalState);
    useEffect(() => {
        async function loadCurrentUser() {
            const user = await AuthService.getCurrentUser();
            if (user) {
                setState(state => ({...state, currentUser: user}))
            }
        }
        loadCurrentUser()
    }, []);

    const logOut = () => {
        AuthService.logout();
    }

    const connectMetaMask = async () => {
        if (window.hasOwnProperty("ethereum") && window.ethereum.hasOwnProperty("isMetaMask")) {
            window.web3 = new Web3(window.ethereum);
            window.ethereum.enable();
            const chainId = await window.web3.eth.getChainId()
            if (chainId === 43113) { // Avalanche Network Testnet Fuji
                const accounts = await window.web3.eth.getAccounts();
                const contract_address = "0x5d43f2476D3fcF10C5552657C07C3D98f26114C1"
                const contract = new window.web3.eth.Contract(Diplome.abi, contract_address);
                setState(state => ({...state, connected: true, address: accounts[0], error: null, contract: contract}))
            } else {
                setState(state => ({...state, connected: false, address: null, error: {metamaskNotInstalled: false, wrongChainId: true}}))
            }
        } else {
            setState(state => ({...state, connected: false, address: null, error: {metamaskNotInstalled: true, wrongChainId: false}}))
        }
    }

    return(
        <nav className="navbar navbar-expand navbar-dark bg-dark">
            <Link to="/" className="navbar-brand">SAFE ON CHAIN</Link>

            <div className="navbar-nav mr-auto">
                <li className="nav-item">
                    <Link to={"/"} className="nav-link">Home</Link>
                </li>

                {state.currentUser && (
                    <li className="nav-item">
                        <Link to={"/admin"} className="nav-link">Admin Board</Link>
                    </li>
                )}

                {state.connected && state.address && (
                    <li className="nav-item">
                        <Link to={"/mintNFT"} className="nav-link">Mint Diploma (NFT)</Link>
                    </li>
                )}
                {!state.connected && <Button className='mr-1' color='#FF6B00' onClick={connectMetaMask}>Connect with Metamask</Button>}
                {state.connected && state.address && <p className="nav-link">connected with {state.address}</p>}
            </div>

            {state.currentUser ? (
                <div className="navbar-nav ml-auto">
                    <li className="nav-item">
                        <Link to={"/profile"} className="nav-link">{state.currentUser.username}</Link>
                    </li>
                    <li className="nav-item">
                        <a href="/" className="nav-link" onClick={() => logOut()}>Logout</a>
                    </li>
                </div>
            ) : (
                <div className="navbar-nav ml-auto">
                    <li className="nav-item">
                        <Link to={"/login"} className="nav-link">Login</Link>
                    </li>
                </div>
            )}
        </nav>
    );
}

export default Header;
