import { Module } from '@nestjs/common';
import { LanguagesController } from './languages.controller';
import { LanguagesService } from './languages.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../auth/entity/users.entity';
import { Language } from './entity/lang.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Language])],
  controllers: [LanguagesController],
  providers: [LanguagesService],
  exports: [LanguagesService]
})
export class LanguagesModule {}
