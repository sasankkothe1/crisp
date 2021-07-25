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

const { uploadS3Template } = require("../../middleware/upload");

const uploadS3 = uploadS3Template(mimetypes);

router.post(
    "/addRecipe",
    isAuthenticated,
    uploadS3.array("media"),
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
    uploadS3.array("media"),
    RecipeController.update
);
router.delete("/:id", isAuthenticated, RecipeController.remove);

module.exports = router;
