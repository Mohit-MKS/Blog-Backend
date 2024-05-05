import { body } from "express-validator";

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




export { validateSignUp, validateSignIn, validateEmail, verifyUserValidator, resetPasswordValidator }