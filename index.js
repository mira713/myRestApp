const express = require("express");
const cors = require("cors");
require("dotenv").config();
const db = require("./db");
const { authenticate } = require("./middleware/authenticate");
const { userRouter } = require("./router/userRouter");
const { todoRouter } = require("./router/todoRouter");

const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("welcome to my world");
});

app.use("/users", userRouter);
app.use(authenticate)
app.use("/todo", todoRouter);

app.listen(process.env.PORT, async () => {
  try {
    await db;
    console.log("Connected to DB");
  } catch (e) {
    console.log(e.message);
  }
  console.log(`Server is running on port ${process.env.PORT}`);
});
