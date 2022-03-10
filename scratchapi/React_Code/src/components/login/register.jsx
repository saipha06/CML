import React from "react";
import loginImg from "../../login.svg";
import "./style.scss";
export class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {username:"",usernameError:"",password :"",passwordError:"",email:"",emailError:"",formError:''}
    this.handleChange = this.handleChange.bind(this)
    this.handlekeyUpUsername = this.handlekeyUpUsername.bind(this)
    this.handlekeyUpPassword = this.handlekeyUpPassword.bind(this)
    this.handlekeyUpEmail = this.handlekeyUpEmail.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }
  handleChange(e){
    this.setState({[e.target.name]:e.target.value})

    
  } 
handlekeyUpUsername(e){
  this.setState({formError:""})
  if(e.target.value ===' ')
  this.setState({usernameError : "username cannot be empty"})
  else{

    this.setState({usernameError: ""})
}

}
handlekeyUpPassword(e){
  this.setState({formError:""})
  var passw=  /^[A-Za-z]\w{7,14}$/;
  if(e.target.value ===' ')
  this.setState({passwordError : "password cannot be empty"})
  else if(!passw.test(e.target.value)){
    this.setState({passwordError : "Password should begin with a letter and have only characters and digits "})
  }
  else{

    this.setState({passwordError: ""})
}

}
handlekeyUpEmail(e){
  this.setState({formError:""})
  const regexp = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  
  if(e.target.value ===' ')
  this.setState({emailError : "Email cannot be empty"})
  else if(!regexp.test(e.target.value)){
    this.setState({emailError : "Enter valid email id"})

  }
  else{

    this.setState({emailError: ""})
}

}
handleSubmit(){
  if(!this.state.usernameError && !this.state.emailError && !this.state.passwordError
    && this.state.password && this.state.email && this.state.username){
      console.log("Success")
    console.log({username:this.state.username,password:this.state.password,email:this.state.email})
    this.setState({formError:""})
    fetch("http://localhost:3000/loginadd",
        {
          method:"post",
          body:JSON.stringify({name:this.state.username,password:this.state.password}),
          headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              }
        }).then(res => res.json())
        .then((results)=>{
          if(results.message === "Success")
          {
            alert("User created succesfully")
          }
          else
          {
            this.setState({
              OpenDialogue:true
            })
          }
          
        })
        .catch((err)=>{
          console.error(err);
          alert(err.message)
        })
      
    
  }
  else{
    this.setState({formError:"Check the form again"})
  }
}

  render() {
    return (
      <div className="base-container" ref={this.props.containerRef}>
        <div className="header">Register</div>
        <div className="content">
          <div className="image">
            <img src={loginImg} />
          </div>
          <div className="form">
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input type="text" name="username" placeholder="username" value = {this.state.username} onChange = {this.handleChange} onKeyUp = {this.handlekeyUpUsername} />
              <span style={{color:'red'}} >{this.state.usernameError}</span>
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input type="email" name="email" placeholder="email"  onChange = {this.handleChange} onKeyUp= {this.handlekeyUpEmail}/>
              <span style={{color:'red'}} >{this.state.emailError}</span>
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input type="password" name="password" placeholder="password" onChange = {this.handleChange} onKeyUp={this.handlekeyUpPassword}/>
              <span style={{color:'red'}} >{this.state.passwordError}</span>
            </div>
          </div>
        </div>
        <span style={{color:'red'}} >{this.state.formError}</span>

        <div className="footer">

          <button type="button" className="btn" onClick = {this.handleSubmit}>
            Register
          </button>
        </div>
      </div>
    );
  }
}