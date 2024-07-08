import express from 'express';
import { isAuth } from '../middlewares/authMiddleware';

import fileController from '../controllers/fileController'
import { upload } from '../middlewares/fileMiddlewares';

const router = express.Router();

router.post('/upload', isAuth, upload.single('file'), fileController.uploadFile)

export = router