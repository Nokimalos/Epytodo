require('dotenv').config()
const jwt = require('jsonwebtoken');

function decrypttokentoemail(req) {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.SECRET);
    const email = decodedToken.email;

    return email;
}

module.exports = decrypttokentoemail;