import { Module } from '@nestjs/common';
import { StatisticController } from './statistic.controller';
import { StatisticService } from './statistic.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../auth/entity/users.entity';
import { Word } from '../word/entity/words.entity';
import { Language } from '../languages/entity/lang.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Word, Language])],
  controllers: [StatisticController],
  providers: [StatisticService],
  exports: [StatisticService]
})
export class StatisticModule {}
