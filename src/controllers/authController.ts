import User from "../models/schemas/User";

const signUp = async (req, res, next) => {
    try {
        const { name, email, password, role } = req.body;

        const newUser = new User.userSchema({ name, email, password, role })
        await newUser.save();
        res.status(201).json({ message: "User registered successfully" })

    } catch (error) {
        next(error)
    }

}

export default { signUp }