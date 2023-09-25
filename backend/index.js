const express = require("express");
const app = express();
const cors = require("cors");
require("./db/config");
const User = require("./db/User");
const Product = require("./db/products");
const port = 1000;
const Jwt = require("jsonwebtoken");
const jwtKey = "e-comm";

app.use(cors());
app.use(express.json());

// Users Login/singup
// here removed verifyToken because when we login we store logined user info in localstorage but for the first time
// when he try to login then user has nothing in its localstorage so how we will be verify it, or we need to take token
// from user manually using input like email and password
app.post("/register", async (req, res) => {
  const email = req.body.email;
  let user = await User.findOne({ email });
  if (user) {
    //this email is already exists
    res.status(200).send({ exists: true });
  } else {
    // the email entered by user does not exist in our database so this can be inserted
    let data = new User(req.body);
    let user = await data.save();
    user = user.toObject();
    delete user.password;
    Jwt.sign({ user }, jwtKey, { expiresIn: "4h" }, (err, token) => {
      if (err) {
        res.status(404).send({ user: "Something went wrong, try again later" });
      }
      res.status(200).send({ user, auth: token });
    });
  }
});

// here remove middleware
app.post("/login", async (req, res) => {
  if (req.body.email && req.body.password) {
    let user = await User.findOne(req.body).select("-password");
    if (user) {
      // Jwt.sign({ user }, jwtKey,  (err, token) => {
      Jwt.sign({ user }, jwtKey, { expiresIn: "3h" }, (err, token) => {
        if (err) {
          res
            .status(404)
            .send({ result: "Something went wrong, try again later" });
        }
        res.status(200).send({ user, auth: token });
      });
    } else {
      res.status(404).send({ result: "No User Found" });
    }
  } else {
    res.status(404).send({ result: "No User Found" });
  }
});

// Products
app.post("/add-product", verifyToken, async (req, res) => {
  let product = new Product(req.body);
  let result = await product.save();
  res.status(200).send(result);
});
// enlist Products
app.get("/products", verifyToken, async (req, res) => {
  let products = await Product.find();
  if (products.length > 0) {
    res.status(200).send(products);
  } else {
    res.status(204).send({ result: "No Products Found" });
  }
});
// delete Product
app.delete("/product/:id", verifyToken, async (req, res) => {
  const result = await Product.deleteOne({ _id: req.params.id });
  res.status(200).send(result);
});
// Update Product ,First Get it
app.get("/product/:id", verifyToken, async (req, res) => {
  let result = await Product.findOne({ _id: req.params.id });
  if (result) {
    res.status(200).send(result);
  } else {
    res.status(204).send({ result: "No Record Found" });
  }
});
// Now update it

app.put("/product/:id", verifyToken,async (req, res) => {
  let result = await Product.updateOne(
    { _id: req.params.id },
    {
      $set: req.body,
    }
  );

  res.status(200).send(result);
});
// Search for product any field
app.get("/search/:key", verifyToken, async (req, res) => {
  let result = await Product.find({
    // for searching in more than one field we use or in regex
    $or: [
      { name: { $regex: req.params.key } },
      { price: { $regex: req.params.key } },
      { category: { $regex: req.params.key } },
      { company: { $regex: req.params.key } },
    ],
  });
  res.status(200).send(result);
});
// Verify Token
function verifyToken(req, res, next) {
  let token = req.headers["authorization"];
  if (token) {
    // the space is must in split(' ') in this brackets, one other thing use bearer always and change your token regularly
    token = token.split(" ")[1];
    // console.log(token);
    Jwt.verify(token, jwtKey, (err, valid) => {
      if (err) {
        res.status(401).send({ result: "Please Provide Valid Token" });
      } else {
        next();
        console.log(token)
      }
    });
  } else {
    res.status(403).send({ result: "Please add token with header" });
  }
}

app.listen(port, () => {
  console.log(`Backend Running at htttp://localhost:${port}`);
});
// sds
