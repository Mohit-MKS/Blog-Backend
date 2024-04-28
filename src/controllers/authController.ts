import User from "../models/schemas/User";
import { comparePassword, hashPassword } from "../services/encryptionService";
import { generateToken } from "../services/tokenService";

const signUp = async (req, res, next) => {
    try {
        const { name, email, password, role } = req.body;

        const hashedPassword = await hashPassword(password);

        const newUser = new User.userSchema({ name, email, password: hashedPassword, role })
        await newUser.save();
        res.status(201).json({ message: "User registered successfully" })

    } catch (error) {
        next(error)
    }

}

const signIn = async (req, res, next) => {
    try {
        const { email, password } = req.body
        const user = await User.userSchema.findOne({ email });
        if (!user) {
            res.code = 401;
            throw new Error("Invalid Credential")
        }

        const passMatched = await comparePassword(password, user.password)
        if (!passMatched) {
            res.code = 401;
            throw new Error("Invalid Credential")
        }

        const token = generateToken(user);
        res.status(200).json(
            {
                code: 200, status: true,
                message: "User signin successful",
                data: { token: token }
            }
        )


    } catch (error) {
        next(error)

    }

}

export default { signUp, signIn }