import React, {useContext, useEffect, useState} from "react";
import GlobalState from "../contexts/GlobalState";
import {Redirect} from "react-router-dom";
import User from "../services/user.service";

const pinata = require('../utils/pinata');

export default function MintNFT() {
    const [state, setState] = useContext(GlobalState);
    const [fileReaded, setFileState] = useState(false)
    const [loadingState, setLoadingState] = useState(false)
    const [message, setMessageState] = useState(null)
    const [error, setErrorState] = useState(null)
    const [txHash, setTxState] = useState(null)
    const [tokenNb, setTokenNbState] = useState(null)
    const [IV, setIVState] = useState(null)

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

    const getSchool = async () => {
        return await User.getSchool(state.address)
    }

    const data = {name:'', description: '', image: "", attributes: {firstname:'', lastname:'', birthdate:'' }};

    const mySubmitHandler = async (event) => {
        event.preventDefault();
        console.log('file:', fileReaded)
        //await encryptData()
        await mintNFT();
    };

    const myChangeHandler = (event) => {
        const data_name = event.target.name;
        const val = event.target.value;
        if (data_name === "description"){
            data[data_name] = val;
        } else { data.attributes[data_name] = val; }
    };

    const mintNFT = async () => {
        setLoadingState(true)
        data.name = state.school.name
        data.image = state.school.logo
        const addressTo = state.school.address
        User.encryptMetadata(data)
            .then( async res => {
                setIVState(res.data.IV)
                pinata.addDataToIPFS(res.data.metadata)
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

    /*
    const onChangeFile = async (e) => {
        if (e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = async (e) => {
                const text = (e.target.result)
                setFileState(text)
            };
            await reader.readAsText(e.target.files[0])
        }
    }
    // https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/importKey
    // https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/encrypt
    // https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/decrypt
    function str2ab(str) {
        const buf = new ArrayBuffer(str.length);
        const bufView = new Uint8Array(buf);
        for (let i = 0, strLen = str.length; i < strLen; i++) {
            bufView[i] = str.charCodeAt(i);
        }
        return buf;
    }
    const fromBase64 = base64String => Uint8Array.from(atob(base64String), c => c.charCodeAt(0));
    const getPkcs8Der = pkcs8Pem => {
        pkcs8Pem = pkcs8Pem.replace( /[\r\n]+/gm, "" );
        const pkcs8PemHeader = "-----BEGIN PRIVATE KEY-----";
        const pkcs8PemFooter = "-----END PRIVATE KEY-----";
        pkcs8Pem = pkcs8Pem.substring(pkcs8PemHeader.length, pkcs8Pem.length - pkcs8PemFooter.length);
        return fromBase64(pkcs8Pem);
    }
    function importPrivateKey(pem) {
        const pemHeader = "-----BEGIN PRIVATE KEY-----";
        const pemFooter = "-----END PRIVATE KEY-----";
        const pemContents = pem.substring(pemHeader.length, pem.length - pemFooter.length);
        const binaryDerString = window.atob(pemContents);
        const binaryDer = str2ab(binaryDerString);
        console.log(binaryDer)
        return window.crypto.subtle.importKey(
            "pkcs8",  getPkcs8Der(pem),
            {name: "RSA-OAEP", hash: "SHA-1",},
            true, ["decrypt"],
        );
    }
    const getDataEncoding = (data) => {
        const enc = new TextEncoder()
        return enc.encode(data)
    }
    const encryptData = async () => {
        const privateKey = await importPrivateKey(fileReaded)
        console.log('privateKey', privateKey)
        const message_encrypted = await window.crypto.subtle.encrypt({name: 'RSA-OAEP'}, privateKey, getDataEncoding('test'))
        console.log('encrypted:', message_encrypted)
        const encrypted = await window.crypto.subtle.decrypt({name: "RSA-OAEP"}, privateKey, message_encrypted)
        console.log('encrypted:', encrypted)
    }
    */

    return (
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

                    {/*
                    <div className="form-group">
                        <label htmlFor="logo">private key to sign the diploma</label>
                        <input type={"file"} className="form-control" name="logo" onChange={onChangeFile}/>
                    </div>
                    */}

                    {/* <input disabled={loadingState} type='submit' className='btn btn-block btn-primary' value='Create diploma'/> */}
                    <button type="submit" className="btn btn-primary btn-block" disabled={loadingState}>
                        {loadingState && (<span className="spinner-border spinner-border-sm"/>)}
                        <span>Create diploma</span>
                    </button>

                    {message && (
                        <div style={{marginTop: 15}} className="form-group">
                            <div className="alert alert-success" role="alert">
                                <p>{message}</p>
                                <p><a href={"https://cchain.explorer.avax-test.network/tx/"+txHash} target='_blank'>check transaction on explorer</a></p>
                                <p><a href={"https://cchain.explorer.avax-test.network/tokens/0xa6d55043FDe319156327B093dc8E0A5555F3D614/instance/"+tokenNb} target='_blank'>check metadata on explorer</a></p>
                                <br/>
                                <p>IV to decode data (ONLY ONE!): {IV}</p>
                            </div>
                        </div>
                    )}
                    {error && (
                        <div className="form-group">
                            <div className="alert alert-danger" role="alert">
                                {error}
                            </div>
                        </div>
                    )}
                </form>
            }
        </div>
    );
}
