import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Tabs,
  Tab,
  Box,
} from "@material-ui/core";
import PropTypes from "prop-types";
import Modal from "react-modal";
import "./Login.css";
import LoginForm from "./login-form/LoginForm";
import RegisterForm from "../register/Register";
import { useUser, useUserUpdate } from "../../common/user-context/UserContext";
import { AuthService } from "../../services/AuthService";

export default function Login(props) {
  const [isOpen, setIsOpen] = useState(false); //init with false for closed modal
  const [value, setValue] = useState(0); // Tab value 0 -> login | 1 -> register

  useEffect(() => {
    Modal.setAppElement("#header-login-button");
  });

  const user = useUser();
  const updateUser = useUserUpdate();

  useEffect(() => {}, [user]);

  function toggleModalState() {
    setIsOpen(!isOpen);
  }

  const handleTabChanged = (event, newValue) => {
    setValue(newValue);
  };

  function a11yProps(index) {
    return {
      id: `tab-${index}`,
      "aria-controls": `tabpanel-${index}`,
    };
  }

  function handleLogout() {
    AuthService.logout(user.accessToken);
    updateUser({
      accessToken: undefined,
      emailAddress: undefined,
      firstName: undefined,
      lastName: undefined,
      id: undefined,
    });
  }

  if (!user.accessToken) {
    return (
      <div>
        <Button
          variant="contained"
          className="header-login-btn"
          color="primary"
          onClick={toggleModalState}
        >
          Login
        </Button>
        <Modal
          isOpen={isOpen}
          onRequestClose={toggleModalState}
          className="login-modal-container"
        >
          <Card variant="outlined">
            <CardHeader title="Authentication" className="login-card-header" />
            <CardContent>
              <Tabs
                value={value}
                onChange={handleTabChanged}
                aria-label="login options tabs"
              >
                <Tab label="Login" {...a11yProps(0)} />
                <Tab label="Register" {...a11yProps(1)} />
              </Tabs>
              <TabPanel value={value} index={0}>
                <LoginForm {...props} closeModal={toggleModalState} />
              </TabPanel>
              <TabPanel value={value} index={1}>
                <RegisterForm {...props} closeModal={toggleModalState} />
              </TabPanel>
            </CardContent>
          </Card>
        </Modal>
      </div>
    );
  } else {
    return (
      <div>
        <Button
          variant="contained"
          className="header-login-btn"
          color="secondary"
          onClick={handleLogout}
        >
          Logout
        </Button>
      </div>
    );
  }
}

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box className="login-tab-panel" sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};
