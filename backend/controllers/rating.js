const mongoose = require("mongoose");

const Rating = require("../model/Rating");

const RecipeCollection = require("../model/RecipeCollection");
const { PostModel } = require("../model/Post");
const { EventModel } = require("../model/Event");
const { RecipeModel } = require("../model/Recipe");

const getUserRate = (req, res) => {
    const params = {
        ratedBy: req.user._id,
        type: req.query.type,
    };

    switch (req.query.type) {
        case "RecipeCollection": {
            params.recipeCollection = req.params.id;
            break;
        }
        case "Post": {
            params.post = req.params.id;
            break;
        }
        case "Event": {
            params.event = req.params.id;
            break;
        }
        case "Recipe": {
            params.recipe = req.params.id;
            break;
        }
        default: {
            res.sendStatus(502);
            return;
        }
    }

    Rating.findOne(params)
        .then((rating) => {
            console.log(rating);
            res.status(200).send({ rating: rating ? rating.rating : 0 });
        })
        .catch((err) => res.status(502).send({ message: err.message }));
};

const rate = (req, res) => {
    const params = {
        ratedBy: req.user._id,
        type: req.body.type,
    };

    switch (req.body.type) {
        case "RecipeCollection": {
            params.recipeCollection = req.params.id;
            break;
        }
        case "Post": {
            params.post = req.params.id;
            break; 
        }
        case "Event": {
            params.event = req.params.id;
            break;
        }
        case "Recipe": {
            params.recipe = req.params.id;
            break;
        }
        default: {
            res.sendStatus(502);
            return;
        }
    }

    console.log(params);

    Rating.findOne(params)
        .then((rating) => {
            console.log(rating);

            if (rating) {
                Rating.findByIdAndUpdate(
                    rating._id,
                    {
                        rating: req.body.rating,
                    },
                    {
                        runValidators: true,
                    }
                )
                    .then((oldRating) => {
                        const delta = req.body.rating - oldRating.rating;
                        const updateParams = {
                            $inc: {
                                cumulativeRating: delta,
                            },
                        };
                        switch (req.body.type) {
                            case "RecipeCollection": {
                                RecipeCollection.findByIdAndUpdate(
                                    req.params.id,
                                    updateParams,
                                    { new: true }
                                )
                                    .then((recipeCollection) => {
                                        res.sendStatus(200);
                                    })
                                    .catch((err) => {
                                        res.sendStatus(502);
                                    });
                                break;
                            }
                            case "Post": {
                                PostModel.findByIdAndUpdate(
                                    req.params.id,
                                    updateParams,
                                    { new: true }
                                )
                                    .then((post) => {
                                        res.sendStatus(200);
                                    })
                                    .catch((err) => {
                                        res.sendStatus(502);
                                    }); 
                                break;
                            }
                            case "Event": {
                                EventModel.findByIdAndUpdate(
                                    req.params.id,
                                    updateParams,
                                    { new: true }
                                )
                                    .then((event) => {
                                        res.sendStatus(200);
                                    })
                                    .catch((err) => {
                                        res.sendStatus(502);
                                    }); 
                                break;
                            }
                            case "Recipe": {
                                RecipeModel.findByIdAndUpdate(
                                    req.params.id,
                                    updateParams,
                                    { new: true }
                                )
                                    .then((recipe) => {
                                        res.sendStatus(200);
                                    })
                                    .catch((err) => {
                                        res.sendStatus(502);
                                    }); 
                                break;
                            } 
                            default: {
                                return; 
                            }
                        }
                    })
                    .catch((err) => {
                        res.status(502).send({ message: err.message });
                        return;
                    });
            } else {
                console.log({
                    _id: new mongoose.Types.ObjectId(),
                    ...params,
                    rating: req.body.rating, 
                });
                Rating.create({
                    _id: new mongoose.Types.ObjectId(),
                    ...params,
                    rating: req.body.rating,
                })
                    .then((rating) => {
                        const updateParams = {
                            $inc: {
                                cumulativeRating: req.body.rating,
                                numRates: 1,
                            },
                        };
                        switch (req.body.type) {
                            case "RecipeCollection": {
                                RecipeCollection.findByIdAndUpdate(
                                    req.params.id,
                                    updateParams,
                                    { new: true }
                                )
                                    .then((recipeCollection) => {
                                        res.sendStatus(200);
                                    })
                                    .catch((err) => {
                                        res.sendStatus(502);
                                    });
                                break;
                            }
                            case "Post": {
                                console.log("Updating post...");
                                PostModel.findByIdAndUpdate(
                                    req.params.id,
                                    updateParams,
                                    { new: true }
                                )
                                    .then((post) => {
                                        res.sendStatus(200);
                                    })
                                    .catch((err) => {
                                        res.sendStatus(502);
                                    });
                                break;
                            }
                            case "Event": {
                                console.log("Updating event...");
                                EventModel.findByIdAndUpdate(
                                    req.params.id,
                                    updateParams,
                                    { new: true }
                                )
                                    .then((event) => {
                                        res.sendStatus(200);
                                    })
                                    .catch((err) => {
                                        res.sendStatus(502);
                                    });
                                break;
                            }
                            case "Recipe": {
                                RecipeModel.findByIdAndUpdate(
                                    req.params.id,
                                    updateParams,
                                    { new: true }
                                )
                                    .then((recipe) => {
                                        res.sendStatus(200);
                                    })
                                    .catch((err) => {
                                        res.sendStatus(502);
                                    });
                                break; 
                            }
                            default: {
                                return; 
                            }
                        }
                    })
                    .catch((err) => {
                        res.status(502).send({ message: err.message });
                    });
            }
        })
        .catch((err) => res.sendStatus(502));
};

module.exports = {
    rate,
    getUserRate,
};
