const multer = require("multer");
const { v4: uuidv4 } = require("uuid");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./public/uploads/");
    },
    filename: (req, file, cb) => {
        const fileName = file.originalname.toLowerCase().split(" ").join("-");
        cb(null, uuidv4() + "-" + fileName);
    },
});

const upload = function(mimetypes) {
	return multer({
		storage: storage,
		fileFilter: (req, file, next) => {
			if (
				!file ||
				!mimetypes.includes(file.mimetype)
			) {
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
		}
	});
};

module.exports = upload;
