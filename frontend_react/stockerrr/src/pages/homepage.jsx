import React from "react";
// import {
//   BrowserRouter as Router,
//   Switch,
//   Route,
//   Link
// } from "react-router-dom";

import NavBar from "../components/navbar/navbar";
import Home from "../components/home/home";
// import About from "../src/components/about/about";
// import './App.css';

function HomePage() {
  return (
    <div className="cover">
      <NavBar />
      <Home />
    </div>
  );
}

export default HomePage;
