import React, {useContext, useEffect} from "react";
import GlobalState from "../contexts/GlobalState";
import {Redirect} from "react-router-dom";
import User from "../services/user.service";

const pinata = require('../utils/pinata');

export default function MintNFT() {
    const [state, setState] = useContext(GlobalState);
    useEffect(() => {
        async function canImint() {
            const result = await canimint()
            if (!result.data) {
                setState({error: {notRight: true}})
                setState(state => ({...state, error: {notRight: true}}))
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

    const canimint = async () => {
        return await User.checkIamASchool(state.address)
    }

    let addressTo ='0x4B9D40cD376cf7d9abA6FbA6FeB8BF73ef0fFc68';

    const data = {
        name:'', description: '', image: "https://gateway.pinata.cloud/ipfs/QmeXs3naKK2Y4GCANLNSmpfbhMcurRXzqkMomXxvs7qNJH",
        attributes: {
            firstname:'',
            lastname:'',
            school:'',
            city:'',
            birthdate:'' }
    };

    const mySubmitHandler = (event) => {
        event.preventDefault();
        mintNFT("./src/images/cat.jpg", data, addressTo);
    };

    const myChangeHandler = (event) => {
        const nam = event.target.name;
        const val = event.target.value;
        if (nam === "addressTo"){
            addressTo = val;
        }
        if (nam === "name" || nam === "description"){
            data[nam] = val;
        } else { data.attributes[nam] = val; }
    };

    const mintNFT = async () => {
        console.log("data : ", data);
        const metadata = await pinata.addDataToIPFS("./cat.jpg", data);
        const token = await state.contract.methods.mint(addressTo, metadata).send({ from: state.address})
        console.log("token : ", token);
    };

    return (
        <div className="container">
                <h1 className="text-center" >Create a new diploma</h1>
            { !state.error
                ? <p>oops you don't have the right</p>
                : <form onSubmit={mySubmitHandler}>
                    <input
                        type='text'
                        className='form-control mb-1'
                        placeholder='Diploma name'
                        name='name'
                        onChange={myChangeHandler}
                    />
                    <input
                        type='text'
                        className='form-control mb-1'
                        placeholder='First name'
                        name='firstname'
                        onChange={myChangeHandler}
                    />
                    <input
                        type='text'
                        className='form-control mb-1'
                        placeholder='Last name'
                        name='lastname'
                        onChange={myChangeHandler}
                    />
                    <input
                        type='text'
                        className='form-control mb-1'
                        placeholder='Student wallet address'
                        name='addressTo'
                        onChange={myChangeHandler}
                    />
                    <input
                        type='text'
                        className='form-control mb-1'
                        placeholder='Birth date'
                        name='birthdate'
                        onChange={myChangeHandler}
                    />
                    <input
                        type='text'
                        className='form-control mb-1'
                        placeholder='School'
                        name='school'
                        onChange={myChangeHandler}
                    />
                    <input
                        type='text'
                        className='form-control mb-1'
                        placeholder='City'
                        name='city'
                        onChange={myChangeHandler}
                    />
                    <input
                        type='text'
                        className='form-control mb-1'
                        placeholder='Description'
                        name='description'
                        onChange={myChangeHandler}
                    />
                    <input
                        type='submit'
                        className='btn btn-block btn-primary'
                        value='Create diploma'
                    />
                </form>
            }
        </div>
    );
}
