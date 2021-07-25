const crypto = require("crypto");
const User = require("../model/User");
const ErrorResponse = require("../utils/errorResponse");
const sendEmail = require("../utils/sendMail");

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
        const user = await (username
            ? User.findOne({ username }).select("+password")
            : User.findOne({ email }).select("+password"));

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
        const user = await (username
            ? User.findOne({ username }).select("+password")
            : User.findOne({ email }).select("+password"));

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

exports.forgotpassword = async (req, res, next) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return next(new ErrorResponse("Email could not be sent", 404));
        }

        const resetToken = user.getResetPasswordToken();

        await user.save();

        const resetUrl = `http://localhost:3000/passwordreset/${resetToken}`;

        const message = `
            <h1>You have requested a password reset</h1>
            <p>Please go to this link to reset your password</p>
            <a href=${resetUrl} clicktracking=off>${resetUrl}</a>
        `;

        try {
            await sendEmail({
                to: user.email,
                subject: "Password Reset Request",
                text: message,
            });

            res.status(200).json({ success: true, data: "Email Sent" });
        } catch (error) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;

            await user.save();

            return next(new ErrorResponse("Email could not be sent", 500));
        }
    } catch (error) {
        next(error);
    }
};

exports.resetpassword = async (req, res, next) => {
    const { resetToken } = req.params;
    const { password } = req.body;

    const resetPasswordToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");

    try {
        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() },
        });

        if (!user) {
            return next(new ErrorResponse("Invalid Reset Token", 400));
        }

        user.password = password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();

        res.status(201).json({
            success: true,
            data: "Password Reset Success",
        });
    } catch (error) {
        next(error);
    }
};

const sendToken = (user, statusCode, res) => {
    const token = user.getSignedToken();
    res.status(statusCode).json({ success: true, token });
};
