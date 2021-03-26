import {Link} from "react-router-dom";
import {Container} from "react-bootstrap";
import React from "react";
import List from "./List";

const randomInt = () => {
    return Math.floor(Math.random() * 11); // random integer from 0 to 10
}

const list = [
    {
        id: 'a',
        firstname: 'Robin',
        lastname: 'Wieruch',
        year: 1988,
    },
    {
        id: 'b',
        firstname: 'Dave',
        lastname: 'Davidds',
        year: 1990,
    },
];

function AnotherPage() {
    return(
        <Container className="p-3">
            <h1>Another Page</h1>
            <Link to='/' style={{ textDecoration: 'underline blue' }}>
                <p>come back to home</p>
            </Link>
            <p>random integer: {randomInt()}</p>
            <br/>
            <List list={list} />
        </Container>
    );
}

export default AnotherPage;
