import express from 'express';
import authController from '../controllers/authController';
import authValidator from '../validators/authValidator';
import { isAuth } from '../middlewares/authMiddleware';

const router = express.Router();

router.post("/signup", authValidator.validateSignUp, authController.signUp)
router.post("/signin", authValidator.validateSignIn, authController.signIn)


router.post("/send-verification-email", authValidator.validateEmail, authController.verifyCode)
router.post("/verify-user", authValidator.verifyUserValidator, authController.verifyUser)
router.post("/forgot-password-code", authValidator.validateEmail, authController.forgotPassword)
router.post("/reset-password", authValidator.resetPasswordValidator, authController.resetPassword)
router.post("/change-password", authValidator.resetPasswordValidator, isAuth, authController.changePassword)
router.post("/update-profile", authValidator.updateProfile, authController.resetPassword)



export = router