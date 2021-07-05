const express = require("express");
const router = express.Router();

const EventController = require("../../controllers/event");
const { isAuthenticated } = require("../../middleware/auth");

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

const upload = require("../../middleware/upload")(mimetypes);

router.post(
    "/",
    isAuthenticated,
    upload.array("media"),
    EventController.create
);
router.get("/test", EventController.test);
router.get("/", EventController.listEvents);
router.get("/new", EventController.listNewEvents);
router.get(
    "/postedBy/:id",
    isAuthenticated,
    EventController.listEventsByUserID
);
router.get("/soonEnding", EventController.listSoonEndingEvents);
router.get("/:id", isAuthenticated, EventController.read);
router.put(
    "/:id",
    isAuthenticated,
    upload.array("media"),
    EventController.update
);
router.delete("/:id", isAuthenticated, EventController.remove);

module.exports = router;
