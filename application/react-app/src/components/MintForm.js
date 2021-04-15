import React, {useContext, useEffect} from "react";
import MintFunction from "./MintFunction"
import GlobalState from "../contexts/GlobalState";

class MintForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            diploma:'',
            name: '',
            school: '',
            year: '',
            lastname: '',
            city: '',
            studentID:'',
            addressTo:'',
            description:'',
        };
        /*const imagePath = "./src/images/cat.jpg"
        const data = {name:"NAME", description: "DESCRIPTION", image: "", attributes: {firstname: "FIRSTNAME", lastname: "LASTNAME", year: "YEAR"}}
        const addressTo = "0xeb29d3637369CB3eA8e0f9824e84e3fE8c1773e3"*/
    }

    mySubmitHandler = (event) => {
        event.preventDefault();
        console.log("name : " + this.state.name);
        console.log("description : " + this.state.school);
        console.log("year : " + this.state.year);
        console.log("lastname : " + this.state.lastname);
        console.log("city : " + this.state.city);
        console.log("studentID : " + this.state.studentID);
        const data = {
            name:this.state.diploma, description: this.state.description, image: "https://gateway.pinata.cloud/ipfs/QmeXs3naKK2Y4GCANLNSmpfbhMcurRXzqkMomXxvs7qNJH",
            attributes: {
                name:this.state.name,
                lastname:this.state.lastname,
                studentID:this.state.studentID,
                school:this.state.school,
                city:this.state.city,
                year:this.state.year, }};
        MintFunction("./src/images/cat.jpg", data, this.state.addressTo);
    }

    myChangeHandler = (event) => {
        const nam = event.target.name;
        const val = event.target.value;
        this.setState({[nam]: val});

    }

    render() {
        return (
            <div>
                <h1>Issue Token</h1>
                <form onSubmit={this.mySubmitHandler}>
                    <input
                        type='text'
                        className='form-control mb-1'
                        placeholder='diploma'
                        name='diploma'
                        onChange={this.myChangeHandler}
                    />
                    <input
                        type='text'
                        className='form-control mb-1'
                        placeholder='name'
                        name='name'
                        onChange={this.myChangeHandler}
                    />
                    <input
                        type='text'
                        className='form-control mb-1'
                        placeholder='lastname'
                        name='lastname'
                        onChange={this.myChangeHandler}
                    />
                    <input
                        type='text'
                        className='form-control mb-1'
                        placeholder='studentID'
                        name='studentID'
                        onChange={this.myChangeHandler}
                    />
                    <input
                        type='text'
                        className='form-control mb-1'
                        placeholder='addressTo'
                        name='addressTo'
                        onChange={this.myChangeHandler}
                    />
                    <input
                        type='text'
                        className='form-control mb-1'
                        placeholder='year'
                        name='year'
                        onChange={this.myChangeHandler}
                    />
                    <input
                        type='text'
                        className='form-control mb-1'
                        placeholder='school'
                        name='school'
                        onChange={this.myChangeHandler}
                    />
                    <input
                        type='text'
                        className='form-control mb-1'
                        placeholder='city'
                        name='city'
                        onChange={this.myChangeHandler}
                    />
                    <input
                        type='text'
                        className='form-control mb-1'
                        placeholder='description'
                        name='description'
                        onChange={this.myChangeHandler}
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
}
export default MintForm;