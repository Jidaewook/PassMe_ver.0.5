const multer = require('multer');

const imageStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString() + file.originalname);
    }

});

const imageFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

exports.upload = multer({
    storage: imageStorage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: imageFilter

});