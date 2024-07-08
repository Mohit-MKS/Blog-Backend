import express from 'express';
import { isAuth } from '../middlewares/authMiddleware';

import fileController from '../controllers/fileController'

const router = express.Router();

router.post('/upload', isAuth, fileController.uploadFile)

export = router