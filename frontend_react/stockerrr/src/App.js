import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

// import NavBar from "../src/components/navbar/navbar";
import HomePage from "./pages/homepage";
import AboutPage from "./pages/aboutPage";
import LoginPage from "./pages/loginPage";
import './App.css';


function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/login">
          <LoginPage />
        </Route>
        <Route exact path="/about">
          <AboutPage />
        </Route>
        <Route exact path="/">
          <HomePage />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
