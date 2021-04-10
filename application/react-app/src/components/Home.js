import React  from 'react';
import {Jumbotron, Container, Button, ButtonToolbar} from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import Metamask from "./Metamask";

function Home() {

    return(
        <Container className="p-3">
            <Jumbotron>
                <h1 className="header">Welcome To React-Bootstrap</h1>
                <p>need to be connected on Avalanche testnet Fuji with Metamask</p>
                <h2>
                    <ButtonToolbar className="custom-btn-toolbar">
                        <LinkContainer to="/">
                            <Button className='mr-1'>Home</Button>
                        </LinkContainer>
                    </ButtonToolbar>
                </h2>
                <Metamask/>
            </Jumbotron>
        </Container>
    );
}

export default Home;
