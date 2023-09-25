import React from "react";
import { Link, useNavigate } from "react-router-dom";
const Logout = () => {
  const navigate = useNavigate();
  const auth = localStorage.getItem("user");
  const user = JSON.parse(auth);
  let name1 = user[0];
  const name = name1.name;
  console.log("your name is", name);
  const logedout = () => {
    localStorage.clear();
    navigate("/signup");
    console.log(`Successfully logout`);
  };
  const log_out = () => {
    const element = document.getElementsByClassName("logbtn-hide")[0];
    element.className += "add-login-btn";
  };
  return (
    <div className="logout">
      <div className="user-name">
        <h1 className="user-name-heading"> {name} </h1>
        <h1>Logout is here</h1>
      </div>
      {/* <button>Click Here</button> */}
      {auth ? (
        <button onClick={log_out} className="logout-btn">
          Logout
        </button>
      ) : (
        <Link to="/signup">Signup</Link>
      )}

      <h3>
        <Link to="/signup">
          <button className="logout-btn logbtn-hide" onClick={logedout}>
            Sure
          </button>
        </Link>
      </h3>
    </div>
  );
};

export default Logout;
