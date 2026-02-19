import { Body, Controller, Get, Post, Req, Res, UseGuards, UsePipes } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { ZodValidationPipe } from '../../common/pipes/zodValidationPipe';
import { registrationSchema, RegistrationZodDto } from './dto/registrationZod.dto';
import { resetPasswordSchema, ResetPasswordZodDto } from './dto/resetPasswordZod.dto';
import { verifiedSchema, VerifiedZodDto } from './dto/verifiedZod.dto';
import { newPasswordSchema, NewPasswordZodDto } from './dto/newPasswordZod.dto';
import { JwtAuthGuard } from '../../common/guards/jwt.guard';
import { loginSchema, LoginZodDto } from './dto/loginZod.dto';
import { GoogleAuthGuard } from '../../common/guards/google.guard';
import { config } from '../../common/configs/env.config';


@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService) {}

    @Get('/google')
    @UseGuards(GoogleAuthGuard)
    googleStart() {
    // passport redirects to Google automatically
    }

    @Get('/google/callback')
    @UseGuards(GoogleAuthGuard)
    async googleCallback(@Req() req, @Res({ passthrough: true }) res: Response) {
        const token = await this.authService.googleAuth(req.user);

        res.cookie('jwt', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'lax',
            maxAge: 1000 * 60 * 60 * 24 * 14,
        });

        res.redirect(`${config.frontend_url}/games`);
    }

    
    @Post('/register')
    @UsePipes(new ZodValidationPipe(registrationSchema))
    async registration(
        @Body() registerInfo: RegistrationZodDto,
        @Res({ passthrough: true }) res: Response
    ) {
        const response = await this.authService.register(registerInfo);
        const token = response.newToken;
        res.cookie('jwt', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'lax',
            maxAge: 1000 * 60 * 60 * 24 * 14,
        });
        return {message: response.message};
    }

    @Post('/login')
    @UsePipes(new ZodValidationPipe(loginSchema))
    async login(@Body() loginInfo: LoginZodDto,
        @Res({ passthrough: true }) res: Response) {
        const token = await this.authService.login(loginInfo);
        res.cookie('jwt', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'lax',
            maxAge: 1000 * 60 * 60 * 24 * 14,
        });
        return {message: 'Logged in successfully!'}
    }

    @Post('/forgot-password')
    @UsePipes(new ZodValidationPipe(resetPasswordSchema))
    async sendCodeEmail(@Body() emailDto: ResetPasswordZodDto) {
        return await this.authService.sendCodeEmail(emailDto);
    }

    @Post('/code')
    @UsePipes(new ZodValidationPipe(verifiedSchema))
    async verifiedCode(@Body() verifiedDto: VerifiedZodDto) {
        return await this.authService.verifiedUser(verifiedDto);
    }

    @Post('/new-password')
    @UsePipes(new ZodValidationPipe(newPasswordSchema))
    async setNewPassword(@Body() newPasswordDto: NewPasswordZodDto) {
        return await this.authService.setNewPassword(newPasswordDto);
    }

    @Post('/logout')
    async logout(@Res({passthrough: true}) res: Response) {
        res.clearCookie('jwt', {
            httpOnly: true,
            secure: true,
            sameSite: 'lax',
        });
        return { message: 'Logged out successfully' };
    }

    @Get('me')
    @UseGuards(JwtAuthGuard)
    getMe(@Req() req) {
        return req.user;
    }
}
