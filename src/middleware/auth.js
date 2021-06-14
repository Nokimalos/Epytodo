require('dotenv').config()
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const authentication = req.headers.authorization
      const token = req.headers.authorization.split(' ')[1];
      jwt.verify(token, process.env.SECRET, (err) => {
        if (err) {
          res.status(418).send('"msg" : "Token is not valid')
        } else {
          next();
        }
      });
    } catch {
    res.status(417).send('"msg": "No token, authorization denied"')
  }
};