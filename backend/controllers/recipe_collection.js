const mongoose = require("mongoose");

const RecipeCollection = require("../model/RecipeCollection");
const Order = require("../model/Order");

const { removeFileFromS3 } = require("../middleware/upload");

const getRecipeCollections = (req, res) => {
    console.log(req.user?._id);

    console.log(req.query);

    let collections = RecipeCollection.find();

    collections = collections.populate({
        path: "postedBy", 
        select: { "firstName": 1, "_id": 1 }
    });

    collections
        .then((recipeCollections) => {
            recipeCollections = recipeCollections.map(rc => rc.toJSON());
            if (req.user) {
                Order.find({
                    orderedBy: req.user._id,
                    type: "RecipeCollection",
                })
                    .then((orders) => {
                        let orderKeys = new Set();
                        orders.forEach((order) =>
                            orderKeys.add(order.recipeCollection.toString())
                        );

                        recipeCollections.forEach((recipeCollection) => {
                            recipeCollection.purchased = orderKeys.has(recipeCollection._id.toString());
                        });

                        res.send(recipeCollections);
                    });
            } else {
                res.send(recipeCollections);
            }
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

    collections = collections.populate({
        path: "postedBy", 
        select: { "firstName": 1, "_id": 1 }
    });

    collection
        .then((recipeCollection) => {
            recipeCollection = recipeCollection.toJSON();
            if (req.user) {
                Order.findOne({
                    orderedBy: req.user._id,
                    type: "RecipeCollection",
                    recipeCollection: req.params.id
                })
                    .then(order => {
                        console.log(order);
                        if (order) {
                            recipeCollection.purchased = true;
                        } else {
                            recipeCollection.purchased = false;
                        }
                        res.send(recipeCollection);
                    })
                    .catch();
            } else {
                res.send(recipeCollection);
            }
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
        newRecipeCollection.pdfFile = req.pdfFile.map(
            (file) => file.location
        )[0];
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
                    if (recipeCollection.pdfFile) {
                        removeFileFromS3(recipeCollection.pdfFile);
                    }
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
