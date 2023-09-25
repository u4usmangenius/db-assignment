const express = require("express");
const crypto = require("crypto");
const app = express();
const cors = require("cors");
require("./db/config");

const con = require("./db/users");
const product_con = require("./db/products");

const Product = require("./db/product");
const port = 8080;
const Jwt = require("jsonwebtoken");
const jwtKey = "e-comm";

app.use(cors());
app.use(express.json());
app.post("/sign-in", async (req, res) => {
  const data = [req.body.email, req.body.password];
  con.query(
    "select id,name,email from users where email=? and password=?",
    data,
    (err, result) => {
      if (result) {
        let objarray = JSON.stringify(result);
        let user = JSON.parse(objarray);
        // console.log(objarray);
        if (user.length === 0) {
          res.status(401).send({ result: "No User Exist" });
        } else {
          Jwt.sign({ user }, jwtKey, { expiresIn: "4h" }, (err, token) => {
            if (err) {
              res
                .status(404)
                .send({ result: "Something went wrong, try again later" });
            }
            let users = result;
            user = users;
            res.status(200).send({ user, auth: token });
            // res.status(200).send(result);
          });
        }
      } else {
        res.status(401).send({ result: "No Result Found" });
      }
    }
  );
});
// Users Login/singup
// here removed verifyToken because when we login we store logined user info in localstorage but for the first time
// when he try to login then user has nothing in its localstorage so how we will be verify it, or we need to take token
// from user manually using input like email and password
app.post("/signup", async (req, res) => {
  const sql = "select * from users where email=?";
  const email = req.body.email;
  const id = crypto.randomUUID();
  con.query(sql, [email], (err, result) => {
    if (err) {
      console.log(err);
    } else {
      if (result.length > 0) {
        res.status(200).send({ exists: true });
      } else {
        const data = {
          id,
          name: req.body.name,
          email: req.body.email,
          password: req.body.password,
        };
        let user_array = [
          { id: id, name: req.body.name, email: req.body.email },
        ];
        let objarray = JSON.stringify(user_array);
        let user = JSON.parse(objarray);
        console.log("usman", data);
        console.log("tahir<<ir>>>", user);
        con.query("insert into users set ?", data, (err, result, fields) => {
          if (err) {
            res.status(404).send(err);
          } else {
            Jwt.sign({ user }, jwtKey, { expiresIn: "4h" }, (err, token) => {
              if (err) {
                res
                  .status(404)
                  .send({ result: "Something went wrong, try again later" });
              }
              res.status(200).send({ user, auth: token });
              // res.status(200).send(result);
            });
          }
        });
      }
    }
  });
});

// Products
app.post("/insert-product", verifyToken, async (req, res) => {
  const id = crypto.randomUUID();
  const data = {
    id: id,
    userId: req.body.userId,
    name: req.body.name,
    price: req.body.price,
    category: req.body.category,
    company: req.body.company,
  };
  console.log(data);
  product_con.query(
    "insert into products set ?",
    data,
    async (err, result, fields) => {
      if (err) {
        console.log(`Not find`);
        res.status(401).send(err);
      } else {
        // let product = await JSON.stringify(result);
        // product = JSON.parse(product);
        res.status(200).send(result);
      }
    }
  );
});
// enlist Products
app.get("/enlist-products", verifyToken, async (req, res) => {
  const sql = "select * from products";
  product_con.query(sql, (err, result) => {
    if (err) {
      console.log(err);
      res.status(404).send("error");
    } else {
      if (result.length > 0) {
        res.status(200).send(result);
        console.log(result);
      }
    }
  });
});
// delete Product
app.delete("/enlisted-products/:id", verifyToken, async (req, res) => {
  const id = req.params.id;
  console.log("usman===>>>", id);
  const query = "DELETE FROM products WHERE id = ?";
  product_con.query(query, [id], (err, results) => {
    if (err) {
      console.error(err);
      return;
    }
    if (results.affectedRows === 0) {
      console.log("No product was deleted");
      res.status(404).json({ error: "Unable to find your id" });
    } else {
      res.status(200).send({ Response: "Deleted,Done" });
      console.log("Product was deleted");
    }
  });
});

// Update Product ,First Get it
app.get("/product/:id", verifyToken, async (req, res) => {
  const data = [req.params.id];
  product_con.query("select * from products where id=?", data, (err, result) => {
    if (result) {
      let objarray = JSON.stringify(result);
      console.log("usman here", result);
      res.status(200).send(result);
    } else {
      console.log(`error`);
    }
  });
});
app.put("/product/:id", verifyToken, async (req, res) => {
  const data = [
    req.body.name,
    req.body.price,
    req.body.category,
    req.body.company,
    req.params.id,
  ];
  product_con.query(
    "UPDATE products SET name=?,price=?,category=?,company=? where id=?  ",
    data,
    (err, result) => {
      if (result) {
        res.status(200).send(result);
      } else {
        console.log(`error`, err);
        res.status(404).send(result);
      }
    }
  );
});

// Search for product any field
app.get("/find-any/:key", verifyToken, (req, res) => {
  const key = req.params.key;
  const query = `
    SELECT * FROM products
    WHERE name REGEXP ?
    OR price REGEXP ?
    OR category REGEXP ?
    OR company REGEXP ?
  `;

  const params = [key, key, key, key];

  product_con.query(query, params, (error, results) => {
    if (error) {
      res.status(500).send(error.message);
    } else {
      const jsonResult = JSON.stringify(results);
      console.log(jsonResult);
      res.status(200).send(jsonResult);
    }
  });
}); // Verify Token
function verifyToken(req, res, next) {
  let token = req.headers["authorization"];
  if (token) {
    token = token.split(" ")[1];
    // console.log(token);
    Jwt.verify(token, jwtKey, (err, valid) => {
      if (err) {
        res.status(401).send({ result: "Please Provide Valid Token" });
      } else {
        next();
        console.log(token);
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
