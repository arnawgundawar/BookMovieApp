import React from "react";
import Home from "../screens/home/Home";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { UserProvider } from "../common/user-context/UserContext";

const Controller = () => {
  const baseUrl = "/api/v1/";

  return (
    <Router>
      <div className="main-container">
        <Route
          exact
          path="/"
          render={(props) => (
            <UserProvider>
              {" "}
              <Home {...props} baseUrl={baseUrl} />{" "}
            </UserProvider>
          )}
        />
      </div>
    </Router>
  );
};

export default Controller;
