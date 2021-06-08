// routes/api/post.js

const express = require('express');
const router = express.Router();

// Load Post model
const Post = require('../../models/Post');

// @route GET api/posts/test
// @description tests posts route
// @access Public
router.get('/test', (req, res) => res.send('post route testing!'));

// @route GET api/posts
// @description Get all posts
// @access Public
router.get('/', (req, res) => {
  Post.find()
    .then(posts => res.json(posts))
    .catch(err => res.status(404).json({ nopostsfound: 'No Posts found' }));
});