import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User } from './entity/users.entity';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { config } from '../../common/configs/env.config';
import { JwtStrategy } from './strategies/jwt.strategy';
import { Reset } from './entity/reset.entity';
import { Statistic } from '../statistic/entity/statistic.entity';
import { LanguagesModule } from 'src/modules/languages/languages.module';
// import { GoogleStrategy } from './strategies/google.strategy';

@Module({
  imports: [JwtModule.register({
    secret: config.jwt_secret,
    signOptions: {expiresIn: '14d'}
  }), TypeOrmModule.forFeature([User, Reset, Statistic]), LanguagesModule],
  providers: [AuthService, JwtStrategy, /*GoogleStrategy*/],
  controllers: [AuthController]
})
export class AuthModule {}
