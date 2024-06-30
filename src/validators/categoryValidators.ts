import { body, ValidationChain } from "express-validator";
import { validateErrors } from "./errorValidator";

const validateAddCategory = [
  body("name").notEmpty().withMessage("Name is required"),

  body("email")
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Invalid email"),

  body("password")
    .isLength({ min: 6 }).withMessage("Password should be min 6 characters long")
    .notEmpty().withMessage("Password is required")


];

export default {
  validateAddCategory: [validateAddCategory, validateErrors] as ValidationChain[]
}