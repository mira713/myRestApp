const express = require("express");
const cors = require("cors");
require("dotenv").config();
const db = require("./db");
const { authenticate } = require("./middleware/authenticate");
const { userRouter } = require("./router/userRouter");
const { todoRouter } = require("./router/todoRouter");
const { timepassRouter } = require("./router/timepassRouter");
const { reliableRouter } = require("./router/reliableRouter");
const port = process.env.PORT || 8000;

const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("welcome to my world");
});

app.use("/users", userRouter);
app.use("/reliable", reliableRouter);
app.use(authenticate);
app.use("/todo", todoRouter);
app.use("/timepass", timepassRouter);

app.listen(port, async () => {
  try {
    await db;
    console.log("Connected to DB");
  } catch (e) {
    console.log(e.message);
  }
  console.log(`Server is running on port ${port}`);
});
