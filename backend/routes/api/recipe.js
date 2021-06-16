const express = require("express");
const router = express.Router();

const RecipeController = require("../../controllers/recipe");

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
    RecipeController.create
);
router.get("/", RecipeController.listRecipes);
router.get("/new", RecipeController.listNewRecipes);
router.get(
    "/postedBy/:id",
    protect,
    RecipeController.listRecipesByUserID
);
router.get("/:cuisine", RecipeController.listRecipesByCuisine);
router.get("/:id", protect, RecipeController.read);
router.put(
    "/:id",
    protect,
    upload.array("media"),
    RecipeController.update
);
router.delete("/:id", protect, RecipeController.remove);

module.exports = router;
