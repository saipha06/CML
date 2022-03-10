import React from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
  
} from "react-router-dom";
import HomePage from "./components/homePage.js";
import NavBar from './components/navBar.js';
import EnquiryForm from './components/enquiryform.component.js';
import ComparisionForm from './components/comparision.component.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import {RegisterTest} from './components/login/index.jsx'
import Navigationbar from './components/navBar.js';

function App() {
  return (
    <div className="App">
      <Router>
      <div>
      {/*<NavigationBar/>*/}

        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <Switch>
          <Route exact path="/enquiryForm/:id" component={EnquiryForm}></Route>
          <Route exact path="/comparisionData/:id" component={ComparisionForm}></Route>
          <Route exact path="/home" render= {props =><div><Navigationbar/><HomePage/></div>}></Route>
          <Route exact path = "/login_signup" render= {props =><div><Navigationbar/><RegisterTest/></div>}></Route>
          <Route exact path="/">
            <Redirect to="/home"></Redirect>
          </Route>
          
        </Switch>
      </div>
    </Router>
    </div>
  );
}


export default App;
