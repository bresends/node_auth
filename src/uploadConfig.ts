import multer from 'multer';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Create the uploads folder if it doesn't exist
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});

export const multerUpload = multer({ storage: storage });
