import express from 'express';
import authController from '../controllers/authController';
import { validateSignUp, validateErrors, validateSignIn } from '../validators/authValidator';

const router = express.Router();

router.post("/signup", validateSignUp, validateErrors, authController.signUp)
router.post("/signin", validateSignIn, validateErrors, authController.signIn)



export = router