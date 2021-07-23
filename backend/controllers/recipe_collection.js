const mongoose = require("mongoose");

const RecipeCollection = require("../model/RecipeCollection");

const { removeFileFromS3 } = require("../middleware/upload");

const AWS = require("aws-sdk");
AWS.config.update({
    region: "eu-central-1",
    accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
});

const s3 = new AWS.S3();

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
        .then((recipeCollections) => res.json(recipeCollections))
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
        .then((recipeCollection) => res.json(recipeCollection))
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
