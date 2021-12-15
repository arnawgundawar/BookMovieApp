import React from "react";
import Home from "../screens/home/Home";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { UserProvider } from "../common/user-context/UserContext";
import { AppProvider } from "../common/app-context/AppContext";
import Header from "../common/header/Header";
import BookShow from "./bookshow/BookShow";

const Controller = () => {
  const baseUrl = "http://localhost:8085/api/v1/";

  return (
    <AppProvider>
      <UserProvider>
        <Router>
          <div className="main-container">
            <Route
              exact
              path="/"
              render={(props) => (
                <>
                  <Header {...props} />
                  <Home {...props} baseUrl={baseUrl} />
                </>
              )}
            />
            <Route
              exact
              path="/bookShow"
              render={(props) => (
                <>
                  <Header {...props} />
                  <BookShow {...props} baseUrl={baseUrl} />
                </>
              )}
            />
          </div>
        </Router>
      </UserProvider>
    </AppProvider>
  );
};

export default Controller;
