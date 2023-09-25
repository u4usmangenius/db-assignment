import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  useEffect(() => {
    getProducts();
  }, []);
  const getProducts = async () => {
    let result = await fetch("http://localhost:8080/enlist-products", {
      headers: {
        authorization: `bearer ${JSON.parse(localStorage.getItem("token"))}`,
      },
    });
    result = await result.json();
    setProducts(result);
  };
  const deleteProduct = async (id) => {
    let result = await fetch(`http://localhost:8080/enlisted-products/${id}`, {
      method: "DELETE",
      headers: {
        authorization: `bearer ${JSON.parse(localStorage.getItem("token"))}`,
      },
    });
    result = await result.json();
    if (result) {
      getProducts();
    }
  };
  const searchHandle = async (event) => {
    let key = event.target.value;
    if (key) {
      let result = await fetch(`http://localhost:8080/find-any/${key}`, {
        headers: {
          authorization: `bearer ${JSON.parse(localStorage.getItem("token"))}`,
        },
      });
      result = await result.json();
      if (result) {
        setProducts(result);
      }
    } else {
      getProducts();
    }
  };
  return (
    <div className="product-list">
      <h1>
        Product List
        <input
          type="search"
          className="search-product-box"
          placeholder="Search Product"
          onChange={searchHandle}
        ></input>
      </h1>
      <ul id="list-heading">
        <li>S.no</li>
        <li>Name</li>
        <li>Price</li>
        <li>Category</li>
        <li>Company</li>
        <li>Delete</li>
        <li>Update</li>
      </ul>
      {products.length > 0 ? (
        products.map((item, index) => (
          <ul key={item._id}>
            <li>{index + 1}</li>
            <li>{item.name}</li>
            <li>{item.price}</li>
            <li>{item.category}</li>
            <li>{item.company}</li>

            <li>
              <button
                onClick={() => deleteProduct(item.id)}
                className="product-btn"
              >
                Delete
              </button>
            </li>
            <li>
              <Link to={"/update/" + item.id}>
                <button id="product-btn" className="product-btn">
                  Update
                </button>
              </Link>
            </li>
            {/* <button onClick={updatebelow}>update</button> */}
          </ul>
        ))
      ) : (
        <h1 className="animate-all search-not-found">No Product Found</h1>
      )}
      {/* <div id="below-button">
                <input type="text" placeholder="enter" />
                <input type="text" placeholder="enter" />
                <input type="text" placeholder="enter" />
              </div> */}
    </div>
  );
};

export default ProductList;
