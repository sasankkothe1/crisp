const multer = require("multer");
const { v4: uuidv4 } = require("uuid");

const multerS3 = require("multer-s3");

const AWS = require("aws-sdk");
AWS.config.update({
    region: "eu-central-1",
    accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
});

const s3 = new AWS.S3();

const removeFileFromS3 = (link) => {
    const key = link.split("/").slice(-1)[0];
    s3.deleteObject(
        { Bucket: process.env.AWS_S3_BUCKET, Key: key },
        (err, data) => {
            if (err) {
                console.log(err, err.stack);
            }
        }
    );
};

const uploadS3Template = function (mimetypes) {
    return multer({
        storage: multerS3({
            s3: s3,
            bucket: process.env.AWS_S3_BUCKET,
            acl: "public-read",
            contentType: multerS3.AUTO_CONTENT_TYPE,
            key: function (req, file, cb) {
                const fileType = file.originalname
                    .toLowerCase()
                    .split(".")
                    .slice(-1)[0];
                cb(null, `${uuidv4()}-${Date.now().toString()}.${fileType}`);
            },
        }),
        limits: { fileSize: 1024 * 1024 * 10 },
        fileFilter: function (req, file, next) {
            if (!file || !mimetypes.includes(file.mimetype)) {
                return next(
                    new Error(
                        "Incorrect file format, only media types are currently supported."
                    )
                );
            } else {
                next(null, true);
            }
        },
    });
};

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./public/uploads/");
    },
    filename: (req, file, cb) => {
        const fileName = file.originalname.toLowerCase().split(" ").join("-");
        cb(null, uuidv4() + "-" + fileName);
    },
});

const uploadTemplate = function (mimetypes) {
    return multer({
        storage: storage,
        fileFilter: (req, file, next) => {
            if (!file || !mimetypes.includes(file.mimetype)) {
                return next(
                    new Error(
                        "Incorrect file format, only media types are currently supported."
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
    uploadTemplate,
    uploadS3Template,
    removeFileFromS3,
};
