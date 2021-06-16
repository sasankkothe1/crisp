const { PostModel } = require("../model/Post");

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

    let url = req.protocol + "://" + req.get("host") + "/";
    let mediaFiles = [];

    if (req.files.length > 0) {
        for (var i = 0; i < req.files.length; i++)
            mediaFiles.push(url + req.files[i].filename);
    }
    let post = {
        ...req.body,
        media: mediaFiles,
    };

    PostModel.create(post)
        .then((post) => res.status(201).json(post))
        .catch((error) =>
            res.status(500).json({
                error: "Internal server error",
                message: error.message,
            })
        );
};

const listPosts = (req, res) => {
    PostModel.find({})
        .populate("postedBy")
        .exec()
        .then((posts) => {
            if (!posts)
                return res.status(400).json({
                    error: "Not Found",
                    message: "No Posts Found",
                });
            else return res.status(200).json(posts);
        });
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

const listPostsByUserID = (req, res) => {
    PostModel.find({ postedBy: req.params.id })
        .then((posts) => res.status(200).json(posts))
        .catch((error) =>
            res.status(500).json({
                error: "Internal server error",
                message: error.message,
            })
        );
};

const read = (req, res) => {
    PostModel.find(req.params.id)
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
    try {
        let post = await PostModel.findOne({ _id: req.params.id }).exec();

        if (!post) {
            return res.status(404).json({
                error: "Not found",
                message: "Post not found",
            });
        }

        let mediaFiles = post.media;
        if (req.file !== undefined) {
            let url = req.protocol + "://" + req.get("host") + "/";

            if (req.files.length > 0) {
                for (var i = 0; i < req.files.length; i++)
                    mediaFiles.push(url + req.files[i].filename);
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
