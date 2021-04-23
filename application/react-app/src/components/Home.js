import React from 'react';
import {Jumbotron, Container} from 'react-bootstrap';
import SchoolList from "./layout/SchoolList";

function Home() {

    return(
        <Container className="p-3 text-center">
            <Jumbotron>
                <h1 className="header">Safe on Chain</h1>
                <br/>
                <SchoolList/>
            </Jumbotron>
        </Container>
    );
}

export default Home;
