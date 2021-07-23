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

const { uploadTemplate } = require("../../middleware/upload");

const upload = uploadTemplate(mimetypes);

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
router.get("/recipeById/:id", RecipeController.read);
router.put(
    "/:id",
    isAuthenticated,
    upload.array("media"),
    RecipeController.update
);
router.delete("/:id", isAuthenticated, RecipeController.remove);

module.exports = router;
