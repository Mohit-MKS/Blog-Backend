import express from 'express';
import categoryController from '../controllers/categoryController';
import categoryValidators from '../validators/categoryValidators';
import { isAdmin, isAuth } from '../middlewares/authMiddleware';

const router = express.Router();

router.post("/", isAuth, isAdmin, categoryValidators.validateAddCategory, categoryController.addCategory)

router.put("/:categoryId", isAuth, isAdmin, categoryController.updateCategory)




export = router