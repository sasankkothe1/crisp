const express = require('express');
const router = express.Router();

const User = require('../../model/User');

router.get('/', (req, res) => {
    User.find()
        .then(users => res.json(users))
        .catch(err => res.status(404).send({ message: err.message}));
});

module.exports = router;