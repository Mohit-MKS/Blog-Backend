import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { User, UserDocument } from './schemas/user.schema';
import { File, FileDocument } from '../file/schemas/file.schema';
import { EmailService } from '../email/email.service';
import {
  comparePassword,
  hashPassword,
} from '../../common/utils/encryption.util';
import { generateCode } from '../../common/utils/code-generator.util';
import {
  ChangePasswordDto,
  ForgotPasswordDto,
  ResetPasswordDto,
  SendVerificationEmailDto,
  SignInDto,
  SignUpDto,
  UpdateProfileDto,
  VerifyUserDto,
} from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(File.name) private readonly fileModel: Model<FileDocument>,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
  ) {}

  async signUp(dto: SignUpDto) {
    const existing = await this.userModel.findOne({ email: dto.email });
    if (existing) {
      throw new BadRequestException('Email already registered');
    }

    const hashedPassword = await hashPassword(dto.password);
    const newUser = await this.userModel.create({
      name: dto.name,
      email: dto.email,
      password: hashedPassword,
      role: dto.role ?? 3,
    });

    if (newUser) {
      return { message: 'User registered successfully' };
    }
    throw new BadRequestException('User registration failed');
  }

  async signIn(dto: SignInDto) {
    const user = await this.userModel.findOne({ email: dto.email });
    if (!user) {
      throw new UnauthorizedException('Invalid Credential');
    }

    const passMatched = await comparePassword(dto.password, user.password);
    if (!passMatched) {
      throw new UnauthorizedException('Invalid Credential');
    }

    const token = this.jwtService.sign(
      {
        _id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
      },
      { expiresIn: '7d' },
    );

    return {
      code: 200,
      status: true,
      message: 'User signin successful',
      data: { token },
    };
  }

  async sendVerificationEmail(dto: SendVerificationEmailDto) {
    const user = await this.userModel.findOne({ email: dto.email });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.isVerified) {
      throw new BadRequestException('User already verified');
    }

    const code = generateCode(6);
    user.verificationCode = code;
    await user.save();

    await this.emailService.sendEmail({
      mailTo: user.email,
      subject: 'Email Verification Code',
      code,
      content: 'verify your account',
    });

    return {
      code: 200,
      status: true,
      message: 'User verification code sent successfully',
    };
  }

  async verifyUser(dto: VerifyUserDto) {
    const user = await this.userModel.findOne({ email: dto.email });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.verificationCode !== dto.code) {
      throw new BadRequestException('Invalid code');
    }

    user.isVerified = true;
    user.verificationCode = null;
    await user.save();

    return {
      code: 200,
      status: true,
      message: 'User verified successfully',
    };
  }

  async forgotPassword(dto: ForgotPasswordDto) {
    const user = await this.userModel.findOne({ email: dto.email });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const code = generateCode(6);
    user.forgotPasswordCode = code;
    await user.save();

    await this.emailService.sendEmail({
      mailTo: user.email,
      subject: 'Forgot password code',
      code,
      content: 'change your password',
    });

    return {
      code: 200,
      status: true,
      message: 'Forgot password code sent successfully',
    };
  }

  async resetPassword(dto: ResetPasswordDto) {
    const user = await this.userModel.findOne({ email: dto.email });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.forgotPasswordCode !== dto.code) {
      throw new BadRequestException('Invalid code');
    }

    const hashedPassword = await hashPassword(dto.password);
    user.password = hashedPassword;
    user.forgotPasswordCode = null;
    await user.save();

    return {
      code: 200,
      status: true,
      message: 'Password reset successful',
    };
  }

  async changePassword(userId: string, dto: ChangePasswordDto) {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const match = await comparePassword(dto.oldPassword, user.password);
    if (!match) {
      throw new BadRequestException('Old password is incorrect');
    }

    if (dto.oldPassword === dto.newPassword) {
      throw new BadRequestException('New and old password are same');
    }

    const hashedPassword = await hashPassword(dto.newPassword);
    user.password = hashedPassword;
    await user.save();

    return {
      code: 200,
      status: true,
      message: 'Password changed successfully',
    };
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (dto.name) {
      user.name = dto.name;
    }
    if (dto.email && dto.email !== user.email) {
      const emailExists = await this.userModel.findOne({
        email: dto.email,
        _id: { $ne: userId },
      });
      if (emailExists) {
        throw new BadRequestException('Email already in use');
      }
      user.email = dto.email;
      user.isVerified = false;
    }

    await user.save();
    return {
      code: 200,
      status: true,
      message: 'User profile updated',
    };
  }

  async updateProfilePic(userId: string, file?: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const savedFile = await this.fileModel.create({
      data: file.buffer,
      contentType: file.mimetype,
    });

    user.profilePic = savedFile._id;
    await user.save();

    return {
      code: 200,
      status: true,
      message: 'User profile pic updated',
    };
  }

  async getLoginUser(userId: string) {
    const user = await this.userModel
      .findById(userId)
      .select('-password -verificationCode -forgotPasswordCode')
      .populate('profilePic');

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const userObj = user.toObject() as unknown as Record<string, unknown>;
    const profilePicObj = userObj.profilePic as
      | (File & { data?: Buffer })
      | undefined;
    let profilePicBase64: string | null = null;
    if (profilePicObj?.data) {
      profilePicBase64 = Buffer.isBuffer(profilePicObj.data)
        ? profilePicObj.data.toString('base64')
        : Buffer.from(profilePicObj.data as unknown as Uint8Array).toString('base64');
    }
    const profilePicDataURL = profilePicBase64
      ? `data:${profilePicObj?.contentType};base64,${profilePicBase64}`
      : null;

    delete userObj.profilePic;
    userObj.userPic = profilePicDataURL;

    return {
      code: 200,
      status: true,
      message: 'Get current user successful',
      data: { user: userObj },
    };
  }
}
