const express = require("express");
const router = express.Router();

const {
    isAuthenticated,
    authenticateIfPossible,
} = require("../../middleware/auth");

const RecipeCollectionController = require("../../controllers/recipe_collection");

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
    "application/pdf",
];

const { uploadS3Template } = require("../../middleware/upload");

const uploadS3 = uploadS3Template(mimetypes);

// Get all collections
router.get(
    "/",
    authenticateIfPossible,
    RecipeCollectionController.getRecipeCollections
);

// Add new collection
// Auth: User
router.post(
    "/",
    isAuthenticated,
    uploadS3.fields([
        {
            name: "media",
        },
        {
            name: "pdfFile",
            maxCount: 1,
        },
    ]),
    RecipeCollectionController.createRecipeCollection
);

// Get specific collection
// Auth: None
router.get(
    "/:id",
    authenticateIfPossible,
    RecipeCollectionController.getRecipeCollection
);

// Get specific collection direct link
router.get(
    "/:id/link",
    isAuthenticated,
    RecipeCollectionController.getRecipeCollectionLink
);

// Edit specific collection
// Auth: User
router.put(
    "/:id",
    isAuthenticated,
    uploadS3.fields([
        {
            name: "media",
        },
        {
            name: "pdfFile",
            maxCount: 1,
        },
    ]),
    RecipeCollectionController.editRecipeCollection
);

// Remove specific collection
// Auth: User
router.delete(
    "/:id",
    isAuthenticated,
    RecipeCollectionController.removeRecipeCollection
);

module.exports = router;
