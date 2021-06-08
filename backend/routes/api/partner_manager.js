// routes/api/post.js

const express = require('express');
const router = express.Router();

// Load PartnerManager model
const Post = require('../../models/PartnerManager');

// @route GET api/partner_manager/test
// @description tests partner_manager route
// @access Public
router.get('/test', (req, res) => res.send('partner_manager route testing!'));

// @route GET api/partner_manager
// @description Get all partner managers
// @access Public
router.get('/', (req, res) => {
    Post.find()
        .then(posts => res.json(posts))
        .catch(err => res.status(404).json({ nopartnermanagerfound: 'No Partner Manager found' }));
});
