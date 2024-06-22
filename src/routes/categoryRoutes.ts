import express from 'express';
import categoryController from '../controllers/categoryController';
import categoryValidators from '../validators/categoryValidators';
import { isAuth } from '../middlewares/authMiddleware';

const router = express.Router();

router.post("/add-category", isAuth, categoryValidators.validateAddCategory, categoryController.addCategory)




export = router