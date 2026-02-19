import { Module } from '@nestjs/common';
import { WordService } from './word.service';
import { WordController } from './word.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../auth/entity/users.entity';
import { Word } from './entity/words.entity';
import { StatisticModule } from '../statistic/statistic.module';
import { LanguagesModule } from '../languages/languages.module';
import { Language } from '../languages/entity/lang.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Word, Language]), StatisticModule, LanguagesModule],
  providers: [WordService],
  controllers: [WordController],
  exports: [WordService]
})
export class WordModule {}
