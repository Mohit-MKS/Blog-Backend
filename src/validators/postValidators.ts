import { body, param, ValidationChain } from "express-validator";
import { validateErrors } from "./errorValidator";
import { Types } from "mongoose";

const validateId = [
  param("postId").custom(async (id) => {
    if (id && !Types.ObjectId.isValid(id)) {
      throw "Invalid object id"
    }
  })
];



const postValidator = [
  body("title").notEmpty().withMessage("Title is required"),

  body("category").notEmpty().withMessage("Category is required")
    .custom(async (category) => {
      if (category && !Types.ObjectId.isValid(category)) {
        throw "Invalid category id"
      }
    })
]


const updatePostValidator = [
  ...validateId
]


export default {
  validatePost: [postValidator, validateErrors] as ValidationChain[],
  validateUpdatePost: [updatePostValidator, validateErrors] as ValidationChain[]
}