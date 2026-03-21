import express from 'express';
import multer from 'multer';
import { uploadDocument } from '../controllers/uploadController.js';
import { sendEmailAlert } from '../controllers/emailController.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/upload', upload.single('file'), uploadDocument);
router.post('/send-email', sendEmailAlert);

export default router;
