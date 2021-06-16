const express = require("express");
const router = express.Router();

const EventController = require("../../controllers/event");
const { protect } = require("../../middleware/auth");

const mimetypes = [
    "image/png",
    "image/jpg",
    "image/jpeg",
    "image/gif",
    "video/mp4",
    "video/quicktime",
    "video/x-ms-wmv",
    "video/x-msvideo",
    "video/MP2T",
];

const upload = require('../../middleware/upload')(mimetypes);

router.post(
    "/",
    protect,
    upload.array("media"),
    EventController.create
);
router.get("/", EventController.listEvents);
router.get("/new", EventController.listNewEvents);
router.get(
    "/postedBy/:id",
    protect,
    EventController.listEventsByUserID
);
router.get("/soonEnding", EventController.listSoonEndingEvents);
router.get("/:id", protect, EventController.read);
router.put(
    "/:id",
    protect,
    upload.array("media"),
    EventController.update
);
router.delete("/:id", protect, EventController.remove);

module.exports = router;
