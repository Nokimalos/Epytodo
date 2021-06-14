require('dotenv').config()
const express = require("express");
const app = express();
const router = express.Router();
const db_connection = require('../../config/db.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

function generateAccessToken(email, password) {
    return jwt.sign({ email, password }, process.env.SECRET, { expiresIn: '3600s' });
}

router.post("/register", (req, res, next) => {
    db_connection.query("SELECT email FROM user WHERE email = ?", req.body.email, function (err, result) {
        if (err) next(err);
        if (result.length > 0) {
            res.status(200).send('"msg" : "account already exists"')
        } else {
            const hash = bcrypt.hashSync(req.body.password, 10)
            var users = {
                email: req.body.email,
                password: hash,
                name: req.body.name,
                firstName: req.body.firstname,
            }
            db_connection.query('INSERT INTO user SET ?', users, function (error) {
                if (error) next(error);
                const token = generateAccessToken({ email: req.body.email, password: hash });
                res.status(200).send('"token" : ' + token)
            })
        };
    });
});

router.post("/login", (req, res, next) => {
    db_connection.query('SELECT * FROM user WHERE email = ?', req.body.email, function (error, result) {
        if (error) next(error);
        const log = (result[0].password);
        bcrypt.compare(req.body.password, log, function (err, results) {
            if (err) next(err);
            if (results === true) {
                const token = generateAccessToken(req.body.email, log);
                res.status(200).send('"token" : ' + token)
            } else {
                res.status(200).send('"msg" : "Invalid Credentials')
            }
        });
    });
});

module.exports = router;