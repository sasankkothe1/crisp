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

const { uploadS3Template } = require("../../middleware/upload");

const uploadS3 = uploadS3Template(mimetypes);

router.post(
    "/addEvent",
    isAuthenticated,
    uploadS3.array("media"),
    EventController.create
);
router.get("/sideBarEvents", EventController.listSideBarEvents);
router.get("/", EventController.listEvents);
router.get("/new", EventController.listNewEvents);
router.get(
    "/postedBy/:id",
    isAuthenticated,
    EventController.listEventsByUserID
);
router.get("/soonEnding", EventController.listSoonEndingEvents);
router.get("/eventByID/:id", EventController.read);
router.put(
    "/:id",
    uploadS3.array("media"),
    EventController.update
);
router.delete("/:id", isAuthenticated, EventController.remove);

module.exports = router;
