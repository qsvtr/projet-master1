import React from 'react';
import {Jumbotron, Container, Button, ButtonToolbar} from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

function Home() {

    return(
        <Container className="p-3">
            <Jumbotron>
                <h1 className="header">Welcome To React-Bootstrap</h1>
                <ButtonToolbar className="custom-btn-toolbar">
                    <ButtonToolbar className="custom-btn-toolbar">
                        <LinkContainer to="/nft">
                            <Button className='mr-1'>List NFTs</Button>
                        </LinkContainer>
                    </ButtonToolbar>
                    <LinkContainer to="/mintNFT">
                        <Button className='mr-1'>MintNFT</Button>
                    </LinkContainer>
                </ButtonToolbar>
            </Jumbotron>
        </Container>
    );
}

export default Home;
