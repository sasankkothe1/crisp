const User = require("../model/User");
const ErrorResponse = require("../utils/errorResponse");

exports.register = async (req, res, next) => {
    const { firstName, lastName, username, email, password } = req.body;

    try {
        const user = await User.create({
            firstName: firstName,
            lastName: lastName,
            username: username,
            email: email,
            password: password,
        });

        sendToken(user, 201, res);
    } catch (error) {
        next(error);
    }
};

exports.adminRegister = async (req, res, next) => {
    const { firstName, lastName, username, email, password } = req.body;

    try {
        const user = await User.create({
            firstName: firstName,
            lastName: lastName,
            role: "Admin",
            username: username,
            email: email,
            password: password,
        });

        sendToken(user, 201, res);
    } catch (error) {
        next(error);
    }
};

exports.login = async (req, res, next) => {
    const { username, email, password } = req.body;

    if (!(username || email) || !password) {
        return next(
            new ErrorResponse(
                "Please provide email or username, and password",
                400
            )
        );
    }

    try {
        const user = username
            ? await User.findOne({ username }).select("+password")
            : User.findOne({ email }).select("+password");

        if (!user) {
            return next(new ErrorResponse("Invalid credentials", 401));
        }

        const isMatch = await user.matchPasswords(password);

        if (!isMatch) {
            return next(new ErrorResponse("Invalid credentials", 401));
        }

        sendToken(user, 200, res);
    } catch (error) {
        return next(error);
    }
};

exports.adminLogin = async (req, res, next) => {
    const { username, email, password } = req.body;

    if (!(username || email) || !password) {
        return next(
            new ErrorResponse(
                "Please provide email or username, and password",
                400
            )
        );
    }

    try {
        const user = username
            ? await User.findOne({ username }).select("+password")
            : User.findOne({ email }).select("+password");

        if (!user) {
            return next(new ErrorResponse("Invalid credentials", 401));
        }

        const isMatch = await user.matchPasswords(password);

        if (!isMatch || !user.isAdmin) {
            return next(new ErrorResponse("Invalid credentials", 401));
        }

        sendToken(user, 200, res);
    } catch (error) {
        return next(error);
    }
};

exports.forgotpassword = (req, res) => {
    res.send("Forgot Password Route");
};

exports.resetpassword = (req, res) => {
    res.send("Reset Password Route");
};

const sendToken = (user, statusCode, res) => {
    const token = user.getSignedToken();
    res.status(statusCode).json({ success: true, token });
};
