const User = require("../model/User");
const ErrorResponse = require("../utils/errorResponse");

exports.getUserDetails = async (req, res, next) => {
    const { id } = req.params;

    try {
        const user = await User.findById(id);

        if (!user) {
            return next(new ErrorResponse("User Not Found", 404));
        }

        return res.status(200).json(user);
    } catch (error) {
        return next(error);
    }
};

exports.followUser = async (req, res, next) => {
    const { id } = req.params;

    try {
        const follower = req.user;
        const followed = await User.findById(id);

        if (!followed) {
            return next(new ErrorResponse("User Not Found", 404));
        }

        if (!follower.following.includes(id)) {
            follower.following.push(id);

            follower.save(function (err) {
                if (err) {
                    return next(err);
                }

                return res.status(200).json({
                    message: "Followed Successfully",
                    isFollowing: true,
                });
            });
        } else {
            return res.status(200).json({
                message: "Followed Successfully",
                isFollowing: true,
            });
        }
    } catch (error) {
        return next(error);
    }
};

exports.unfollowUser = async (req, res, next) => {
    const { id } = req.params;

    try {
        const follower = req.user;
        const followed = await User.findById(id);

        if (!followed) {
            return next(new ErrorResponse("User Not Found", 404));
        }

        if (follower.following.includes(id)) {
            for (let i = 0; i < follower.following.length; i++) {
                if (follower.following[i] == id) {
                    follower.following.splice(i, 1);
                }
            }

            follower.save(function (err) {
                if (err) {
                    return next(err);
                }

                return res.status(200).json({
                    message: "Unfollowed Successfully",
                    isFollowing: false,
                });
            });
        } else {
            return res.status(200).json({
                message: "Unfollowed Successfully",
                isFollowing: false,
            });
        }
    } catch (error) {
        return next(error);
    }
};

exports.isFollowing = async (req, res, next) => {
    const { id } = req.params;

    try {
        const follower = req.user;
        const followed = await User.findById(id);

        if (!followed) {
            return next(new ErrorResponse("User Not Found", 404));
        }

        return res
            .status(200)
            .json({ isFollowing: follower.following.includes(id) });
    } catch (error) {
        return next(error);
    }
};
