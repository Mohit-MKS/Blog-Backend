import express from 'express';
import authController from '../controllers/authController';
import { validateSignUp, validateErrors, validateSignIn, validateEmail } from '../validators/authValidator';

const router = express.Router();

router.post("/signup", validateSignUp, validateErrors, authController.signUp)
router.post("/signin", validateSignIn, validateErrors, authController.signIn)


router.post("/send-verification-email", validateEmail, validateErrors, authController.verifyCode)



export = router