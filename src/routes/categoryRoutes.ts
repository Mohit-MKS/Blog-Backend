import express from 'express';
import categoryController from '../controllers/categoryController';
import categoryValidators from '../validators/categoryValidators';
import { idAdmin, isAuth } from '../middlewares/authMiddleware';

const router = express.Router();

router.post("/add-category", isAuth, idAdmin, categoryValidators.validateAddCategory, categoryController.addCategory)




export = router