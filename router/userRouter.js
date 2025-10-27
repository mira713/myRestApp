const express = require("express");
const userRouter = express.Router();
const { UserModel } = require("../model/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const crypto = require("crypto");
const Mailjet = require("node-mailjet");

// initialize Mailjet client
const mailjet = Mailjet.apiConnect(
  process.env.MAILJET_API_KEY,
  process.env.MAILJET_API_SECRET
);

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

// --- Forgot Password and Reset Password Endpoints ---

// 1. Request password reset
// userRouter.post("/sendEmail", async (req, res) => {
//   const { email } = req.body;
//   try {
//     const user = await UserModel.findOne({ email });
//     if (!user) return res.status(404).send({ message: "User not found" });

//     // Generate token
//     const token = crypto.randomBytes(32).toString("hex");
//     const tokenExpiry = Date.now() + 1000 * 60 * 15; // 15 minutes

//     // Save token and expiry to user (add fields if not present)
//     user.resetToken = token;
//     user.resetTokenExpiry = tokenExpiry;
//     await user.save();

//     // Send email
//     const resetLink = `${process.env.FRONTEND_URL}/resetPassword?token=${token}&email=${email}`;
//     await transporter.sendMail({
//       from: process.env.EMAIL_USER,
//       to: email,
//       subject: "Password Reset Request",
//       html: `<p>Click <a href='${resetLink}'>here</a> to reset your password. This link expires in 15 minutes.</p>`,
//     });

//     res.send({ message: "Password reset email sent" });
//   } catch (e) {
//     res.status(500).send({ error: e.message });
//   }
// });

userRouter.post("/sendEmail", async (req, res) => {
  const { email } = req.body;

  try {
    // 1️⃣ Find user
    const user = await UserModel.findOne({ email });
    if (!user) return res.status(404).send({ message: "User not found" });

    // 2️⃣ Generate token and expiry
    const token = crypto.randomBytes(32).toString("hex");
    const tokenExpiry = Date.now() + 1000 * 60 * 15; // 15 minutes

    // Save token to DB
    user.resetToken = token;
    user.resetTokenExpiry = tokenExpiry;
    await user.save();

    // 3️⃣ Build reset link
    const resetLink = `${
      process.env.FRONTEND_URL
    }/resetPassword?token=${token}&email=${encodeURIComponent(email)}`;

    // 4️⃣ Send email via Mailjet
    const request = mailjet.post("send", { version: "v3.1" }).request({
      Messages: [
        {
          From: {
            Email: process.env.EMAIL_USER,
            Name: "Mitali Sinha",
          },
          To: [
            {
              Email: email,
              Name: user.name || "User",
            },
          ],
          Subject: "Password Reset Request",
          HTMLPart: `<h3>Hello ${user.name || ""},</h3>
            <p>You requested to reset your password.</p>
            <p>Click <a href="${resetLink}">here</a> to reset it. This link will expire in 15 minutes.</p>
            <p>Thanks,<br/>Your App Team</p>`,
        },
      ],
    });

    const result = await request;
    console.log("Email sent:", result.body);
    res.send({ message: "Password reset email sent successfully" });
  } catch (err) {
    console.error("Error sending email:", err.message);
    res.status(500).send({ error: err.message });
  }
});

// 2. Reset password
userRouter.post("/resetPassword", async (req, res) => {
  const { email, token, newPassword } = req.body;
  try {
    const user = await UserModel.findOne({ email, resetToken: token });
    if (!user || !user.resetTokenExpiry || user.resetTokenExpiry < Date.now()) {
      return res.status(400).send({ message: "Invalid or expired token" });
    }

    // Hash new password
    bcrypt.hash(newPassword, 3, async (err, hash) => {
      if (err) return res.status(500).send({ error: "Hashing error" });
      user.password = hash;
      user.resetToken = undefined;
      user.resetTokenExpiry = undefined;
      await user.save();
      res.send({ message: "Password reset successful" });
    });
  } catch (e) {
    res.status(500).send({ error: e.message });
  }
});

// <---------------------download CSV of users---------------------->

// userRouter.get("/download", async (req, res) => {
//   try {
//     const users = await UserModel.find().lean();

//     // Prepare CSV header
//     const header = "name,email,password\n";
//     // Prepare CSV rows
//     const rows = users.map(u =>
//       `"${u.name}","${u.email}","${u.password}"`
//     ).join("\n");

//     const csvData = header + rows;

//     res.setHeader("Content-Disposition", "attachment; filename=users.csv");
//     res.setHeader("Content-Type", "text/csv");

//     res.send();
//   } catch (e) {
//     res.status(500).send(e.message);
//   }
// });

userRouter.get("/download", async (req, res) => {
  try {
    res.setHeader("Content-Disposition", "attachment; filename=users.csv");
    res.setHeader("Content-Type", "text/csv");

    // Write CSV header
    res.write("name,email,password\n");

    // Stream users from MongoDB
    const cursor = UserModel.find().lean().cursor();
    for await (const user of cursor) {
      res.write(`"${user.name}","${user.email}","${user.password}"\n`);
    }

    res.end();
  } catch (e) {
    res.status(500).send(e.message);
  }
});

module.exports = { userRouter };
