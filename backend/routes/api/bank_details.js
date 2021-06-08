// routes/api/post.js

const express = require('express');
const router = express.Router();

// Load BankDetails model
const BankDetails = require('../../models/BankDetails');

// @route GET api/bank_details/test
// @description tests bank_details route
// @access Public
router.get('/test', (req, res) => res.send('bank_details route testing!'));

// @route GET api/posts
// @description Get all bank details
// @access Public
router.get('/', (req, res) => {
    BankDetails.find()
        .then(BankDetails => res.json(BankDetails))
        .catch(err => res.status(404).json({ noBankDetailsFound: 'No Bank Details found' }));
});
