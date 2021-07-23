import React, { useState } from "react";
import { login_auth } from "../api/httpHelper";
import cookie from "react-cookies";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";

const Login = (props) => {
  const [showingAlert, setShowingAlert] = useState(false);
  const [nameError, setNameError] = useState(false);
  const [passError, setPassError] = useState(false);
  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  function handleChange({ target }) {
    setLoginData({
      ...loginData,
      [target.name]: target.value,
    });
  }

  function handleSubmit(event) {
    if (loginData.username === "") {
      setNameError(true);
      setTimeout(() => {
        setNameError(false);
      }, 2000);
    }
    if (loginData.password === "") {
      setPassError(true);
      setTimeout(() => {
        setPassError(false);
      }, 2000);
    }
    event.preventDefault();
    (async () => {
      setLoading(true);
      var UserModel = {
        Username: loginData.username,
        Password: loginData.password,
        id_firme: 6,
      };
      var response = await login_auth(UserModel);
      if (response.data.token !== "") {
        const getAccessToken = () => cookie.load("jwtToken");
        if (!!getAccessToken()) {
          setLoading(false);
          props.history.push("/reglerilist");
        }
      } else {
        setShowingAlert(true);
        setTimeout(() => {
          setShowingAlert(false);
        }, 2000);
        resetFields();
      }
    })();
  }
  function resetFields() {
    setLoginData({
      username: "",
      password: "",
    });
  }

  return (
    <div style={{ paddingTop: "100px" }}>
      <Backdrop style={{ zIndex: 9999, color: "#fe661d" }} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <h2 style={{ fontFamily: "revert", color: "#fe661d" }}>Login</h2>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Korisničko ime:</label>
          <div className="field">
            <input
              id="username"
              type="text"
              onChange={handleChange}
              name="username"
              className="form-control"
              value={loginData.username}
            />
          </div>
          <label htmlFor="password">Lozinka:</label>
          <div className="field">
            <input
              id="password"
              type="password"
              onChange={handleChange}
              name="password"
              className="form-control"
              value={loginData.password}
            />
          </div>
          <br />
          <input
            type="submit"
            value="PRIJAVA"
            className="btn"
            style={{
              width: "100%",
              background: "#fe661d",
              color: "#fff",
            }}
          />
        </div>
        <div
          className="alert alert-danger"
          style={{
            display: showingAlert ? "block" : "none",
            marginTop: "10px",
          }}
        >
          <strong>Greška:</strong> Pogrešno korisničko ime ili lozinka.
        </div>
        <div
          className="alert alert-warning"
          style={{
            display: nameError ? "block" : "none",
            marginTop: "10px",
          }}
        >
          <strong>Greška:</strong> Korisničko ime nije uneto.
        </div>
        <div
          className="alert alert-warning"
          style={{
            display: passError ? "block" : "none",
            marginTop: "10px",
          }}
        >
          <strong>Greška:</strong> Lozinka nije uneta.
        </div>
      </form>
    </div>
  );
};

export default Login;
