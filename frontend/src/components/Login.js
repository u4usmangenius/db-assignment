import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
const Login = () => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [isValid, setIsValid] = React.useState(true);
  const [error, setError] = React.useState(false);
  const [emailerror] = React.useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const auth = localStorage.getItem("user");
    if (auth) {
      navigate("/");
    }
  }, [navigate]);

  const handlePassword = (event) => {
    let password = event.target.value;
    console.log(password)
    setPassword(password);
  };
  //   ******** Matching Login Details *********** //
  const handleLogin = async () => {
    let result = await fetch("http://localhost:8080/sign-in", {
      method: "post",
      body: JSON.stringify({ email, password }),
      headers: {
        "Content-type": "application/json",
      },
    });
    result = await result.json();
    // console.log(result);
    if (result.auth) {
      localStorage.setItem("user", JSON.stringify(result.user));
      localStorage.setItem("token", JSON.stringify(result.auth));
      navigate("/");
    } else {
      alert("Invalid Login Credentials");
    }
  };
  const checkdata = () => {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const test_email = pattern.test(email);
    if (!email || !password) {
      setError(true);
      // setEmailError(false)
      return false;
    } else {
      if (test_email) {
        handleLogin();
      } else {
        // setEmailError(true)
        //  setError(false)
        setError(true);
        return false;
      }
    }
  };
  const handleEmail = (event) => {
    let email = event.target.value;
    console.log(email)
    setEmail(email);
    setIsValid(validateEmail(email));
  };
  const validateEmail = (email) => {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(email);
  };
  return (
    <div className="login">
      <h1>Login</h1>
      <input
        type="email"
        className="inputBox"
        value={email}
        onChange={handleEmail}
        placeholder="Enter Your Email"
      />{" "}
      {error && (
        <p className="invalid-input">Please enter your valid email address.</p>
      )}
      {emailerror && (
        <p id="get-error2" className="invalid-input">
          Please enter your valid email address.
        </p>
      )}
      <input
        type="password"
        className="inputBox"
        value={password}
        onChange={handlePassword}
        placeholder="Enter Your Password"
      />
      {error && !password && (
        <p className="invalid-input">Please enter your password.</p>
      )}
      <button
        className="appButton"
        onClick={checkdata}
        // onClick={handleLogin}
        type="button"
      >
        Login
      </button>
      <h3 className="no-account-heading">
        Not have an account
        <Link to="/signup" className="no-account-subheading">
          Click Here
        </Link>
      </h3>
    </div>
  );
};

export default Login;
