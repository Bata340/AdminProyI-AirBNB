import { useState, useEffect } from "react";

import { Navbar, Nav, NavDropdown, Button } from "react-bootstrap";
import "./Navbar.css";
import 'bootstrap/dist/css/bootstrap.min.css';



function isLoggedIn(){
    return (
        localStorage.getItem("sessionToken") !== undefined 
            && localStorage.getItem("sessionToken") !== null
    );
}

export const NavBar = () => {

    const [isLoggedInSt, setIsLoggedInSt] = useState(isLoggedIn());

    const logout = () => {
        localStorage.removeItem("sessionToken");
        localStorage.removeItem("user");
        localStorage.removeItem("username");
        window.location.reload();
    }


    useEffect(() => {
        const handleStorage = () => {
            setIsLoggedInSt(isLoggedIn());
        }
    
        window.addEventListener('storage', handleStorage);
        return () => window.removeEventListener('storage', handleStorage());
    }, []);


	return (
		<div className="fixed-top">
            <Navbar bg="color_custom_nav" expand="lg">
                <Navbar.Brand className="mx-3" href="/">
                    <img src="/logo.png" height="65px" alt="logo-home" id="image_logo"/>
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" style={{marginRight:'2rem'}}/>
                <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto">
                    {isLoggedInSt && 
                        <NavDropdown
                        className="mx-3"
                        title="Properties"
                        id="dropdown_propiedades"
                        >
                            <NavDropdown.Item href="/properties/add" className="propertyItem">
                                Add a Property
                            </NavDropdown.Item>
                            <NavDropdown.Item href="/properties/admin-my-props" className="propertyItem">
                                Manage My Properties
                            </NavDropdown.Item>
                            <NavDropdown.Item href="/my-properties" className="propertyItem">
                                Manage My Schedule
                            </NavDropdown.Item>
                            <NavDropdown.Item href="/Properties/Requests" className="propertyItem">
                                My Properties`s Requests
                            </NavDropdown.Item>
                        </NavDropdown>
                    }
                    <NavDropdown
                    className="mx-3"
                    title="Experiences"
                    id="dropdown_experiencias"
                    >
                        <NavDropdown.Item href="/experiences" className="experienceItem">
                            Search Experiences
                        </NavDropdown.Item>
                        {isLoggedInSt && 
                            <>
                                <NavDropdown.Item href="/experiences/add" className="experienceItem">
                                    Add An Experience
                                </NavDropdown.Item>
                                <NavDropdown.Item href="/experiences/admin-my-experiences" className="experienceItem">
                                    Manage My Experiences
                                </NavDropdown.Item>
                                <NavDropdown.Item href="/my-experiences" className="experienceItem">
                                    Manage My Schedule
                                </NavDropdown.Item>
                            </>
                        }
                    </NavDropdown>
                    {isLoggedInSt && 
                    <NavDropdown
                    className="mx-3"
                    title="Reviews"
                    id="dropdown_reviews"
                    >
                        <NavDropdown.Item href="/reviews/occupants" className="experienceItem">
                            Review Occupants
                        </NavDropdown.Item>
                        <NavDropdown.Item href="/reviews/properties" className="experienceItem">
                            Review Properties
                        </NavDropdown.Item>
                    </NavDropdown>}
                </Nav>
                <Nav className="ms-auto">
                    {isLoggedInSt ? 
                        <Button id="button-logout" variant="danger" onClick = {logout}>
                            <strong>Logout</strong>
                        </Button>
                        :
                        <Button id="button-login" variant="primary" href="/login">
                            <strong>Login</strong>
                        </Button>
                    }
                </Nav>
                </Navbar.Collapse>
            </Navbar>
		</div>
	);
}