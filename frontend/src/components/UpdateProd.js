import { React, useEffect, useState } from "react";
import { useActionData, useNavigate, useParams } from "react-router-dom";
const UpdateProd = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [company, setCompany] = useState("");
  const params = useParams();
  useEffect(() => {
    getProductDetails();
  }, []);
  const getProductDetails = async () => {
    let result = await fetch(`http://localhost:8080/product/${params.id}`, {
      headers: {
        authorization: `bearer ${JSON.parse(localStorage.getItem("token"))}`,
      },
    });
    try {
      result = await result.json();
    } catch (err) {
      console.log(err);
      return;
    }
    // alert(result)
    const { name, price, category, company } = result[0];
    console.log(company);
    setName(name);
    setPrice(price);
    setCategory(category);
    setCompany(company);
  };
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
  const updateProduct = async () => {
    if (params.id == ":id") {
      return;
    }
    let result = await fetch(`http://localhost:8080/product/${params.id}`, {
      method: "Put",
      body: JSON.stringify({ name, price, category, company }),
      headers: {
        "Content-Type": "application/json",
        authorization: `bearer ${JSON.parse(localStorage.getItem("token"))}`,
      },
    });
    result = await result.json();
    if (result) {
      navigate("/");
    }
  };
  return (
    <div className="product ">
      <h1>Update Product</h1>
      <input
        type="text"
        value={name}
        onChange={handleName}
        placeholder="Enter Product Name"
        className="inputBox"
      />
      <input
        type="text"
        value={price}
        onChange={handlePrice}
        placeholder="Enter Product Price"
        className="inputBox"
      />
      <input
        type="text"
        value={category}
        onChange={handleCategory}
        placeholder="Enter Product Category"
        className="inputBox"
      />
      <input
        type="text"
        value={company}
        onChange={handleCompany}
        placeholder="Enter Product Company"
        className="inputBox"
      />
      <button type="button" onClick={updateProduct} className="appButton ">
        update Product
      </button>
      <div id="added-product-message"></div>
    </div>
  );
};

export default UpdateProd;
