const HandleErrors = (err, req, res, next) => {
    res.status(500).send('"msg": "internal server error"')
}

module.exports = HandleErrors;
