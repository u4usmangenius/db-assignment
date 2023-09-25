const mysql = require("mysql");
const product_con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "ecommerce",
});
product_con.connect((err) => {
  if (err) {
    console.log(err);
  } else {
    console.log(`connected`);
  }
});
  module.exports = product_con;
