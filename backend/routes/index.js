const express = require('express');

const api = express.Router()
    .use('/orders', require('./api/order'))
    .use('/posts', require('./api/post'))
    .use('/recipe_collections', require('./api/recipe_collection'))
    .use('/users', require('./api/user'));

module.exports = {
    api
};