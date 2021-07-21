const { RecipeModel } = require("../model/Recipe");

const fs = require("fs");

const test = async (req, res) => {
    return res.send("testing");
};

const create = async (req, res) => {
    if (Object.keys(req.body).length === 0)
        return res.status(400).json({
            error: "Bad Request",
            message: "The request body is empty",
        });
    if (req.body.title === "undefined")
        return res.status(400).json({
            error: "Bad Request",
            message: "The title is empty",
        });
    if (req.body.description === "undefined")
        return res.status(400).json({
            error: "Bad Request",
            message: "The description is empty",
        });
    if (req.body.premiumStatus === undefined)
        return res.status(400).json({
            error: "Bad Request",
            message: "The premium status is empty",
        });
    let url = req.protocol + "://" + req.get("host") + "/";
    let mediaFiles = [];

    if (req.files?.length > 0) {
        for (var i = 0; i < req.files.length; i++)
            mediaFiles.push(url + req.files[i].filename);
    }

    let recipe = {
        ...req.body,
        ingredientsList: JSON.parse(req.body.ingredientsList),
        postedBy: req.user._id,
        media: mediaFiles,
    };

    const session = await RecipeModel.startSession();
    session.startTransaction();

    RecipeModel.create(recipe)
        .then((recipe) => {
            req.user.recipes.push(recipe._id);
            req.user.save(async (error) => {
                if (error) {
                    throw error;
                } else {
                    try {
                        await session.commitTransaction();
                        res.status(201).json(recipe);
                    } catch (error) {
                        res.status(500).json({
                            error: "Internal server error",
                            message: error.message,
                        });
                    } finally {
                        session.endSession();
                    }
                }
            });
        })
        .catch(async (error) => {
            await session.abortTransaction();
            session.endSession();
            res.status(500).json({
                error: "Internal server error",
                message: error.message,
            });
        });
};

const listRecipes = (req, res) => {
    RecipeModel.find({})
        .populate("postedBy")
        .exec()
        .then((recipes) => {
            if (!recipes)
                return res.status(400).json({
                    error: "Not Found",
                    message: "No Recipes Found",
                });
            else return res.status(200).json(recipes);
        });
};

const listNewRecipes = (req, res) => {
    RecipeModel.find({})
        .sort("-datePosted")
        .populate("postedBy")
        .exec()
        .then((recipes) => res.status(200).json(recipes))
        .catch((error) =>
            res.status(500).json({
                error: "Internal server error",
                message: error.message,
            })
        );
};

const listRecipesByUserID = (req, res) => {
    RecipeModel.find({ postedBy: req.params.id })
        .then((recipes) => res.status(200).json(recipes))
        .catch((error) =>
            res.status(500).json({
                error: "Internal server error",
                message: error.message,
            })
        );
};

const listRecipesByCuisine = (req, res) => {
    RecipeModel.find({ cuisine: req.params.cuisine })
        .then((recipes) => res.status(200).json(recipes))
        .catch((error) =>
            res.status(500).json({
                error: "Internal server error",
                message: error.message,
            })
        );
};

const read = (req, res) => {
    RecipeModel.find(req.params.id)
        .populate("postedBy")
        .exec()
        .then((recipe) => {
            if (!recipe)
                return res.status(404).json({
                    error: "Not Found",
                    message: "Recipe not found",
                });
            else return res.status(200).json(recipe);
        })
        .catch((error) =>
            res.status(500).json({
                error: "Internal server error",
                message: error.message,
            })
        );
};

const update = async (req, res) => {
    try {
        let recipe = await RecipeModel.findOne({ _id: req.params.id }).exec();

        if (!recipe) {
            return res.status(404).json({
                error: "Not found",
                message: "Recipe not found",
            });
        }

        let mediaFiles = recipe.media;
        if (req.file !== undefined) {
            let url = req.protocol + "://" + req.get("host") + "/";

            if (req.files.length > 0) {
                for (var i = 0; i < req.files.length; i++)
                    mediaFiles.push(url + req.files[i].filename);
            }
        }

        recipe.title = req.body.title;
        recipe.description = req.body.description;
        recipe.media = mediaFiles;
        recipe.tags = req.body.tags;
        recipe.premiumStatus = req.body.premiumStatus;
        recipe.rating = req.body.rating;
        recipe.ingredientsList = req.body.ingredientsList;
        recipe.instructions = req.body.instructions;
        recipe.cuisine = req.body.cuisine;

        recipe.save(function (error) {
            if (error)
                res.status(500).json({
                    error: "Internal server error",
                    message: error.message,
                });
            else res.status(200).json(recipe);
        });
    } catch (error) {
        return res.status(404).json({
            error: "Internal server error",
            message: error.message,
        });
    }
};

const remove = async (req, res) => {
    let recipe;
    try {
        recipe = await RecipeModel.findOne({ _id: req.params.id })
            .populate("postedBy")
            .exec();
        if (!recipe) {
            return res.status(404).json({
                error: "Not found",
                message: "Recipe not found",
            });
        }
    } catch (error) {
        return res.status(404).json({
            error: "Not found",
            message: "Recipe not found",
        });
    }
    try {
        let { media } = recipe;
        media.map((mediaFile) => {
            let path =
                "./public/uploads/" +
                mediaFile.substr(mediaFile.lastIndexOf("/") + 1);
            fs.access(path, fs.F_OK, (err) => {
                if (err) {
                    console.log(err);
                    return;
                }
                fs.unlink(path, (err) => {
                    if (err) throw err;
                });
            });
        });

        await recipe.remove();
        res.status(200).json({ message: "Recipe Deleted." });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: "Internal server error",
            message: error.message,
        });
    }
};

module.exports = {
    create,
    read,
    listRecipes,
    listNewRecipes,
    listRecipesByUserID,
    listRecipesByCuisine,
    update,
    remove,
    test,
};
