import React,{Component} from 'react';
import {Navbar,Nav} from 'react-bootstrap';

export default class NavBar extends Component{
    render() {
        return(
            <Navbar expand="lg" fixed = "top" className = "navbar">
            <h3 id='logo'><span>🌐</span> g e o l o c k e r</h3>
            <div className='nav-links'>
                <Nav.Link href="/">Home</Nav.Link>
                <Nav.Link href="/register">Register</Nav.Link>
                <Nav.Link href="/approve">Approve</Nav.Link>
                </div>
            </Navbar>
        )
    }
};
