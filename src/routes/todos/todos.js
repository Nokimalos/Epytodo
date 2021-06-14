const express = require("express");
const router = express.Router();
const db_connection = require('../../config/db.js');
const middleware = require('../../middleware/auth.js');
const decrpytokentoemail = require('./todos.query');

router.get("/user/todos", middleware, (req, res, next) => {
    const email = decrpytokentoemail(req)

    db_connection.query('SELECT id FROM user WHERE email = ? ', email, function (error, results) {
        if (error) next(error);
        db_connection.query('SELECT * FROM todo WHERE user_id = ?', results[0].id, function (err, result) {
            if (err) next(err);
            res.status(200).send(result)
        });
    });
});

router.get("/todo", middleware, (req, res, next) => {
    db_connection.query('SELECT * FROM todo ', function (err, result) {
        if (err) next(err);
        res.status(200).send(result)
    });
});

router.get("/todo/:id", middleware, (req, res, next) => {
    db_connection.query('SELECT * FROM todo WHERE id = ? ', req.params.id, function (err, result) {
        if (err) next(err);
        if (result.length > 0)
            res.status(200).send(result)
        else
            res.status(404).send('"msg": "Not found')
    });
});

router.delete("/todo/:id", middleware, (req, res, next) => {
    var id = req.params.id
    db_connection.query('SELECT * FROM todo WHERE id = ? ', id, function (err, results) {
        if (err) next(err);
        if (results.length < 1) {
            res.status(404).send('"msg": "Not found')
        } else {
            db_connection.query('DELETE FROM todo WHERE id = ? ', [id], function (err) {
                if (err) next(err);
                res.status(200).send('"msg" : "succesfully deleted record number: ' + id + '"');
            });
        }
    });
});

router.put("/todo/:id", middleware, (req, res, next) => {
    const todo = {
        title: req.body.title,
        description: req.body.description,
        due_time: req.body.due_time,
        user_id: req.body.user_id,
        status: req.body.status
    }
    const id = req.params.id
    db_connection.query('SELECT * FROM todo WHERE id = ? ', id, function (err, results) {
        if (err) next(err);
        if (results.length < 1) {
            res.status(404).send('"msg": "Not found')
        } else {
            db_connection.query('UPDATE todo SET ? WHERE id = ? ', [todo, id], function (error) {
                if (error) next(error);
            });
            db_connection.query('SELECT * FROM todo WHERE title = ? ', todo.title, function (err, result) {
                if (err) next(err);
                res.status(200).send(result)
            });
        }
    });
});

router.post("/todo", middleware, (req, res, next) => {
    const todo = {
        title: req.body.title,
        description: req.body.description,
        due_time: req.body.due_time,
        user_id: req.body.user_id,
        status: req.body.status
    }
    db_connection.query('INSERT INTO todo SET ?', todo, function (error) {
        if (error) next(error);
    });
    db_connection.query('SELECT * FROM todo WHERE title = ? ', todo.title, function (err, result) {
        if (err) next(err);
        res.status(200).send(result)
    });
});

module.exports = router