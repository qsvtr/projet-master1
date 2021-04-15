import React, {useContext, useEffect} from 'react';
import {Jumbotron, Container, Button, ButtonToolbar} from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import Information from "./Information"
import GlobalState from "../contexts/GlobalState";

function Home() {
    const [state, setState] = useContext(GlobalState);
    useEffect(() => {
        setState(state => ({...state}))
    }, []);

    return(
        <Container className="p-3">
            <Jumbotron>
                <Information/>
                <h1 className="header">Welcome To React-Bootstrap</h1>
                <h2>
                    <ButtonToolbar className="custom-btn-toolbar">
                        <LinkContainer to="/">
                            <Button className='mr-1'>Home</Button>
                        </LinkContainer>
                    </ButtonToolbar>
                    <ButtonToolbar className="custom-btn-toolbar">
                        <LinkContainer to="/mintFunction">
                            <Button className='mr-1'>MintFunction</Button>
                        </LinkContainer>
                    </ButtonToolbar>
                </h2>
            </Jumbotron>
        </Container>
    );
}

export default Home;
