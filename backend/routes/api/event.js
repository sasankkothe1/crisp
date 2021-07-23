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

<<<<<<< HEAD
const { uploadTemplate } = require("../../middleware/upload");

const upload = uploadTemplate(mimetypes);
=======
const { upload2 } = require("../../middleware/upload");

const upload = upload2(mimetypes);
>>>>>>> 59764e1f8deeda206fecc733153c004f73a8dd87

router.post(
    "/addEvent",
    isAuthenticated,
    upload.array("media"),
    EventController.create
);
router.get("/sideBarEvents", EventController.listSideBarEvents)
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
