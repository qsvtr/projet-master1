import React, {useContext, useEffect} from "react";
import GlobalState from "../contexts/GlobalState";

//require('dotenv').config({path: '.env'});
const pinata = require('./pinata');

export default function MintFunction() {
    const [state, setState] = useContext(GlobalState);
    useEffect(() => {
        setState(state => ({...state}))
    }, []);

    let addressTo ='0x4B9D40cD376cf7d9abA6FbA6FeB8BF73ef0fFc68';

    const data = {
        name:'', description: '', image: "https://gateway.pinata.cloud/ipfs/QmeXs3naKK2Y4GCANLNSmpfbhMcurRXzqkMomXxvs7qNJH",
        attributes: {
            name:'',
            lastname:'',
            studentID:'',
            school:'',
            city:'',
            year:'' }};

    const mySubmitHandler = (event) => {
        event.preventDefault();
        //console.log("name : " + data.name);
        //console.log("name : " + data.attributes.name);

        mintNFT("./src/images/cat.jpg", data, addressTo);
    };

    const myChangeHandler = (event) => {
        const nam = event.target.name;
        const val = event.target.value;
        if (nam == "addressTo"){
            addressTo = val;
        }
        if (nam == "name" || nam == "description"){
            data[nam] = val;
        } else { data.attributes[nam] = val; }
    };

    const mintNFT = async () => {
        console.log("data : ", data);
        const metadata = await pinata.addDataToIPFS("./cat.jpg", data);
        console.log("metadata : " + metadata);
        const token = await state.contract.methods.mint(addressTo, metadata).send({ from: state.address})
        console.log("token : ", token);
    };


    return (
        <div>
            <h1>Issue Token</h1>
            <form onSubmit={mySubmitHandler}>
                <input
                    type='text'
                    className='form-control mb-1'
                    placeholder='name'
                    name='name'
                    onChange={myChangeHandler}
                />
                <input
                    type='text'
                    className='form-control mb-1'
                    placeholder='name'
                    name='name'
                    onChange={myChangeHandler}
                />
                <input
                    type='text'
                    className='form-control mb-1'
                    placeholder='lastname'
                    name='lastname'
                    onChange={myChangeHandler}
                />
                <input
                    type='text'
                    className='form-control mb-1'
                    placeholder='studentID'
                    name='studentID'
                    onChange={myChangeHandler}
                />
                <input
                    type='text'
                    className='form-control mb-1'
                    placeholder='addressTo'
                    name='addressTo'
                    onChange={myChangeHandler}
                />
                <input
                    type='text'
                    className='form-control mb-1'
                    placeholder='year'
                    name='year'
                    onChange={myChangeHandler}
                />
                <input
                    type='text'
                    className='form-control mb-1'
                    placeholder='school'
                    name='school'
                    onChange={myChangeHandler}
                />
                <input
                    type='text'
                    className='form-control mb-1'
                    placeholder='city'
                    name='city'
                    onChange={myChangeHandler}
                />
                <input
                    type='text'
                    className='form-control mb-1'
                    placeholder='description'
                    name='description'
                    onChange={myChangeHandler}
                />
                <input
                    type='submit'
                    className='btn btn-block btn-primary'
                    value='MINT'
                />
            </form>
        </div>
    );
}