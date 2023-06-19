import React from "react";
import { Button, Nav } from "react-bootstrap";
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";

const PortalNavbar = () => {
    const navigate = useNavigate();

    const logout = () => {
        localStorage.clear();
        navigate('/auth/signin');
        auth.signOut();
    }

    return (
        <React.Fragment>
            <Navbar bg="dark" expand="lg" className="navbar-dark">
                <Container>
                    <Navbar.Brand>Find your doctor | Portal</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="ms-auto">
                            <Nav.Link>
                                <Button className="btn-warning text-white" onClick={logout}>Logout</Button>
                            </Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </React.Fragment>
    );
}

export default PortalNavbar