require('dotenv').config()
const express = require ("express");
const app = express();
const port = process.env.PORT;
const router = express.Router();
const auth = require('./routes/auth/auth.js');
const user = require('./routes/user/user.js');
const todo = require('./routes/todos/todos.js');
const error = require('./middleware/notFound.js');
const bodyParser = require("body-parser");
const path = require('path');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/", (req, res, next) => {
    res.sendFile(path.join(__dirname) + '/index.html')
});

app.get("/preregister", (req, res, next) => {
    res.sendFile(path.join(__dirname) + '/register.html')
});

app.get("/prelogin", (req, res, next) => {
    res.sendFile(path.join(__dirname) + '/login.html')
});

app.post("/register", auth);
app.post("/login", auth);

app.get("/user", user);
app.get("/user/:id", user);
app.get("/user/:email", user);
app.put("/user/:id", user);
app.delete("/user/:id", user);

app.get("/user/todos", todo);
app.get("/todo", todo);
app.post("/todo", todo);
app.get("/todo/:id", todo);
app.put("/todo/:id", todo);
app.delete("/todo/:id", todo);

app.put(error);

app.listen(port , () => {
    console.log('URL: http://localhost:'+port);
});