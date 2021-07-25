const express = require("express");
const router = express.Router();

const PostController = require("../../controllers/post");
const middleware = require("../../middleware/auth");
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
    "/addPost",
    middleware.isAuthenticated,
    uploadS3.array("media"),
    PostController.create
);
router.get("/", PostController.listPosts);
router.get("/new", PostController.listNewPosts);
router.get(
    "/postedBy/:id",
    middleware.isAuthenticated,
    PostController.listPostsByUserID
);
router.get("/postByID/:id", PostController.read);
router.put(
    "/:id",
    middleware.isAuthenticated,
    uploadS3.array("media"),
    PostController.update
);
router.delete("/:id", middleware.isAuthenticated, PostController.remove);

module.exports = router;
