const express = require("express");
const router = express.Router();

const RecipeController = require("../../controllers/recipe");

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
    "/addRecipe",
    isAuthenticated,
    upload.array("media"),
    RecipeController.create
);
router.get("/", RecipeController.listRecipes);
router.get("/new", RecipeController.listNewRecipes);
router.get(
    "/postedBy/:id",
    isAuthenticated,
    RecipeController.listRecipesByUserID
);
router.get("/:cuisine", RecipeController.listRecipesByCuisine);
router.get("/:id", isAuthenticated, RecipeController.read);
router.put(
    "/:id",
    isAuthenticated,
    upload.array("media"),
    RecipeController.update
);
router.delete("/:id", isAuthenticated, RecipeController.remove);

module.exports = router;
