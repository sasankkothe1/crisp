const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

const RecipeCollection = require("../model/RecipeCollection");
const Order = require("../model/Order");


const getRecipeCollections = (req, res) => {
    let collections = RecipeCollection.find();

    if (req.query.populate) {
        const populates = Array.isArray(req.query.populate)
            ? req.query.populate
            : [req.query.populate];

        console.log(populates);

        for (const field of populates) {
            collections = collections.populate(field);
        }
    }

    collections
        .then((recipeCollections) => {
            console.log(recipeCollections);
            //recipeCollections = JSON.parse(JSON.stringify(recipeCollections));
            if (req.user) {
                Order.find({ 
                    orderedBy: req.user._id, 
                    type: "RecipeCollection"
                }).then(orders => {
                    let orderKeys = new Set();
                    orders.forEach(order => orderKeys.add(order.recipeCollection.toString()));

                    console.log(orderKeys);
                    
                    recipeCollections.forEach(recipeCollection => {
                        console.log(recipeCollection._id);
                        if (orderKeys.has(recipeCollection._id.toString())) {
                            console.log(true);
                        } else {
                        }
                    });
                }).catch();
            }
            res.json(recipeCollections);
        })
        .catch((err) => res.status(404).send({ message: err.message }));
};

const createRecipeCollection = (req, res) => {
    RecipeCollection.create(
        {
            ...req.body,
            _id: new mongoose.Types.ObjectId(),
            postedBy: req.user._id,
            media: req.files?.map(
                (file) =>
                    `${req.protocol}://${req.get("host")}/public/uploads/${
                        file.filename
                    }`
            ),
        },
        (err, recipeCollection) => {
            if (err) {
                res.status(502).send({ message: err.message });
            } else {
                res.status(201).send({ id: recipeCollection._id });
            }
        }
    );
};

const getRecipeCollection = (req, res) => {
    let collection = RecipeCollection.findOne({ _id: req.params.id });

    if (req.query.populate) {
        const populates = Array.isArray(req.query.populate)
            ? req.query.populate
            : [req.query.populate];

        for (const field of populates) {
            console.log(field);
            collection = collection.populate(field);
        }
    }

    collection
        .then((recipeCollection) => {
            recipeCollection = JSON.parse(JSON.stringify(recipeCollection));
            if (req.user) {
                Order.find({ 
                    orderedBy: req.user._id, 
                    type: "RecipeCollection"
                }).then(orders => {
                    let orderKeys = new Set();
                    orders.forEach(order => orderKeys.add(order.recipeCollection.toString()));

                    console.log(orderKeys);
                    
                    const purchased = orderKeys.has(recipeCollection['_id']);

                    recipeCollection['purchased'] = purchased;

                    console.log(recipeCollection);
                }).catch();
            }
            console.log(recipeCollection);
            res.send(recipeCollection);
        })
        .catch((err) => res.status(404).send({ message: err.message }));
};

const editRecipeCollection = (req, res) => {
    const newRecipeCollection = {
        ...req.body,
    };

    if (req.files?.length) {
        newRecipeCollection.media = req.files.map(
            (file) =>
                `${req.protocol}://${req.get("host")}/public/uploads/${
                    file.filename
                }`
        );
    }

    RecipeCollection.findOneAndUpdate(
        {
            _id: req.params.id,
            postedBy: req.user._id,
        },
        newRecipeCollection,
        (err, recipeCollection) => {
            if (err) {
                res.status(502).send({ message: err.message });
            } else {
                // TODO: remove outdated files (not really important for now though)
                res.sendStatus(200);
            }
        }
    );
};

const removeRecipeCollection = (req, res) => {
    RecipeCollection.findOneAndDelete(
        {
            _id: req.params.id,
            postedBy: req.user._id,
        },
        (err, recipeCollection) => {
            if (err) {
                res.status(404).send({ message: err.message });
            } else {
                recipeCollection?.media.forEach((media) => {
                    const filePath = `./public/uploads/${path.basename(media)}`;
                    fs.access(filePath, fs.F_OK, (err) => {
                        if (err) {
                            console.log(err);
                            return;
                        }
                        fs.unlink(filePath, (err) => {
                            if (err) {
                                console.log(err);
                                return;
                            }
                        });
                    });
                });
                if (recipeCollection) {
                    res.status(200).send({ id: recipeCollection?._id });
                } else {
                    res.sendStatus(200);
                }
            }
        }
    );
};

module.exports = {
    getRecipeCollections,
    createRecipeCollection,
    getRecipeCollection,
    editRecipeCollection,
    removeRecipeCollection,
};
