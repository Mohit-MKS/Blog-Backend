import { CategorySchema } from "../models/schemas/Category";
import { UserSchema } from "../models/schemas/User";



const addCategory = async (req, res, next) => {
  try {
    const { title, desc } = req.body;
    const { _id } = req.user

    const isCategory = await CategorySchema.findOne({ title });
    if (isCategory) {
      res.code = 400;
      throw new Error("Category already exist");
    }

    const user = await UserSchema.findById(_id);
    if (!user) {
      res.code = 400;
      throw new Error("User not found");
    }

    const newCategory = new CategorySchema({ title, desc, updatedBy: _id })
    await newCategory.save();
    res.status(201).json({ code: 200, status: true, message: "Category created successfully" })

  } catch (error) {
    next(error)
  }

}


export default { addCategory }
