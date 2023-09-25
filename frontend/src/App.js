import Nav from "./components/Nav.js";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import Footer from "./components/Footer.js";
import Signup from "./components/Signup.js";
import PrivateComponent from "./components/PrivateComponent.js";
import Logout from "./components/Logout.js";
import Login from "./components/Login.js";
import Error from "./components/Error.js";
import AddProduct from "./components/AddProduct.js";
import ProductList from "./components/ProductList.js";
import UpdateProd from "./components/UpdateProd.js";
function App() {
  return (
    <div className="App">
      <Nav />
      <Routes>
        <Route element={<PrivateComponent />}>
          <Route path="/" element={<ProductList />} />
          <Route path="/add" element={<AddProduct />} />
          <Route path="/update/:id" element={<UpdateProd />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/profile" element={<h1>Profile Component</h1>} />
        </Route>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Error />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
