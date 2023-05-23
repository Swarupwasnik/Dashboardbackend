const express = require("express");
const app = express();
require("./db/config");
const User = require("./db/user");
const Product = require("./db/addProduct");
const Jwt = require("jsonwebtoken");
const jwtKey = "backend";

const cors = require("cors");

app.use(express.json());
app.use(cors());

//Signup
app.post("/signin", async (req, res) => {
  let user = new User(req.body);
  let result = await user.save();
  result = result.toObject();
  delete result.password;
  Jwt.sign({ result }, jwtKey, { expiresIn: "2h" }, (err, token) => {
    if (err) {
      res.send({
        result: "Something went wrong,please Try after sometime",
      });
    }
    res.send({ result, auth: token });
  })
});

// Login
app.post("/login", async (req, res) => {
  console.log(req.body);
  if (req.body.password && req.body.email) {
    let user = await User.findOne(req.body).select("-password");
    if (user) {
      Jwt.sign({ user }, jwtKey, { expiresIn: "2h" }, (err, token) => {
        if (err) {
          res.send({
            result: "Something went wrong,please Try after sometime",
          });
        }
        res.send({ user, auth: token });
      });
    } else {
      res.send({ result: "no user Found" });
    }
  } else {
    res.send({ result: "no user found" });
  }
});

//ADD PRODUCT
app.post("/addproduct", async (req, res) => {
  let product = new Product(req.body);
  let result = await product.save();
  res.send(result);
});

// LISTING

app.get("/products", async (req, res) => {
  let products = await Product.find();
  if (products.length > 0) {
    res.send(products);
  } else {
    res.send({ result: "no Products Found" });
  }
});

// DELETE
app.delete("/products/:id", async (req, resp) => {
  const result = await Product.deleteOne({ _id: req.params.id });
  resp.send(result);
});

//UPDATE
app.get("/products/:id", async (req, res) => {
  let result = await Product.findOne({ _id: req.params.id });
  if (result) {
    res.send(result);
  } else {
    res.send({ result: "No record found." });
  }
});

// UPDATEPRODUCT

app.put("/products/:id", async (req, res) => {
  let result = await Product.updateOne(
    { _id: req.params.id },
    {
      $set: req.body,
    }
  );
  res.send(result);
});

//SEARCH
app.get("/search/:key", async (req, res) => {
  let result = await Product.find({
    $or: [
      { name: { $regex: req.params.key } },
      { company: { $regex: req.params.key } },
      { price: { $regex: req.params.key } },
      { category: { $regex: req.params.key } },
    ],
  });
  res.send(result);
});

app.listen(3200);
