import { body, ValidationChain } from "express-validator";
import { validateErrors } from "./errorValidator";

const validateAddCategory = [
  body("title")
    .notEmpty().withMessage("Title is required"),

  body("desc")
    .notEmpty().withMessage("Description is required"),


];

export default {
  validateAddCategory: [validateAddCategory, validateErrors] as ValidationChain[]
}