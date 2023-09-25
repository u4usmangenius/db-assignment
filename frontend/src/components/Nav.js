import React from "react";
import { Link, useNavigate } from "react-router-dom";
import img from "../assest/logo.png";
const Nav = () => {
  const navigate = useNavigate();
  const auth = localStorage.getItem("user");
  const logout = () => {
    navigate("/logout");
  };

  return (
    <div>
      {/* usman nav class is created by you so be careful */}
      <div className="nav">
        {auth ? (
          <ul className="nav-ul">
            <div className="logo">
              {" "}
              <Link to="/">
                <img src={img} alt="logo" />
              </Link>
            </div>
            <Link to="/">
              <li>Products</li>
            </Link>
            <Link to="/add">
              <li>Add Product</li>
            </Link>
            {/* <Link to="/update/:id">
              <li>Update Product</li>
            </Link> */}
            {/* <Link to="/profile">
              <li>Profile</li>
            </Link> */}
            <Link onClick={logout} to="/logout">
              <li>Logout</li>
            </Link>
          </ul>
        ) : (
          <ul className="nav-ul ">
            <div className="logo">
              <Link to="/">
                <img src={img} alt="logo" />
              </Link>
            </div>
            <Link to="/signup">
              <li>Signup</li>
            </Link>
            <Link to="/login">
              <li>Login</li>
            </Link>
          </ul>
        )}
      </div>
    </div>
  );
};

export default Nav;
