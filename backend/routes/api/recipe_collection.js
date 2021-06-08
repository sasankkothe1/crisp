const mongoose = require('mongoose');

const express = require('express');
const router = express.Router();

const RecipeCollection = require('../../model/RecipeCollection');

// Get all collections
router.get('/', (req, res) => {
    let collections = RecipeCollection.find();

    if (req.query.populate) {
        const populates = (typeof req.query.populate === "string" ? [req.query.populate] : req.query.populate);

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
// TODO: propagate to user
router.post('/', (req, res) => {
    const recipeCollection = new RecipeCollection(req.body);
    recipeCollection._id = new mongoose.Types.ObjectId();

    recipeCollection.save()
        .then(data => res.sendStatus(201))
        .catch(err => res.status(502).send({ message: err.message }));
});

// Get specific collection
router.get('/:recipe_collection', (req, res) => {
    let collection = RecipeCollection.findOne({ _id: req.params.recipe_collection });

    if (req.query.populate) {
        const populates = (typeof req.query.populate === "string" ? [req.query.populate] : req.query.populate);

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
router.put('/:recipe_collection', (req, res) => {
    const recipeCollection = new RecipeCollection(req.body);
    RecipeCollection.findByIdAndUpdate(
        req.params.recipe_collection, 
        recipeCollection,
        (err, recipeCollection) => {
            if (err) {
                res.status(502).send({ message: err.message });
            } else {
                res.sendStatus(200);
            }
        });
});

// Remove specific collection
// TODO: propagate to user
router.delete('/:recipe_collection', (req, res) => {
    RecipeCollection.findByIdAndDelete(req.params.recipe_collection, (err, recipeCollection) => {
        if (err) {
            res.status(404).send({ message: err.message });
        } else {
            res.sendStatus(200);
        }
    });
});

module.exports = router;
