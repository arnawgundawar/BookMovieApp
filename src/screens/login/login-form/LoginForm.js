import { TextField, Button } from "@material-ui/core";
import { useEffect, useState } from "react";
import { useUserUpdate, useUser } from "../../../common/user-context/UserContext";
import { AuthService } from "../../../services/AuthService";

export default function LoginForm(props) {
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [isValid, setIsValid] = useState(false);
  const [form, setFormState] = useState({
    email: "",
    emailError: false,
    password: "",
    passwordError: false,
  });

  useEffect(() => {
    if (form.emailError || form.passwordError || isFirstLoad) {
      setIsValid(false);
    } else {
      setIsValid(true);
    }
  }, [form, isFirstLoad]);

  const user = useUser();
  const updateUser = useUserUpdate();

  function validateEmail(email) {
    const pattern =
      /[a-zA-Z0-9]+[.]?([a-zA-Z0-9]+)?[@][a-z]{3,9}[.][a-z]{2,5}/g;
    return !pattern.test(email);
  }

  function handleChange(e) {
    const target = e.target;
    const value = target.value;
    const name = target.name;
    let passwordError = form.passwordError;
    let emailError = form.emailError;
    if (target.name === "email") {
      emailError = validateEmail(e.target.value);
    }
    if (target.name === "password") {
      if (!target.value?.length > 0 || target.value === null) {
        passwordError = true;
      } else {
        passwordError = false;
      }
    }
    if (isFirstLoad) {
      setIsFirstLoad(false);
    }
    setFormState({
      ...form,
      [name]: value,
      passwordError: passwordError,
      emailError: emailError,
    });
  }

  function onLoginClicked() {
    if (form.password?.length === 0) {
      setFormState({
        ...form,
        passwordError: true,
      });
      return;
    } else {
      // AuthService.login(form.email, form.password).then((user) => {
      //   if (user) {
      //     // updateUser({
      //     //   accessToken: user.accessToken,
      //     //   emailAddress: user.emailAddress,
      //     //   firstName: user.firstName,
      //     //   lastName: user.lastName,
      //     //   id: user.id,
      //     // });
      //     console.log(user);
      //     // props.closeModal();
      //   }
      // });

      // Login url for some reason keeps giving CORS error and no way to register
      // so check if mock registered else direct login
      const dummyUser = {
        accessToken: "testToken",
        emailAddress: user?.emailAddress ? user.emailAddress : "",
        firstName: user?.firstName ? user.firstName : "test",
        id: user?.id ? user.id :"test",
        lastLoginTime: "test",
        lastName: user?.lastName ? user.lastName : "test",
      };
      updateUser({
        accessToken: dummyUser.accessToken,
        emailAddress: dummyUser.emailAddress,
        firstName: dummyUser.firstName,
        lastName: dummyUser.lastName,
        id: dummyUser.id,
      });
      props.closeModal();
    }
  }

  return (
    <>
      <TextField
        id="email"
        label="Email"
        required
        margin="normal"
        align="center"
        name="email"
        error={form.emailError}
        helperText={form.emailError ? "Enter a valid email" : ""}
        onChange={handleChange}
      />
      <TextField
        id="password"
        label="Password"
        required
        margin="normal"
        type="password"
        name="password"
        error={form.passwordError}
        helperText={form.passwordError ? "Enter a password" : ""}
        onChange={handleChange}
      />
      <Button
        variant="contained"
        color="primary"
        style={{ marginTop: "36px" }}
        onClick={onLoginClicked}
        disabled={!isValid}
      >
        Login
      </Button>
    </>
  );
}
