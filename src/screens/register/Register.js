import { TextField, Button, Typography } from "@material-ui/core";
import { useEffect, useState } from "react";
import { useUserUpdate } from "../../common/user-context/UserContext";
import { AuthService } from "../../services/AuthService";

export default function RegisterForm(props) {
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [isValid, setIsValid] = useState(false);
  const [form, setFormState] = useState({
    email: "",
    emailError: false,
    password: "",
    passwordError: false,
    firstName: "",
    firstNameError: false,
    lastName: "",
    lastNameError: false,
    mobile: "",
    mobileError: false,
    isRegisterSuccess: false
  });

  const updateUser = useUserUpdate();

  useEffect(() => {
    if (
      form.emailError ||
      form.passwordError ||
      form.firstNameError ||
      form.lastNameError ||
      form.mobileError ||
      isFirstLoad
    ) {
      setIsValid(false);
    } else {
      setIsValid(true);
    }
  }, [form, isFirstLoad]);

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
    let firstNameError = form.firstNameError;
    let lastNameError = form.lastNameError;
    let mobileError = form.mobileError;
    if (target.name === "email") {
      emailError = validateEmail(e.target.value);
    }
    if (target.name === "firstName") {
      if (!target.value?.length > 0 || target.value === null) {
        firstNameError = true;
      } else {
        firstNameError = false;
      }
    }
    if (target.name === "lastName") {
      if (!target.value?.length > 0 || target.value === null) {
        lastNameError = true;
      } else {
        lastNameError = false;
      }
    }
    if (target.name === "mobile") {
      // if (target.value?.length < 10 || target.value === null) {
      //   mobileError = true;
      // } else {
      mobileError = false;
      // }
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
      firstNameError: firstNameError,
      lastNameError: lastNameError,
      mobileError: mobileError,
    });
  }

  function onRegisterClicked() {
    // THERE IS NO ENDPOINT TO REGISTER USER

    // const url = "http://localhost:8085/api/v1/users/register";
    // const userData = {
    //   firstName: form.firstName,
    //   lastName: form.lastName,
    //   emailId: form.email,
    //   password: form.password,
    //   mobile: form.mobile,
    // };
    // const requestOptions = {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify(userData),
    // };
    // fetch(url, requestOptions)
    //   .then(
    //     (response) => {
    //       if (response.ok) {
    //         alert("Registration successful!");
    //         loginRegisteredUser(userData.emailId, userData.password);
    //         props.closeModal();
    //       } else {
    //         return response.json();
    //       }
    //     },
    //     (error) => {
    //       console.log(error);
    //     }
    //   )
    //   .then((data) => {
    //     if (data) {
    //       let alertMessage = "Uh-oh! Registration failed! ";
    //       if (data?.root_cause?.indexOf("User exists!") !== -1) {
    //         alertMessage = alertMessage.concat(
    //           "\nA user with this email already exists. Login if registered."
    //         );
    //         setFormState({
    //           ...form,
    //           emailError: true,
    //         });
    //       } else if (data?.root_cause?.indexOf("Mobile") !== -1) {
    //         alertMessage = alertMessage.concat(" Check your mobile number!");
    //         setFormState({
    //           ...form,
    //           mobileError: true,
    //         });
    //       }
    //       alert(alertMessage);
    //     }
    //   });

    // verify if password present
    if(form.password.length === 0) {
      setFormState({
        ...form,
        passwordError: true,
        isRegisterSuccess: false
      });
      return;
    }

    // MOCK REGISTER
    const userData = {
      firstName: form.firstName,
      lastName: form.lastName,
      emailAddress: form.email,
      id: "someId",
    };

    updateUser({...userData});
    setFormState({
      ...form,
      isRegisterSuccess: true
    });
  }

  function loginRegisteredUser(email, password) {
    AuthService.login(email, password).then((user) => {
      if (user) {
        updateUser({
          accessToken: user.accessToken,
          emailAddress: user.emailAddress,
          firstName: user.firstName,
          lastName: user.lastName,
          id: user.id,
        });
        props.closeModal();
      }
    });
  }

  return (
    <>
      <TextField
        id="firstName"
        label="First Name"
        required
        margin="normal"
        name="firstName"
        error={form.firstNameError}
        helperText={form.firstNameError ? "Enter a firstName" : ""}
        onChange={handleChange}
      />
      <TextField
        id="lastName"
        label="Last Name"
        required
        margin="normal"
        name="lastName"
        error={form.lastNameError}
        helperText={form.lastNameError ? "Enter a lastName" : ""}
        onChange={handleChange}
      />
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
      <TextField
        id="mobile"
        label="Mobile"
        required
        margin="normal"
        name="mobile"
        type="number"
        inputProps={{ maxLength: 10 }}
        onInput={(e) => {
          e.target.value = Math.max(0, parseInt(e.target.value))
            .toString()
            .slice(0, 10);
        }}
        error={form.mobileError}
        helperText={form.mobileError ? "Enter a 10 digit mobile" : ""}
        onChange={handleChange}
      />
      {form.isRegisterSuccess ? <Typography>Registration successful. Please Login!</Typography> : ""}
      <Button
        variant="contained"
        color="primary"
        style={{ marginTop: "36px" }}
        onClick={onRegisterClicked}
        disabled={!isValid}
      >
        Register
      </Button>
    </>
  );
}
