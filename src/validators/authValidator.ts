import { body, validationResult } from "express-validator";

const validateSignUp = [
    body("name").notEmpty().withMessage("Name is required"),

    body("email")
        .isEmail().withMessage("Invalid email")
        .notEmpty().withMessage("Email is required"),

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


const validateErrors = (req, res, next) => {
    const errors = validationResult(req);
    const errorsObj = {}
    if (errors.isEmpty())
        return next();


    errors.array().map((error: any) => {
        errorsObj[error.path] = error.msg;
    })

    return res.status(400).json({ message: errorsObj })
}




export { validateSignUp, validateSignIn, validateErrors }