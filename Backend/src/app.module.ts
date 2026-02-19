import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WordModule } from './modules/word/word.module';
import { ormConfig } from './data-source';
import { SearchModule } from './modules/search/search.module';
import { ScheduleModule } from '@nestjs/schedule';
import { StatisticModule } from './modules/statistic/statistic.module';
import { LanguagesModule } from './modules/languages/languages.module';

//to ci/cd
@Module({
  imports: [TypeOrmModule.forRoot(ormConfig), WordModule,
    AuthModule, SearchModule, ScheduleModule.forRoot(),
    StatisticModule, LanguagesModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
