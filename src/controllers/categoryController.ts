import Category from "../models/schemas/Category";
import User from "../models/schemas/User";



const addCategory = async (req, res, next) => {
    try {
        const { title, desc } = req.body;
        const { _id } = req.user

        const isCategory = await Category.categoryScheme.findOne({ title });
        if (isCategory) {
            res.code = 400;
            throw new Error("Category already exist");
        }

        const user = await User.userSchema.findById(_id);
        if (!user) {
            res.code = 400;
            throw new Error("User not found");
        }

        const newCategory = new Category.categoryScheme({ title, desc, updatedBy: _id })
        await newCategory.save();
        res.status(201).json({ code: 200, status: true, message: "Category created successfully" })

    } catch (error) {
        next(error)
    }

}


export default { addCategory }
