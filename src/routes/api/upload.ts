import { Router } from 'express';
import { verifyJWT } from '../../middleware/verifyJWT.js';
import { verifyRole } from '../../middleware/verifyRoles.js';
import { multerUpload } from '../../uploadConfig.js';
export const upload = Router();

upload.use(verifyJWT);
upload.use(verifyRole(['user', 'admin', 'editor']));

upload.post('/', multerUpload.single('image'), async (req, res) => {
    try {
        res.status(200).json('Upload Success: ' + req.file?.filename);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});
