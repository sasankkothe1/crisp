const { PartnerManager } = require("../model/PartnerManager");

const create = async (req, res) => {
    if (Object.keys(req.body).length === 0)
        return res.status(400).json({
            error: "Bad Request",
            message: "The request body is empty",
        });

    let post = {
        ...req.body,
        users: [],
    };
    await PartnerManager.create(post);
};

const assign = async (req, res) => {
    try {
        let result = await PartnerManager.findOne({
            _id: req.params.id,
        }).exec();
        result.users.push(req.body.userId);

        result.save(function (error) {
            if (error)
                res.status(500).json({
                    error: "Internal server error",
                    message: error.message,
                });
            else res.status(200).json(result);
        });
    } catch (error) {
        return res.status(404).json({
            error: "Internal server error",
            message: error.message,
        });
    }
};

const removeAssign = async (req, res) => {
    try {
        let result = await PartnerManager.findOne({
            _id: req.params.id,
        }).exec();
        let usersList = result.users;
        usersList.filter((user) => {
            return user != req.body.userId;
        });
        result.users = usersList;

        result.save(function (error) {
            if (error)
                res.status(500).json({
                    error: "Internal server error",
                    message: error.message,
                });
            else res.status(200).json(result);
        });
    } catch (error) {
        return res.status(404).json({
            error: "Internal server error",
            message: error.message,
        });
    }
};

const remove = async (req, res) => {
    let result;
    try {
        result = await PartnerManager.findOne({ _id: req.params.id }).exec();
        if (!result) {
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
    await result.remove();
    res.status(200).json({ message: "Partner Manager Deleted." });
};

module.exports = {
    create,
    assign,
    removeAssign,
    remove,
};
