import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom"; //useNavigate is a hook
const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isValid, setIsValid] = useState(true);
  const [error, setError] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const auth = localStorage.getItem("user");
    if (auth) {
      navigate("/");
    }
  });
  const collect = async () => {
    let result = await fetch("http://localhost:8080/signup", {
      method: "post",
      body: JSON.stringify({ name, email, password }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    result = await result.json();
    // result=JSON.stringify(result)
    if (result.exists) {
      console.log(`this email is already exist in our database`);
      alert(`This email is already exist, please use another one`);
      return;
    } else {
      // alert(`This email is available`);
      navigate("/");
    }
    localStorage.setItem("user", JSON.stringify(result.user));
    localStorage.setItem("token", JSON.stringify(result.auth));
  };
  const collectData = () => {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const test_email = pattern.test(email);
    if (!name || !email || !password) {
      setError(true);
      return false;
    } else {
      if (test_email) {
        collect();
      } else {
        setError(true);
        return false;
      }
    }
  };
  const validateEmail = (email) => {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(email);
  };

  const handleEmailChange = (event) => {
    const newEmail = event.target.value;
    setEmail(newEmail);
    setIsValid(validateEmail(newEmail));
  };
  return (
    <div className="register">
      <h1>Register</h1>
      <input
        className="inputBox"
        value={name}
        onChange={(e) => setName(e.target.value)}
        type="text"
        placeholder="Enter Your Name"
      />
      {error && !name && (
        <p className="invalid-input">Please enter your name.</p>
      )}
      <input
        className="inputBox"
        value={email}
        // onChange={(e) => setEmail(e.target.value)}
        onChange={handleEmailChange}
        type="email"
        placeholder="Enter Your Email"
      />
      {error && (
        <p className="invalid-input">Please enter a valid email address.</p>
      )}
      <input
        className="inputBox"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Enter Your Password"
      />
      {error && !password && (
        <p className="invalid-input">Please enter your password.</p>
      )}
      <button onClick={collectData} className="appButton" type="button">
        Signup
      </button>
      <h3 className="no-account-heading">
        Have an account
        <Link to="/login" className="no-account-subheading">
          Click Here
        </Link>
      </h3>
    </div>
  );
};

export default Signup;
