import { body, ValidationChain } from "express-validator";
import { validateErrors } from "./errorValidator";
import { Types } from "mongoose";


const postValidator = [
  body("title").notEmpty().withMessage("Title is required"),

  body("category").notEmpty().withMessage("Category is required")
    .custom(async (category) => {
      if (category && !Types.ObjectId.isValid(category)) {
        throw "Invalid category id"
      }
    })
]

export default {
  validatePost: [postValidator, validateErrors] as ValidationChain[],
}