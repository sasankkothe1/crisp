const mongoose = require('mongoose');

const express = require('express');
const router = express.Router();

const RecipeCollection = require('../../model/RecipeCollection');

const { protect, admin } = require('../../middleware/auth');

// Get all collections
router.get('/', (req, res) => {
    let collections = RecipeCollection.find();

    if (req.query.populate) {
        const populates = (Array.isArray(req.query.populate) ? req.query.populate : [req.query.populate]);

        console.log(populates);

        for (field of populates) {
            console.log(field);
            collections = collections.populate(field);
        }
    }

    collections
        .then(recipeCollections => res.json(recipeCollections))
        .catch(err => res.status(404).send({ message: err.message }));
});

// Add new collection
// Auth: User 
router.post('/', protect, (req, res) => {
    const recipeCollection = new RecipeCollection(Object.assign(req.body, { 
        _id: new mongoose.Types.ObjectId(),
        postedBy: req.user._id
    }));

    recipeCollection.save()
        .then(data => res.sendStatus(201))
        .catch(err => res.status(502).send({ message: err.message }));
});

// Get specific collection
// Auth: None
router.get('/:id', protect, (req, res) => {
    let collection = RecipeCollection.findOne({ _id: req.params.id });

    if (req.query.populate) {
        const populates = (Array.isArray(req.query.populate) ? req.query.populate : [req.query.populate]);

        for (field of populates) {
            console.log(field);
            collections = collections.populate(field);
        }
    }

    collection
        .then(recipeCollection => res.json(recipeCollection))
        .catch(err => res.status(404).send({ message : err.message }));
});

// Edit specific collection
// Auth: User
router.put('/:id', protect, (req, res) => {
    RecipeCollection.findOneAndUpdate({
        _id: req.params.id, 
        postedBy: req.user._id
    }, req.body, (err, recipeCollection) => {
        if (err) {
            res.status(502).send({ message: err.message });
        } else {
            res.sendStatus(200);
        }
    });
});

// Remove specific collection
// Auth: User
router.delete('/:id', protect, (req, res) => {
    RecipeCollection.findOneAndDelete({ 
        _id: req.params.id,
        postedBy: req.user._id
    }, (err, recipeCollection) => {
        if (err) {
            res.status(404).send({ message: err.message });
        } else {
            res.sendStatus(200);
        }
    });
});

module.exports = router;
