const { PartnerApplication } = require("../model/PartnerApplication");
const { VerifiedPartner } = require("../model/VerifiedPartner");
const { PartnerManager } = require("../model/PartnerManager");
const ErrorResponse = require("../utils/errorResponse");
const User = require("../model/User");
const sendEmail = require("../utils/sendMail");

const getAll = (req, res, next) => {
    PartnerApplication.find({}, function (error, applications) {
        if (error) {
            next(error);
        }

        return res.status(200).json({
            success: true,
            data: applications,
        });
    });
};

const getById = async (req, res, next) => {
    try {
        const application = await PartnerApplication.find({
            user: req.user._id,
        });

        return res.status(200).json({
            success: true,
            data: application,
        });
    } catch (error) {
        return next(error);
    }
};

const create = async (req, res, next) => {
    const user = await PartnerApplication.findById(req.user._id);

    if (user) {
        return res.status(400).json({
            success: false,
            message: "User already has a pending application",
        });
    }

    PartnerApplication.create({ user: req.user._id }, function (error, application) {
        if (error) {
            next(error);
        }

        return res.status(200).json({
            success: true,
            data: application,
        });
    });
};

const approve = async (req, res, next) => {
    const { application, partnerManagerID } = req.body;

    try {
        await VerifiedPartner.create({
            user: application.user,
            partnerManager: partnerManagerID,
        });

        User.findByIdAndUpdate(
            application.user,
            {
                role: "Partner",
            },
            async function (error, user) {
                if (error) {
                    return next(error);
                }

                const partnerManager = await PartnerManager.findById(
                    partnerManagerID
                );

                const message = `
                <h1>Your application for partnership has been approved</h1>
                <p>Welcome to the CRiSP Partner Program!</p>
                <p>You'll find your partner manager's contact information below:</p>
                <p>Name: ${partnerManager.name}</p>
                <p>Email: ${partnerManager.email}</p>
                <p>Your partner manager will contact you soon, but feel free to contact them whenever you need help. :)</p>
            `;

                try {
                    await sendEmail({
                        to: await getUserEmail(application.user),
                        subject: "Partnership Application Approval",
                        text: message,
                    });

                    res.status(200).json({
                        success: true,
                        data: "Application Rejection Email Sent",
                    });
                } catch (error) {
                    return next(
                        new ErrorResponse("Email could not be sent", 500)
                    );
                }
            }
        );
    } catch (error) {
        return next(error);
    }
};

const reject = async (req, res, next) => {
    const { application } = req.body;

    const message = `
            <h1>Your application for partnership has been rejected</h1>
            <p>Please apply again when you've made more contributions to CRiSP</p>
        `;

    try {
        await sendEmail({
            to: await getUserEmail(application.user),
            subject: "Partnership Application Rejection",
            text: message,
        });

        res.status(200).json({
            success: true,
            data: "Application Rejection Email Sent",
        });
    } catch (error) {
        return next(new ErrorResponse("Email could not be sent", 500));
    }
};

const getUserEmail = async (id) => {
    const user = await User.findById(id);
    return user.email;
};

module.exports = {
    getAll,
    getById,
    create,
    approve,
    reject,
};
