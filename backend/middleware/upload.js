const multer = require("multer");
const { v4: uuidv4 } = require("uuid");

const multerS3 = require("multer-s3");

const AWS = require('aws-sdk');
AWS.config.update({
    region: 'eu-central-1'
});

const s3 = new AWS.S3();

const uploadS3 = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'sebis-ggr',
        acl: 'public-read',
        contentType: multerS3.AUTO_CONTENT_TYPE, 
        key: function (req, file, cb) {
            const fileType = file.originalname.toLowerCase().split(".").slice(-1)[0];
            cb(null, `${Date.now().toString()}.${fileType}`);
        }
    })
});

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./public/uploads/");
    },
    filename: (req, file, cb) => {
        const fileName = file.originalname.toLowerCase().split(" ").join("-");
        cb(null, uuidv4() + "-" + fileName);
    },
});

const upload = function (mimetypes) {
    return multer({
        storage: storage,
        fileFilter: (req, file, next) => {
            if (!file || !mimetypes.includes(file.mimetype)) {
                return next(
                    new Error(
                        "Incorrent file format, only media types are currently supported."
                    )
                );
            } else {
                next(null, true);
            }
        },
        limits: {
            fileSize: 1024 * 1024 * 10,
        },
    });
};

module.exports = {
    upload2: upload,
    uploadS3
};
