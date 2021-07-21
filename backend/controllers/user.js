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
