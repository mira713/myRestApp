const jwt = require("jsonwebtoken");
require("dotenv").config();

const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (token) {
    jwt.verify(token, process.env.secretKey, (err, decoded) => {
      console.log(decoded);
      if (decoded) {
        req.body.user = decoded.userId;
        req.user = decoded.userId;
        next();
      } else {
        res.send({ err: "token is broken" });
      }
    });
  } else {
    res.send({ response: "could not find token or not logged in" });
  }
};

module.exports = { authenticate };
