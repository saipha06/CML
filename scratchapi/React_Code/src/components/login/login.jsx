import React from 'react'
import loginImg from "../../login.svg";
import "./style.scss";
import {
  BrowserRouter as Router,Route, Redirect, Link,
} from "react-router-dom";
import {EnquiryForm} from '../enquiryform.component';
export class Logins extends React.Component {
    constructor(props) {
      super(props);
      this.state = {username:"",password:""};
      this.submitLogin = this.submitLogin.bind(this)
      this.handleChange = this.handleChange.bind(this)
    }
    handleChange(e){
      this.setState({[e.target.name]:e.target.value})
    }
    submitLogin() {
      console.log("In function")
      fetch("http://localhost:3000/loginverification",
        {
          method:"post",
          body:JSON.stringify({username:this.state.username,password:this.state.password}),
          headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
              }
        }).then(res => res.json())
        .then((results)=>{
          if(results.message === "Success")
          {
          console.log("Success")
          return window.location.href = '/enquiryForm/' +this.state.username
      
    }
  else{
    console.log("Failed in React")
  }})}
  
    render() {
      return (
        <div className="base-container" ref={this.props.containerRef}>
          <div className="header">Login</div>
          <div className="content">
            <div className="image">
              <img src={loginImg} />
            </div>
            <div className="form">
              <div className="form-group">
                <label htmlFor="username">Username</label>
                <input type="text" name="username" placeholder="username" value ={this.state.username} onChange ={this.handleChange} />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input type="password" name="password" placeholder="password" value ={this.state.password} onChange={this.handleChange} />
              </div>
              <div className="footer">
            <button type="button" className="btn" onClick={this
              .submitLogin}>
              Login
            </button>
            </div>

          </div>
          </div>
       
        </div>
              
      );
    }
  }