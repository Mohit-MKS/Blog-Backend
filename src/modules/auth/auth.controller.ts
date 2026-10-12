import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthService } from './auth.service';
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
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtPayload } from '../../common/constants/app.constants';
import { multerFileFilter } from '../../common/utils/file-filter.util';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  signUp(@Body() dto: SignUpDto) {
    return this.authService.signUp(dto);
  }

  @Post('signin')
  @HttpCode(HttpStatus.OK)
  signIn(@Body() dto: SignInDto) {
    return this.authService.signIn(dto);
  }

  @Post('send-verification-email')
  @HttpCode(HttpStatus.OK)
  sendVerificationEmail(@Body() dto: SendVerificationEmailDto) {
    return this.authService.sendVerificationEmail(dto);
  }

  @Post('verify-user')
  @HttpCode(HttpStatus.OK)
  verifyUser(@Body() dto: VerifyUserDto) {
    return this.authService.verifyUser(dto);
  }

  @Post('forgot-password-code')
  @HttpCode(HttpStatus.OK)
  forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto);
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto);
  }

  @Post('change-password')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  changePassword(
    @CurrentUser() user: JwtPayload,
    @Body() dto: ChangePasswordDto,
  ) {
    return this.authService.changePassword(user._id, dto);
  }

  @Post('update-profile')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  updateProfile(
    @CurrentUser() user: JwtPayload,
    @Body() dto: UpdateProfileDto,
  ) {
    return this.authService.updateProfile(user._id, dto);
  }

  @Post('update-profile-pic')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(
    FileInterceptor('profilePic', {
      fileFilter: multerFileFilter,
      limits: { fileSize: 1024 * 1024 * 1024 },
    }),
  )
  updateProfilePic(
    @CurrentUser() user: JwtPayload,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.authService.updateProfilePic(user._id, file);
  }

  @Get('get-login-user')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  getLoginUser(@CurrentUser() user: JwtPayload) {
    return this.authService.getLoginUser(user._id);
  }
}
