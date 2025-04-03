const jwt = require("jsonwebtoken");
require("dotenv").config();

const authenticate = (req, res, next) => {
  const token = req.headers.tkn;
  if (token) {
    jwt.verify(token, process.env.secretKey, (err, decoded)=>{
        console.log(decoded)
        if(decoded){
            req.body.user = decoded.userId
            next();
        }else{
            res.send('token is broken')
        }
    })
  } else {
    res.send("could not find token or not logged in");
  }
};

module.exports = { authenticate };
