const multer = require('multer');
const path = require('path');

// Setting Storage Engine
const storage = multer.diskStorage({
	destination: '../public/uploads/',
	filename: (req, file, cb) => {
		cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
	}
});

// Ensures that file is a valid image format.
const checkFileType = (file, cb) => {
	const filetypes = /jpeg|jpg|png|gif/;
	const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
	const mimetype = filetypes.test(file.mimetype);

	if (mimetype && extname) {
		return cb(null, true);
	}

	return cb('Error: Images Only');
};

const upload = multer({
	storage,
	limits: { fileSize: 1000000 },
	fileFilter: function (req, file, cb) {
		checkFileType(file, cb);
	}
});

module.exports = upload;