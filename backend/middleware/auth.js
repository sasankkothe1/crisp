const jwt = require("jsonwebtoken");
const User = require("../model/User");
const ErrorResponse = require("../utils/errorResponse");

exports.authenticateIfPossible = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
        next();
        return;
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded._id);

        if (user) {
            req.user = user;
        }

        next();
    } catch (error) {
        return next(
            new ErrorResponse("Something weird happened", 502)
        );
    } 
}

exports.isAuthenticated = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
        return next(
            new ErrorResponse("Not authorized to access this route", 401)
        );
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded._id);

        if (!user) {
            return next(new ErrorResponse("No user found with this id", 404));
        }

        req.user = user;

        next();
    } catch (error) {
        return next(
            new ErrorResponse("Not authorized to access this route", 401)
        );
    }
};

exports.isAdmin = async (req, res, next) => {
    try {
        if (!req.user) {
            return next(
                new ErrorResponse("Not authorized to access this route", 401)
            );
        }
        if (!req.user.isAdmin) {
            return next(
                new ErrorResponse("This route requires admin privilege", 401)
            );
        }
        next();
    } catch (error) {
        return next(
            new ErrorResponse("Not authorized to access this route", 401)
        );
    }
};
