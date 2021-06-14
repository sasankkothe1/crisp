const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

const RecipeController = require('../../controllers/recipe');
const middleware = require('../../middleware/auth')
const mimetypes = ['image/png', 'image/jpg', 'image/jpeg', 'image/gif', 'video/mp4', 'video/quicktime', 'video/x-ms-wmv', 'video/x-msvideo', 'video/MP2T'];

const multer = require('multer')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/uploads/');
    },
    filename: (req, file, cb) => {
        const fileName = file.originalname.toLowerCase().split(' ').join('-');
        cb(null, uuidv4() + '-' + fileName)
    }
})

const fileFilter = (req, file, cb) => {
    if (!req.files || !req.files.file || !mimetypes.includes(req.files.file.mimetype)) cb(null, true);
    else {
        cb(null, false);
        return cb(new Error('Only .png, .jpg, .jpeg, .gif, .mp4, .mov, .wmv, .avi format allowed'));
    }
}

// 10mb file size is allowed
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 1024 * 1024 * 10
    }
})

router.post('/', middleware.protect, upload.array('media'), RecipeController.create);
router.get('/', RecipeController.listRecipes);
router.get('/new', RecipeController.listNewRecipes);
router.get('/postedBy/:id', middleware.protect, RecipeController.listRecipesByUserID);
router.get('/:cuisine', RecipeController.listRecipesByCuisine)
router.get('/:id', middleware.protect, RecipeController.read);
router.put('/:id', middleware.protect, upload.array('media'), RecipeController.update);
router.delete('/:id', middleware.protect, RecipeController.remove);

module.exports = router