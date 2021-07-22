const express = require("express");
const router = express.Router();

const { isAuthenticated, authenticateIfPossible } = require("../../middleware/auth");

/*
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
    // TODO: add pdf
];*/

const { uploadS3 } = require("../../middleware/upload");

const RecipeCollectionController = require("../../controllers/recipe_collection");

// Get all collections
router.get(
    "/", 
    authenticateIfPossible,
    RecipeCollectionController.getRecipeCollections
);

// Add new collection
// Auth: User

// TODO: how to upload the pdf as well?
router.post(
    "/",
    isAuthenticated,
    uploadS3.fields([
        {
            name: 'media'
        },
        {
            name: 'pdfFile',
            maxCount: 1,
        }
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

// Edit specific collection
// Auth: User
router.put(
    "/:id",
    isAuthenticated,
    //upload.array("media"),
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
