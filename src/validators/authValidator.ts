import { body, ValidationChain } from "express-validator";
import { validateErrors } from "./errorValidator";
import validationService from "../services/validationService";

const validateSignUp = [
  body("name").notEmpty().withMessage("Name is required"),

  body("email")
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Invalid email"),

  body("password")
    .isLength({ min: 6 }).withMessage("Password should be min 6 characters long")
    .notEmpty().withMessage("Password is required")


];

const validateSignIn = [
  body("email")
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Invalid email"),

  body("password")
    .notEmpty().withMessage("Password is required")
];

const validateEmail = [
  body("email")
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Invalid email")
];


const verifyUserValidator = [
  ...validateEmail,

  body("code")
    .notEmpty().withMessage("Code is required")
]



const resetPasswordValidator = [
  ...validateEmail,

  body("code")
    .notEmpty().withMessage("Code is required"),

  body("password")
    .isLength({ min: 6 }).withMessage("Password should be min 6 characters long")
    .notEmpty().withMessage("Password is required")

]

const changePasswordValidator = [
  body("oldPassword")
    .notEmpty().withMessage("Old password is required"),

  body("newPassword")
    .notEmpty().withMessage("New password is required")
]

const updateProfile = [
  body("email").custom(async (email) => {
    if (email) {
      const isValidEmail = validationService.validateEmail(email);
      if (!isValidEmail) {
        throw "Invalid email";
      }
    }
  })
]



export default {
  validateSignUp: [validateSignUp, validateErrors] as ValidationChain[],
  validateSignIn: [validateSignIn, validateErrors] as ValidationChain[],
  validateEmail: [validateEmail, validateErrors] as ValidationChain[],
  verifyUserValidator: [verifyUserValidator, validateErrors] as ValidationChain[],
  resetPasswordValidator: [resetPasswordValidator, validateErrors] as ValidationChain[],
  changePasswordValidator: [changePasswordValidator, validateErrors] as ValidationChain[],
  updateProfile: [updateProfile, validateErrors] as ValidationChain[],
}

