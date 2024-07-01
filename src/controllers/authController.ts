import { UserSchema } from "../models/schemas/User";
import { comparePassword, hashPassword } from "../services/encryptionService";
import { generateToken, generateCode } from "../services/authService";
import { sendEmail } from "../services/emailService";
import { NextFunction, Request } from "express";
import { ApiResponse } from "../models/interfaces/response.interface";
import { ApiRequest } from "../models/interfaces/requests.interface";

const signUp = async (req: Request, res: ApiResponse, next: NextFunction) => {
  try {
    const { name, email, password, role } = req.body;

    const hashedPassword = await hashPassword(password);

    const newUser = await UserSchema.create({ name, email, password: hashedPassword, role })
    if (newUser)
      res.status(201).json({ message: "User registered successfully" })

  } catch (error) {
    next(error)
  }

}

const signIn = async (req: Request, res: ApiResponse, next: NextFunction) => {
  try {
    const { email, password } = req.body
    const user = await UserSchema.findOne({ email });
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

const verifyCode = async (req: Request, res: ApiResponse, next: NextFunction) => {
  try {
    const { email } = req.body;
    const user = await UserSchema.findOne({ email })
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


const verifyUser = async (req: Request, res: ApiResponse, next: NextFunction) => {
  try {
    const { code, email } = req.body;
    const user = await UserSchema.findOne({ email });

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


const forgotPassword = async (req: Request, res: ApiResponse, next: NextFunction) => {
  try {
    const { email } = req.body;
    const user = await UserSchema.findOne({ email });

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

const resetPassword = async (req: Request, res: ApiResponse, next: NextFunction) => {
  try {
    const { email, code, password } = req.body;
    const user = await UserSchema.findOne({ email });

    if (!user) {
      res.code = 404;
      throw new Error("User not found");
    }

    if (user.forgotPasswordCode !== code) {
      res.code = 400;
      throw new Error("Invalid code")
    }

    const hashedPassword = await hashPassword(password);

    user.password = hashedPassword;
    user.forgotPasswordCode = null;
    await user.save();

    res.status(200).json({ code: 200, status: true, message: "Password reset successful" })

  } catch (error) {
    next(error)

  }
}

const changePassword = async (req: ApiRequest, res: ApiResponse, next: NextFunction) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const { _id } = req.user;
    const user = await UserSchema.findById({ _id });
    if (!user) {
      res.code = 404;
      throw new Error("User not found");
    }

    const match = await comparePassword(oldPassword, user.password)
  } catch (error) {

  }

}

export default { signUp, signIn, verifyCode, verifyUser, forgotPassword, resetPassword }