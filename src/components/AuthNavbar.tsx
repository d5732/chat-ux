import React from "react";
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';

const AuthNavbar = () => {
    return (
        <React.Fragment>
            <Navbar bg="dark" expand="lg" className="navbar-dark w-[400px]">
                <Container>
                    <Navbar.Brand className="text-center w-full text-lg font-medium">Find My Doctor</Navbar.Brand>
                </Container>
            </Navbar>
        </React.Fragment>
    );
}

export default AuthNavbar;
