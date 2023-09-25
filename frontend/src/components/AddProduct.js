import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
const AddProduct = () => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [company, setCompany] = useState("");
  const [error, setError] = useState(false);
  const navigate = useNavigate();
  const handleName = (event) => {
    const name = event.target.value;
    setName(name);
  };
  const handlePrice = (event) => {
    const price = event.target.value;
    setPrice(price);
  };
  const handleCategory = (event) => {
    const category = event.target.value;
    setCategory(category);
  };
  const handleCompany = (event) => {
    const company = event.target.value;
    setCompany(company);
  };
  const handleAddProduct = async () => {
    if (!name || !price || !category || !company) {
      setError(true);
      return false;
    }
    const userId = JSON.parse(localStorage.getItem("user"))[0].id;
    console.log("usman=====>>>>>>>>", userId);
    let result = await fetch("http://localhost:8080/insert-product", {
      method: "post",
      body: JSON.stringify({ userId, name, price, category, company }),
      headers: {
        "Content-Type": "application/json",
        authorization: `bearer ${JSON.parse(localStorage.getItem("token"))}`,
      },
    });
    result = await result.json();
    // console.warn(result);
    if (result) {
      // navigate("/");
      // alert(`Product added`);
      displayMessage("Product Added Successfully");
    }
  };
  function displayMessage(message) {
    const element = document.getElementById("added-product-message");
    element.classList.add("animate-all");
    // element.className += "add-product-btn";
    element.innerHTML = message;
    setName("");
    setPrice("");
    setCategory("");
    setCompany("");
    setError(false);
    setTimeout(() => {
      element.innerHTML = "";
      element.classList.remove("animate-all");
    }, 3000);
  }
  return (
    <div className="product ">
      <h1>Add Product</h1>
      <input
        type="text"
        value={name}
        onChange={handleName}
        placeholder="Enter Product Name"
        className="inputBox"
      />
      {error && !name && (
        <span className="invalid-input">Please Enter Name</span>
      )}
      <input
        type="text"
        value={price}
        onChange={handlePrice}
        placeholder="Enter Product Price"
        className="inputBox"
      />
      {error && !price && (
        <span className="invalid-input">Please Enter Price</span>
      )}
      <input
        type="text"
        value={category}
        onChange={handleCategory}
        placeholder="Enter Product Category"
        className="inputBox"
      />
      {error && !category && (
        <span className="invalid-input">Please Enter Category</span>
      )}
      <input
        type="text"
        value={company}
        onChange={handleCompany}
        placeholder="Enter Product Company"
        className="inputBox"
      />
      {error && !company && (
        <span className="invalid-input">Please Enter Company </span>
      )}
      <button type="button" onClick={handleAddProduct} className="appButton ">
        Add Product
      </button>
      <div id="added-product-message"></div>
    </div>
  );
};

export default AddProduct;
