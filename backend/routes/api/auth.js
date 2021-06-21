const express = require("express");
const router = express.Router();
const { isAuthenticated, isAdmin } = require("../../middleware/auth");

const {
    register,
    adminRegister,
    login,
    adminLogin,
    forgotpassword,
    resetpassword,
} = require("../../controllers/auth");

// Register new user
// Auth: Unauthenticated
router.post("/register", register);

// Register new admin through admin portal
// Auth: Admin
router.post("/admin/register", isAuthenticated, isAdmin, adminRegister);

// Login to CRiSP
// Auth: Unauthenticated
router.route("/login").post(login);

// Login to admin portal
// Auth: Unauthenticated
router.route("/admin/login").post(adminLogin);

// Request Password Reset (send password reset email)
// Auth: Unauthenticated
router.route("/forgotpassword").post(forgotpassword);

// Perform Password Reset
// Auth: Unauthenticated (reachable through password reset email)
router.route("/resetpassword:resetToken").post(resetpassword);

module.exports = router;
