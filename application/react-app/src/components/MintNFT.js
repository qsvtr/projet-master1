import React, {useContext, useEffect, useState} from "react";
import GlobalState from "../contexts/GlobalState";
import {Redirect} from "react-router-dom";
import QRCode from 'react-qr-code';
import User from "../services/user.service";
import {Container, Jumbotron} from "react-bootstrap";
import axios from "axios"

export default function MintNFT() {
    const [state, setState] = useContext(GlobalState);
    const [fileReaded, setFileState] = useState(false)
    const [loadingState, setLoadingState] = useState(false)
    const [message, setMessageState] = useState(null)
    const [error, setErrorState] = useState(null)
    const [txHash, setTxState] = useState(null)
    const [tokenNb, setTokenNbState] = useState(null)
    const [IV, setIVState] = useState(null)
    const [description, setDescriptionState] = useState(null)
    const [firstname, setFirstnameState] = useState(null)
    const [lastname, setLastnameState] = useState(null)
    const [birthdate, setBirthdateState] = useState(null)

    useEffect(() => {
        async function canImint() {
            const result = await getSchool()
            if (!result.data) {
                setState({error: {notRight: true}})
                setState(state => ({...state, error: {notRight: true}}))
            } else {
                setState(state => ({...state, school: result.data}))
            }
        }
        if (state.connected && state.address) {
            canImint()
        }
    }, []);

    if (!state.connected) {
        setState({error: {notConnected: true}})
        setState({connected: false, address: null, error: {notConnected: true}})
        return <Redirect to='/'/>
    }

    const pinJSONToIPFS = async (obj) => {
        const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;
        return await axios.post(url, obj, {
            headers: {
                pinata_api_key: "027a3a5204bf3ff59ffc",
                pinata_secret_api_key: "b8c59aef2458bb2f4015b6f2624e32fb9eab4c1635d5c1fcd2336b32646453f3",
            },
        })
            .then(res => "https://gateway.pinata.cloud/ipfs/" + res.data.IpfsHash)
            .catch(err => console.log('error'));
    }

    const getSchool = async () => {
        return await User.getSchool(state.address)
    }
    const data = {name:'', description: '', image: "", attributes: {signature: '', firstname:'', lastname:'', birthdate:'' }};

    const mySubmitHandler = async (event) => {
        event.preventDefault();
        await encryptData()
        await mintNFT();
    };

    const myChangeHandler = (event) => {
        const data_name = event.target.name;
        const val = event.target.value;
        if (data_name === "description"){
            data[data_name] = val;
        } else { data.attributes[data_name] = val; }

        if (data_name === 'description') {
            setDescriptionState(val)
        } else if (data_name === 'firstname') {
            setFirstnameState(val)
        } else if (data_name === 'lastname') {
            setLastnameState(val)
        } else if (data_name === 'birthdate') {
            setBirthdateState(val)
        }
    };

    const onChangeFile = async (e) => {
        e.preventDefault();
        if (e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = async (e) => {
                setFileState(e.target.result)
            };
            await reader.readAsText(e.target.files[0])
        }
    }

    const mintNFT = async () => {
        setErrorState(null)
        setMessageState(null)
        setLoadingState(true)
        data.name = state.school.name
        data.image = state.school.logo
        data.description = description
        data.attributes.firstname = firstname
        data.attributes.lastname = lastname
        data.attributes.birthdate = birthdate
        const addressTo = state.school.address
        console.log('final', data)
        User.encryptMetadata(data)
            .then( async res => {
                setIVState(res.data.IV)
                pinJSONToIPFS(res.data.metadata)
                    .then(hash_metadata => {
                        state.contract.methods.mint(addressTo, hash_metadata).send({ from: state.address})
                            .then(async token => {
                                const tokenNb = await state.contract.methods.totalSupply().call()
                                setTokenNbState(tokenNb)
                                setTxState(token.transactionHash)
                                setLoadingState(false)
                                setMessageState('token successfully created!')
                            })
                            .catch(error => {
                                setErrorState("cannot mint NFT")
                                setLoadingState(false)
                            })
                    })
                    .catch(error => {
                        setErrorState("cannot add metadata to IPFS")
                        setLoadingState(false)
                    })
            })
            .catch(error => {
                setErrorState('cannot encrypt metadata')
                setLoadingState(false)
            })
    };

    // https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/importKey
    // https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/encrypt
    // https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/decrypt
    // https://stackoverflow.com/questions/61096703/decrypt-an-rsa-message-from-browser-with-window-crypto-subtle-apis
    const fromBase64 = base64String => Uint8Array.from(atob(base64String), c => c.charCodeAt(0));
    const getPkcs8Der = pkcs8Pem => {
        pkcs8Pem = pkcs8Pem.replace( /[\r\n]+/gm, "" );
        const pkcs8PemHeader = "-----BEGIN PRIVATE KEY-----";
        const pkcs8PemFooter = "-----END PRIVATE KEY-----";
        pkcs8Pem = pkcs8Pem.substring(pkcs8PemHeader.length, pkcs8Pem.length - pkcs8PemFooter.length);
        return fromBase64(pkcs8Pem);
    }
    function importPrivateKey(pem) {
        return window.crypto.subtle.importKey(
            "pkcs8",  getPkcs8Der(pem),
            {name: "RSASSA-PKCS1-v1_5", hash: "SHA-256",},
            true, ["sign"],
        );
    }
    const getDataEncoding = (data) => {
        const enc = new TextEncoder()
        return enc.encode(data)
    }
    const encryptData = async () => {
        const encodedData = getDataEncoding('test')
        const privateKey = await importPrivateKey(fileReaded)
        const signatureBytes = await window.crypto.subtle.sign({name: 'RSASSA-PKCS1-v1_5'}, privateKey, encodedData)
        data.attributes.signature = btoa(String.fromCharCode(...new Uint8Array(signatureBytes)));
    }

    return (
        <Container className="p-3 text-center">
            <Jumbotron>
                <div className="container">
                <h1 className="text-center" >Create a new diploma</h1>
            { state.error
                ? <p>oops you don't have the right</p>
                : <form onSubmit={mySubmitHandler}>

                    <div className="form-group">
                        <label htmlFor="description">Description of the diploma</label>
                    <input type='text' className='form-control mb-1' placeholder='Diploma name'
                        name='description' onChange={myChangeHandler}/>
                    </div>

                    <div className="form-group">
                        <label>student data</label>
                        <input type='text' className='form-control mb-1'
                            placeholder='First name' name='firstname' onChange={myChangeHandler}/>

                        <input type='text' className='form-control mb-1' placeholder='Last name'
                            name='lastname' onChange={myChangeHandler}/>

                        <input type='text' className='form-control mb-1' placeholder='Birth date'
                               name='birthdate' onChange={myChangeHandler}/>
                    </div>


                    <div className="form-group">
                        <label htmlFor="logo">private key to sign the diploma</label>
                        <input type={"file"} className="form-control" name="logo" onChange={onChangeFile}/>
                    </div>

                    <button type="submit" className="btn btn-primary btn-block" disabled={loadingState}>
                        {loadingState && (<span className="spinner-border spinner-border-sm"/>)}
                        <span>Create diploma</span>
                    </button>

                    {message && (
                        <div style={{marginTop: 15}} className="form-group text-center">
                            <div className="alert alert-success" role="alert">
                                <p>{message}</p>
                                <p><a href={"https://cchain.explorer.avax-test.network/tx/"+txHash} target='_blank'>check transaction on explorer</a></p>
                                <p><a href={"https://cchain.explorer.avax-test.network/tokens/0xa6d55043FDe319156327B093dc8E0A5555F3D614/instance/"+tokenNb} target='_blank'>check metadata on explorer</a></p>
                                <br/>
                                <p>key to decode data (<strong>ONLY ONE!</strong>): {IV}</p>
                            </div>

                            <di>
                                <p>scan or send this QR Code to display the diploma</p>
                                <QRCode value={"https://safeonchain.qsvtr.fr/?id="+tokenNb+"&key="+IV}/>
                            </di>
                        </div>
                    )}
                    {error && (
                        <div style={{marginTop: 15}} className="form-group">
                            <div className="alert alert-danger" role="alert">
                                {error}
                            </div>
                        </div>
                    )}
                </form>
            }
        </div>
            </Jumbotron>
        </Container>
    );
}
