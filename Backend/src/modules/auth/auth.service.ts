import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { RegistrationZodDto } from './dto/registrationZod.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entity/users.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs'
import { ResetPasswordZodDto } from './dto/resetPasswordZod.dto';
import { Reset } from './entity/reset.entity';
import { VerifiedZodDto } from './dto/verifiedZod.dto';
import { v4 as uuidv4 } from 'uuid';
import { NewPasswordZodDto } from './dto/newPasswordZod.dto';
import { Roles } from '../../common/enums/role.enum';
import { Statistic } from '../statistic/entity/statistic.entity';
import { LoginZodDto } from './dto/loginZod.dto';
import { LanguagesService } from '../languages/languages.service';
import { randomBytes } from 'crypto';


@Injectable()
export class AuthService {

    constructor(@InjectRepository(User) private readonly userRepository: Repository<User>,
        @InjectRepository(Reset) private readonly resetRepository: Repository<Reset>,
        @InjectRepository(Statistic) private readonly statisticRepository: Repository<Statistic>,
        private readonly jwtService: JwtService,
        private readonly langService: LanguagesService) { }
    
    async register(registerInfo: RegistrationZodDto) {
        const existingUser = await this.userRepository.findOneBy({ email: registerInfo.email });
        if (existingUser) throw new ConflictException('Email is already in use');
        const hashedPassword = await bcrypt.hash(registerInfo.password, 10);
        const newUser = this.userRepository.create({
            email: registerInfo.email,
            password: hashedPassword,
            nativeLang: registerInfo.nativeLang,
            userName: registerInfo.userName
        });
        const newStatistic = this.statisticRepository.create({ user: newUser });
        newUser.statistic = newStatistic;
        await this.userRepository.save(newUser);
        await this.langService.createLang(newUser, registerInfo.learningLang, 1);
        const payload = { userId: newUser.id, email: newUser.email, role: newUser.role || Roles.USER };
        const newToken = await this.jwtService.signAsync(payload);
        return { message: 'Registration successful. Redirecting to login...', newToken };
    }

    async login(loginInfo: LoginZodDto) {
        const user = await this.userRepository.findOneBy({ email: loginInfo.email });
        if (!user) throw new BadRequestException('Invalid email or password');
        if (!user.password) {
            throw new BadRequestException({
                message: 'This account uses Google sign-in. Please continue with Google or set a password.',
                code: 'NO_LOCAL_PASSWORD',
            });
        }
        const comparePassword = await bcrypt.compare(loginInfo.password, user.password);
        if (!comparePassword) throw new BadRequestException('Invalid email or password');
        const payload = { userId: user.id, email: user.email, role: user.role || Roles.USER };
        const newToken = await this.jwtService.signAsync(payload);
        return newToken;
    }

    async googleAuth(googleUser: { googleId: string; email: string; emailVerified: boolean; displayName?: string }) {
        const { googleId, email, emailVerified, displayName } = googleUser;

        if (!email) throw new BadRequestException('Google did not return an email');
        if (emailVerified === false) throw new BadRequestException('Google email is not verified');

        let user = await this.userRepository.findOne({ where: { googleId } });

        if (!user) {
            user = await this.userRepository.findOne({ where: { email } });
            if (user) {
                user.googleId = googleId;
                await this.userRepository.save(user);
            }
        }

        if (!user) {
            const baseName =
            (displayName || email.split('@')[0] || 'user')
                .replace(/\s+/g, '_')
                .replace(/[^a-zA-Z0-9_]/g, '')
                .slice(0, 18) || 'user';

            const suffix = randomBytes(3).toString('hex');
            const userName = `${baseName}_${suffix}`.slice(0, 20);

            const newUser = this.userRepository.create({
                email,
                password: null,
                googleId,
                userName,
            });

            const newStatistic = this.statisticRepository.create({ user: newUser });
            newUser.statistic = newStatistic;

            await this.userRepository.save(newUser);
            user = newUser;
        }

        const payload = { userId: user.id, email: user.email, role: user.role || Roles.USER };
        const token = await this.jwtService.signAsync(payload);

        return token;
    }


    async sendCodeEmail(email: ResetPasswordZodDto) {
        const user = await this.userRepository.findOne({
            where: { email: email.email },
            relations: ['reset']
        });
        if (!user) throw new BadRequestException('Invalid email');
        const newCode = String(Math.floor(100000 + Math.random() * 900000));
        user.reset = this.resetRepository.create();
        user.reset.code = newCode;
        user.reset.created_at = new Date();
        await this.userRepository.save(user);
        return { message: 'Code sent successfully' };
    }

    async verifiedUser(verified: VerifiedZodDto) {
        const user = await this.userRepository.findOne({
            where: { email: verified.email },
            relations: ['reset']
        });
        const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
        if (user.reset.code !== verified.code || user.reset.created_at < tenMinutesAgo) {
            throw new BadRequestException('The reset code is invalid or has expired.');
        }
        const resetToken = uuidv4();
        user.reset.resetToken = resetToken;
        await this.userRepository.save(user);
        return {resetToken};
    }

    async setNewPassword(newPasswordDto: NewPasswordZodDto) {
        const user = await this.userRepository.findOne({
            where: { email: newPasswordDto.email },
            relations: ['reset']
        });
        if (user.reset.resetToken !== newPasswordDto.resetToken) {
            throw new BadRequestException('The reset token is invalid or has expired.');
        }
        const hashedPassword = await bcrypt.hash(newPasswordDto.newPassword, 10);
        user.password = hashedPassword;
        const resetId = user.reset.id;
        user.reset = null;
        await this.userRepository.save(user);
        await this.resetRepository.delete(resetId);
        return { message: 'Your password has been successfully reset. Please log in with your new password.' };
    }
}
