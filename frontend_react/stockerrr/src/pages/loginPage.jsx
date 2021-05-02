import React from "react";
// import {
//   BrowserRouter as Router,
//   Switch,
//   Route,
//   Link
// } from "react-router-dom";

import NavBar from "../components/navbar/navbar";
import Login from "../components/login/login";
// import './App.css';

function LoginPage() {
  return (
    <div className="cover">
      <NavBar />
      <Login />
    </div>
  );
}

export default LoginPage;
