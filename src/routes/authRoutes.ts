import express from 'express';
import authController from '../controllers/authController';
import { validateSignUp, validateErrors, validateSignIn, validateEmail, verifyUserValidator } from '../validators/authValidator';

const router = express.Router();

router.post("/signup", validateSignUp, validateErrors, authController.signUp)
router.post("/signin", validateSignIn, validateErrors, authController.signIn)


router.post("/send-verification-email", validateEmail, validateErrors, authController.verifyCode)
router.post("/verify-user", verifyUserValidator, validateErrors, authController.verifyUser)
router.post("/forgot-password-code", validateEmail, validateErrors, authController.forgotPassword)



export = router