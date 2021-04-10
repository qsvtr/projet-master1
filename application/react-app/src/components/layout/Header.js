import React from 'react';
import { Navbar } from 'react-bootstrap';

function Header() {
    return(
        <Navbar bg="dark" variant="dark">
            <Navbar.Brand href="/">
                <img
                    alt=""
                    src="logo192.png"
                    width="30"
                    height="30"
                    className="d-inline-block align-top"
                />{' '}
                React Bootstrap
            </Navbar.Brand>
        </Navbar>
    );
}

export default Header;
