import logo from "../../assets/logo.svg";
import React from "react";
import Login from "../../screens/login/Login";
import { Button } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import { useUser } from "../user-context/UserContext";
import { useAppContext } from '../app-context/AppContext';
import "./Header.css";

export default function Header(props) {
  const user = useUser();
  const app = useAppContext();

  let history = useHistory();

  const login = React.useRef(null);

  function handleBookShow() {
    console.log("BookShow clicked!");
    if (!user.accessToken) {
      login.current();
    } else {
      history.push("/bookShow");
    }
  }

  return (
    <div className="header">
      <img src={logo} alt="logo" className="header-logo"></img>
      <span className="spacer"></span>
      {app.onDetailsPage ? (
        <Button
          variant="contained"
          className="book-show-button"
          color="primary"
          onClick={handleBookShow}
        >
          Book Show
        </Button>
      ) : (
        ""
      )}

      <span id="header-login-button" className="header-login-btn">
        <Login {...props} compRef={login}></Login>
      </span>
    </div>
  );
}
