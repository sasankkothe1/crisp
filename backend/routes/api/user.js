const express = require("express");
const router = express.Router();

const {
    getUserDetails
} = require("../../controllers/user");

const User = require("../../model/User");

router.get("/getUserDetails/:id", getUserDetails)

/* router.get("/", (req, res) => {
    User.find()
        .then((users) => res.json(users))
        .catch((err) => res.status(404).send({ message: err.message }));
});

// for testing purposes (otherwise creating admins is quite hard!)
router.put("/:id", (req, res) => {
    User.findOneAndUpdate(
        {
            _id: req.params.id,
        },
        req.body,
        (err, user) => {
            if (err) {
                res.status(502).send({ message: err.message });
            } else {
                res.sendStatus(200);
            }
        }
    );
}); */

module.exports = router;
