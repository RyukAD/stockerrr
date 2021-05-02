import React from "react";
// import {
//   BrowserRouter as Router,
//   Switch,
//   Route,
//   Link
// } from "react-router-dom";

import NavBar from "../components/navbar/navbar";
import About from "../components/about/about";
// import About from "../src/components/about/about";
// import './App.css';

function AboutPage() {
  return (
    <div className="cover">
      <NavBar />
      <About />
    </div>
  );
}

export default AboutPage;
