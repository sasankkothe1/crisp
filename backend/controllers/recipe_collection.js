const mongoose = require("mongoose");

const RecipeCollection = require("../model/RecipeCollection");
const Order = require("../model/Order");

const { removeFileFromS3 } = require("../middleware/upload");

const getRecipeCollections = (req, res) => {
    let collections = RecipeCollection.find();

    if (req.query.populate) {
        const populates = Array.isArray(req.query.populate)
            ? req.query.populate
            : [req.query.populate];

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
            media: req.files?.media?.map((file) => file.location),
            pdfFile: req.files.pdfFile[0].location,
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

    if (req.files?.media?.length) {
        newRecipeCollection.media = req.files.media.map(
            (file) => file.location
        );
    }
    if (req.files?.pdfFile?.length) {
        newRecipeCollection.pdfFile = req.files.pdfFile[0].location;
    }

    if (req.files?.pdfFile?.length) {
        newRecipeCollection.pdfFile = req.pdfFile.map((file) => file.location)[0];
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
                if (req.files?.media?.length) {
                    recipeCollection.media.map((media) =>
                        removeFileFromS3(media)
                    );
                }
                if (req.files?.pdfFile?.length) {
                    removeFileFromS3(recipeCollection.pdfFile);
                }
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
                if (recipeCollection) {
                    recipeCollection?.media.map((media) =>
                        removeFileFromS3(media)
                    );
                    removeFileFromS3(recipeCollection.pdfFile);
                    res.status(200).send({ id: recipeCollection._id });
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
