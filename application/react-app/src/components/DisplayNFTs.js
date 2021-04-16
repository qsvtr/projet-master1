import React, {useContext, useEffect, useState} from "react";
import GlobalState from "../contexts/GlobalState";
import {Button} from "react-bootstrap";
import {LinkContainer} from "react-router-bootstrap";
import axios from "axios";
import  { Redirect } from 'react-router-dom'

export default function DisplayNFTs() {
    const [state, setState] = useContext(GlobalState);
    const [nfts, setNFTs] = useState(null);

    useEffect(() => {
        async function fetchNFTS() {
            const result = await fetchNFTs()
            setNFTs(result)
        }
        if (state.connected && state.address) {
            fetchNFTS()
        }
    }, []);

    if (!state.connected) {
        console.log('not connected')
        setState({error: {notConnected: true}})
        setState({connected: false, address: null, error: {notConnected: true}})
        return <Redirect to='/'/>
    }

    const fetchNFTs = async () => {
        const nfts = [];
        const totalSupply = await state.contract.methods.totalSupply().call()
        for (let i = 1; i <= totalSupply; i++) {
            let ipfs_link = await state.contract.methods.tokenURI(i).call()
            await axios.get(ipfs_link)
                .then(res => {
                    console.log(res.data)
                    nfts.push(res.data)
                })
                .catch(err => console.log(err))
        }
        return nfts
    }

    return (
        <div className="content mr-auto ml-auto">
            <h1>NFTS list:</h1>
            <LinkContainer to="/">
                <Button className='mr-1'>Home</Button>
            </LinkContainer>

            <div className="row text-center">
                { !state.connected
                    ? <p>need to be connected</p>
                    : [
                        (!nfts
                                ? <p>loading...</p>
                                : nfts.map((nft, key) => {
                                    return (
                                        <div key={key} className="col-md-3 mb-3">
                                            <p>{nft.name}</p>
                                            <p>{nft.description}</p>
                                            <p>{nft.attributes.lastname} {nft.attributes.firstname} {nft.attributes.year}</p>
                                            <img width="100" height="100" className="photo" src={nft.image} alt="img"/>
                                        </div>
                                    )
                                })
                        ),
                    ]
                }
            </div>
        </div>
    );
}
