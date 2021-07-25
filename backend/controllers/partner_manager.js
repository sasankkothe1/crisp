const { PartnerManager } = require("../model/PartnerManager");

const getAll = (req, res, next) => {
    PartnerManager.find({}, function (error, managers) {
        if (error) {
            next(error);
        }

        return res.status(200).json({
            success: true,
            data: managers,
        });
    });
};

const create = async (req, res, next) => {
    if (Object.keys(req.body).length === 0)
        return res.status(400).json({
            error: "Bad Request",
            message: "The request body is empty",
        });

    PartnerManager.create(req.body, function (error) {
        if (error) {
            next(error);
        }

        return res.status(200).json({
            success: true,
            message: "Partner Manager Created",
        });
    });
};

const assign = async (req, res, next) => {
    PartnerManager.findByIdAndUpdate(
        req.params.id,
        {
            $push: {
                assignedTo: req.body.userId,
            },
        },
        function (error) {
            if (error) {
                return next(error);
            }

            return res.status(200).json({
                success: true,
                message: "Partner Manager assigned to partner",
            });
        }
    );
};

// Not sure about anything after this

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
    getAll,
    create,
    assign,
    removeAssign,
    remove,
};
