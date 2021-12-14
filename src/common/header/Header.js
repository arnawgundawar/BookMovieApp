import logo from "../../assets/logo.svg";
import React from "react";
import Login from "../../screens/login/Login";
import "./Header.css";

export default function Header(props) {
  return (
    <div className="header">
      <img src={logo} alt="logo" className="header-logo"></img>
      <span id="header-login-button" className="header-login-btn">
        <Login {...props}></Login>
      </span>
    </div>
  );
}
