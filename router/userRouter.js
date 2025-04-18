const express = require("express");
const userRouter = express.Router();
const { UserModel } = require("../model/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

userRouter.get("/", async (req, res) => {
  try {
    const users = await UserModel.find();
    res.send(users);
  } catch (e) {
    res.send(e.message);
  }
});

userRouter.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    bcrypt.hash(password, 3, async (err, hash) => {
      if (err) {
        console.log(err.message);
        res.send({ err: "Error in hashing" });
      } else {
        const newUser = new UserModel({ name, email, password: hash });
        await newUser.save();
        res.send({ response: "User Registered" });
      }
    });
  } catch (e) {
    res.send(e.message);
  }
});

userRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await UserModel.find({ email });
    if (user.length) {
      const token = jwt.sign({ userId: user[0]._id }, process.env.secretKey);
      bcrypt.compare(password, user[0].password, (err, result) => {
        if (result) {
          res.send({ message: "logged in successfully", token, user: user[0] });
        } else {
          res.send({ message: "Password not matched", error: err.message });
        }
      });
    } else {
      res.send("User not found");
    }
  } catch (e) {
    res.send(e.message);
  }
});

module.exports = { userRouter };
