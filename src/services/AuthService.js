export const AuthService = {
  baseUrl: "http://localhost:8085/api/v1/auth/",
  login(email, password) {
    const url = this.baseUrl + 'login';
    const authData = Buffer.from(email + ":" + password).toString("base64");
    const requestOptions = {
      method: "POST",
      headers: {
        Accept: "application/json;charset=UTF-8",
        authorization: "Basic " + authData,
      },
    };
    return fetch(url, requestOptions).then(
      (response) => {
        if (!response.ok) {
          alert("Login Failed! Incorrect username/password.");
          return false;
        }
        return response.json();
      },
      (error) => {
        console.log(error);
      }
    );
  },
  logout(accessToken) {
    const url = this.baseUrl + "logout";
    const reqHeaders = new Headers({
      Authorization: "Bearer " + accessToken,
    });
    const requestOptions = {
      method: "POST",
      headers: reqHeaders,
    };
    fetch(url, requestOptions);
  },
};
