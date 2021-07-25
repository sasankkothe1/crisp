const { PostModel } = require("../model/Post");

const fs = require("fs");
const path = require("path");

const test = async (req, res) => {
    return res.send("testing");
};

const { removeFileFromS3 } = require("../middleware/upload");

const create = async (req, res) => {
    if (Object.keys(req.body).length === 0)
        return res.status(400).json({
            error: "Bad Request",
            message: "The request body is empty",
        });
    if (req.body.title === "undefined" || req.body.title === "")
        return res.status(400).json({
            error: "Bad Request",
            message: "The title is empty",
        });
    if (req.body.description === "undefined" || req.body.description === "")
        return res.status(400).json({
            error: "Bad Request",
            message: "The description is empty",
        });
    if (req.body.premiumStatus === undefined)
        return res.status(400).json({
            error: "Bad Request",
            message: "The premium status is empty",
        });

    let post = {
        ...req.body,
        postedBy: req.user._id,
        media:
            req.files?.length > 0
                ? [...req.files].map((file) => file.location)
                : [],
    };

    const session = await PostModel.startSession();
    session.startTransaction();

    PostModel.create(post)
        .then((post) => {
            req.user.posts.push(post._id);
            req.user.save(async (error) => {
                if (error) {
                    throw error;
                } else {
                    try {
                        await session.commitTransaction();
                        res.status(201).json(post);
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

const listPosts = (req, res) => {
    PostModel.paginate(
        {},
        {
            limit: req.query.limit,
            page: req.query.page,
            sort: "-datePosted",
            populate: "postedBy",
        }
    )
        .then((posts) => {
            if (!posts) {
                return res.status(400).json({
                    error: "Not Found",
                    message: "No Posts Found",
                });
            } else {
                return res.status(200).json(posts);
            }
        })
        .catch((error) => {
            res.status(500).json({
                error: "Internal server error",
                message: error.message,
            });
        });
};

const listPostsByUserID = (req, res) => {
    PostModel.paginate(
        { postedBy: req.params.id },
        {
            limit: req.query.limit,
            page: req.query.page,
            sort: "-datePosted",
            populate: "postedBy",
        }
    )
        .then((posts) => {
            if (!posts) {
                return res.status(400).json({
                    error: "Not Found",
                    message: "No Posts Found",
                });
            } else {
                return res.status(200).json(posts);
            }
        })
        .catch((error) =>
            res.status(500).json({
                error: "Internal server error",
                message: error.message,
            })
        );
};

const listNewPosts = (req, res) => {
    PostModel.find({})
        .sort("-datePosted")
        .populate("postedBy")
        .exec()
        .then((posts) => res.status(200).json(posts))
        .catch((error) =>
            res.status(500).json({
                error: "Internal server error",
                message: error.message,
            })
        );
};

const read = (req, res) => {
    PostModel.findById(req.params.id)
        .populate("postedBy")
        .exec()
        .then((post) => {
            if (!post)
                return res.status(404).json({
                    error: "Not Found",
                    message: "Post not found",
                });
            else return res.status(200).json(post);
        })
        .catch((error) =>
            res.status(500).json({
                error: "Internal server error",
                message: error.message,
            })
        );
};

const update = async (req, res) => {
    //FIXME: Fis if only one image is deleted. Because if one image is selected, then it is not an array. So should push it to the array. That's enough. Or remove the for loop. Enough.
    try {
        let post = await PostModel.findOne({ _id: req.params.id }).exec();

        if (!post) {
            return res.status(404).json({
                error: "Not found",
                message: "Post not found",
            });
        }

        let mediaFiles =
            req.files?.length > 0
                ? [...req.files].map((file) => file.location)
                : [];

        let toBeDeleted = req.body.toBeDeleted;

        // DELETE S3

        if (toBeDeleted && toBeDeleted.length) {
            toBeDeleted.map((media) => removeFileFromS3(media));
        }

        let userImages = JSON.parse(req.body.userImages);

        if (userImages && userImages.length) {
            for (let i = 0; i < userImages.length; i++) {
                mediaFiles.push(userImages[i]["preview"]);
            }
        }

        post.title = req.body.title;
        post.description = req.body.description;
        post.media = mediaFiles;
        post.tags = req.body.tags;
        post.premiumStatus = req.body.premiumStatus;
        post.rating = req.body.rating;

        post.save(function (error) {
            if (error)
                res.status(500).json({
                    error: "Internal server error",
                    message: error.message,
                });
            else res.status(200).json(post);
        });
    } catch (error) {
        return res.status(404).json({
            error: "Internal server error",
            message: error.message,
        });
    }
};

const remove = async (req, res) => {
    let post;
    try {
        post = await PostModel.findOne({ _id: req.params.id })
            .populate("postedBy")
            .exec();
        if (!post) {
            return res.status(404).json({
                error: "Not found",
                message: "Post not found",
            });
        }
    } catch (error) {
        return res.status(404).json({
            error: "Not found",
            message: "Post not found",
        });
    }
    try {
        let { media } = post;

        media.map((media) => removeFileFromS3(media));

        await post.remove();
        res.status(200).json({ message: "Post Deleted." });
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
    listPosts,
    listNewPosts,
    listPostsByUserID,
    update,
    remove,
    test,
};
