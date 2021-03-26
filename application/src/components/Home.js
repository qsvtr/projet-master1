import React, { useState } from 'react';
import {Jumbotron, Container, Button, ButtonToolbar, Toast} from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import Metamask from "./Metamask";

function Home() {
    const [show, toggleShow] = useState(true);

    return(
        <Container className="p-3">
            <Jumbotron>
                <h1 className="header">Welcome To React-Bootstrap</h1>
                <h2>
                    <ButtonToolbar className="custom-btn-toolbar">
                        <LinkContainer to="/">
                            <Button className='mr-1'>Home</Button>
                        </LinkContainer>
                        <LinkContainer to="/another-page">
                            <Button className='mr-1'>Another Page</Button>
                        </LinkContainer>
                    </ButtonToolbar>
                </h2>

                {!show && <Button onClick={() => toggleShow(true)}>Show Toast</Button>}
                {}
                <Toast show={show} onClose={() => toggleShow(false)}>
                    <Toast.Header>
                        <strong className="mr-auto">Bootstrap</strong>
                        <small>11 mins ago</small>
                    </Toast.Header>
                    <Toast.Body>Hello, world! This is a toast message.</Toast.Body>
                </Toast>
                <Metamask/>
            </Jumbotron>
        </Container>
    );
}

export default Home;
