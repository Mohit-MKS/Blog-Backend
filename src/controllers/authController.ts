import { User } from "../models/schemas/User";
import { comparePassword, hashPassword } from "../services/encryptionService";
import { generateToken, generateCode } from "../services/authService";
import { sendEmail } from "../services/emailService";
import { NextFunction, Request } from "express";
import { IUser } from "../models/interfaces/user.interface";
import { ApiRequest, ApiResponse } from "../models/interfaces/common.interfaces";

const signUp = async (req: Request, res: ApiResponse, next: NextFunction) => {
  try {
    const { name, email, password, role } = req.body;

    const hashedPassword = await hashPassword(password);

    const newUser = await User.create({ name, email, password: hashedPassword, role })
    if (newUser)
      res.status(201).json({ message: "User registered successfully" })

  } catch (error) {
    next(error)
  }

}

const signIn = async (req: Request, res: ApiResponse, next: NextFunction) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email });
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
    const user = await User.findOne({ email })
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
    const user = await User.findOne({ email });

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
    const user = await User.findOne({ email });

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
    const user = await User.findOne({ email });

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
    const { _id } = req.user as IUser;
    const user = await User.findById({ _id });
    if (!user) {
      res.code = 404;
      throw new Error("User not found");
    }

    const match = await comparePassword(oldPassword, user.password)
    if (!match) {
      res.code = 400;
      throw new Error("Old password is incorrect");
    }

    if (oldPassword === newPassword) {
      res.code = 400;
      throw new Error("New and old password are same");
    }

    const hashedPassword = await hashPassword(newPassword);
    user.password = hashedPassword;
    await user.save()

    res.status(200).json({ code: 200, status: true, message: "Password changed successfully" })

  } catch (error) {
    next(error);
  }

}

const updateProfile = async (req: ApiRequest, res: ApiResponse, next: NextFunction) => {
  try {
    const { _id } = req.user as IUser;
    const { email, name } = req.body;
    const user = await User.findById(_id)
    if (!user) {
      res.code = 404;
      throw new Error("User not found");
    }

    user.name = name ? name : user.name;
    user.email = email ? email : user.email;
    if (email) {
      user.isVerified = false;
    }
    await user.save();
    res.status(200).json({ code: 200, status: true, message: "User profile updated" })

  } catch (error) {
    next(error)
  }
}
const updateProfilePic = async (req: ApiRequest, res: ApiResponse, next: NextFunction) => {
  try {
    const { _id } = req.user as IUser;
    const user = await User.findById(_id)
    if (!user) {
      res.code = 404;
      throw new Error("User not found");
    }
    if (req.file) {
      user.profilePic = {
        data: req.file.buffer,
        contentType: req.file.mimetype
      };
      await user.save();
      res.status(200).json({ code: 200, status: true, message: "User profile pic updated" })
    } else {
      res.status(400).send('No file uploaded');
    }

  } catch (error) {
    next(error)
  }
}

const getLoginUser = async (req: ApiRequest, res: ApiResponse, next: NextFunction) => {
  try {
    const { _id } = req.user as IUser;
    const user = await User.findById(_id).select("-password -verificationCode -forgotPasswordCode")
    if (!user) {
      res.code = 404;
      throw new Error("User not found");
    }

    const userObj = user.toObject()
    const profilePicBase64 = user.profilePic ? user.profilePic.data.toString('base64') : null;
    const profilePicDataURL = profilePicBase64 ? `data:${user.profilePic?.contentType};base64,${profilePicBase64}` : null;
    delete userObj.profilePic
    userObj.userPic = profilePicDataURL

    res.status(200).json({ code: 200, status: true, message: "Get current user successful", data: { user: userObj } })

  } catch (error) {
    next(error)
  }
}


export default {
  signUp, signIn, verifyCode, verifyUser,
  forgotPassword, resetPassword, changePassword,
  updateProfile, updateProfilePic, getLoginUser
}