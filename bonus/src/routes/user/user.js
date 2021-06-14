const express = require("express");
const router = express.Router();
const db_connection = require('../../config/db.js');
const middleware = require('../../middleware/auth.js');
const bcrypt = require('bcryptjs');

router.get("/user", middleware, (req, res, next) => {
    db_connection.query('SELECT * FROM user ', function (err, result) {
        if (err) next(err);
        res.status(200).send(result)
    });
});

router.put("/user/:id", middleware, (req, res, next) => {
    const hash = bcrypt.hashSync(req.body.password, 10)
    var todo = {
        email: req.body.email,
        password: hash,
        firstname: req.body.firstname,
        name: req.body.name
    }
    var id = req.params.id
    db_connection.query('UPDATE user SET ? WHERE id = ? ', [todo, id], function (error) {
        if (error) next(error);
        db_connection.query('SELECT * FROM user WHERE id = ? ', [id], function (err, result) {
            if (err) next(err);
            res.status(200).send(result);
        });
    });
});

router.get("/user/:id", middleware, (req, res, next) => {
    db_connection.query('SELECT * FROM user WHERE id = ? ', req.params.id, function (err, result) {
        if (err) next(err);
        res.status(200).send(result)
    });
});

router.get("/user/:email", middleware, (req, res, next) => {
    db_connection.query('SELECT * FROM user WHERE email = ? ', req.params.email, function (err, result) {
        if (err) next(err);
        res.status(200).send(result)
    });
});

router.delete("/user/:id", middleware, (req, res, next) => {
    var id = req.params.id
    db_connection.query('DELETE FROM user WHERE id = ? ', [id], function (err) {
        if (err) next(err);
        res.status(200).send('"msg" : "succesfully deleted record number: ' + id + '"');
    });
});

module.exports = router