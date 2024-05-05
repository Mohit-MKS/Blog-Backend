import express from 'express';
import categoryController from '../controllers/categoryController';
import { validateAddCategory } from '../validators/categoryValidators';
import { validateErrors } from '../validators/errorValidator';
import { isAuth } from '../middlewares/isAuthMiddleware';

const router = express.Router();

router.post("/add-category", isAuth, validateAddCategory, validateErrors, categoryController.addCategory)




export = router