// routes/api/post.js

const express = require('express');
const router = express.Router();

// Load PartnerManager model
const PartnerManager = require('../../models/PartnerManager');

// @route GET api/partner_manager/test
// @description tests partner_manager route
// @access Public
router.get('/test', (req, res) => res.send('partner_manager route testing!'));

// @route GET api/partner_manager
// @description Get all partner managers
// @access Public
router.get('/', (req, res) => {
    PartnerManager.find()
        .then(PartnerManager => res.json(PartnerManager))
        .catch(err => res.status(404).json({ noPartnerManagerfound: 'No Partner Manager found' }));
});
