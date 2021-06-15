const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const BillingInfoSchema = require("./BillingInfo");

const UserSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, "Please provide your first name"],
    },
    lastName: {
        type: String,
        required: [true, "Please provide you last name"],
    },
    role: {
        type: String,
        enum: ["User", "Partner", "Admin"],
        default: "User",
    },
    username: {
        type: String,
        required: [true, "Please provide a username"],
        unique: true,
    },
    email: {
        type: String,
        required: [true, "Please provide an email"],
        unique: true,
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            "Please provide a valid email",
        ],
    },
    password: {
        type: String,
        required: [true, "Please add a password"],
        minlength: 6,
        select: false,
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    profilePicture: String,
    posts: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
        default: [],
    },
    recipePosts: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
        default: [],
    },
    eventPosts: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
        default: [],
    },
    following: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
        default: [],
    },
    subscriptions: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
        default: [],
    },
    billingInfo: BillingInfoSchema,
});

UserSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        next();
    }

    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

UserSchema.methods.matchPasswords = async function (password) {
    return await bcrypt.compare(password, this.password);
};

UserSchema.methods.getSignedToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
    });
};

UserSchema.virtual("isUser").get(function () {
    return this.role === "User";
});

UserSchema.virtual("isPartner").get(function () {
    return this.role === "Partner";
});

UserSchema.virtual("isAdmin").get(function () {
    return this.role === "Admin";
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
