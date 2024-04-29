import User from "../models/schemas/User";
import { comparePassword, hashPassword } from "../services/encryptionService";
import { generateToken, generateCode } from "../services/authService";
import { sendEmail } from "../services/emailService";

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

const verifyCode = async (req, res, next) => {
    try {
        const { email } = req.body;
        const user = await User.userSchema.findOne({ email })
        if (!user) {
            res.code = 404;
            throw new Error("User not found");
        }

        if (user.isVerified) {
            res.code = 400;
            throw new Error("User already verified");
        }

        const code = generateCode(6);
        user.verificationCode = code;
        await user.save();

        await sendEmail({
            mailTo: user.email,
            subject: "Email Verification Code",
            code,
            content: "verify your account"
        })

        res.status(200).json({ code: 200, status: true, message: "User verification code sent successfully" })

    } catch (error) {
        next(error)

    }
}


const verifyUser = async (req, res, next) => {
    try {
        const { code, email } = req.body;
        const user = await User.userSchema.findOne({ email });

        if (!user) {
            res.code = 404;
            throw new Error("User not found")
        }

        if (user.verificationCode !== code) {
            res.code = 400;
            throw new Error("Invalid code")
        }
        user.isVerified = true;
        user.verificationCode = null;
        await user.save();

        res.status(200).json({ code: 200, status: true, message: "User verified successfully" });


    } catch (error) {
        next(error);

    }
}


const forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;
        const user = await User.userSchema.findOne({ email });

        if (!user) {
            res.code = 404;
            throw new Error("User not found");
        }

        const code = generateCode(6);
        user.forgotPasswordCode = code;
        await user.save();

        await sendEmail({
            mailTo: user.email,
            subject: "Forgot password code",
            code,
            content: "change your password"
        })

        res.status(200).json({ code: 200, status: true, message: "Forgot password code sent successfully" })

    } catch (error) {
        next(error);
    }

}

export default { signUp, signIn, verifyCode, verifyUser, forgotPassword }