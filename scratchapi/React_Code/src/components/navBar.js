import React from 'react';
import {Navbar,Nav, NavDropdown} from 'react-bootstrap';
import { useParams } from "react-router";
class Navigationbar extends React.Component{
    constructor(props){
        super(props)
        
    }
    
   render(){
       var a = this.props.id? true:false

    return(
        
        <Navbar bg="dark" variant="dark" sticky="top">
            <Navbar.Brand href="/home">Testing</Navbar.Brand>
            <Nav className="mr-auto">
                {!a&&<Nav.Link href="/home">Home</Nav.Link>}
                {a&&<Nav.Link href="">Home</Nav.Link>}
               {a&& <Nav.Link href={"/enquiryForm/"+this.props.id}>EnquiryForm</Nav.Link>}
               {a&& <Nav.Link href={"/comparisionData/"+this.props.id}>Comparision Form</Nav.Link>}
            </Nav>
            <Nav className="mr-sm-2">
                {!a&&<Nav.Link href="/login_signup">Login/SignUp</Nav.Link>}
                {a&& <NavDropdown title = {(this.props.id)}>
                    <NavDropdown.Item href = "/login_signup">Logout</NavDropdown.Item>
                </NavDropdown>}
            </Nav>
        </Navbar>
    )
    }
}

export default Navigationbar;