import { Controller, Get, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { UserField } from '../../common/decorators/user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt.guard';
import { StatisticService } from './statistic.service';

@Controller('statistic')
@UseGuards(JwtAuthGuard)
export class StatisticController {
    constructor(private readonly statisticService: StatisticService) { }
    
    @Post('/words/:langId')
    async createWordsStatistic(
        @UserField('userId') userId: number,
        @Param('langId', ParseIntPipe) langId: number
    ) {
        return await this.statisticService.createWordStatistic(userId, langId);
    }

    @Get('/words/:langId')
    async getWordsStatistic(@Param('langId', ParseIntPipe) langId: number) {
        return await this.statisticService.getWordsStatistic(langId);
    }

    @Get('/games')
    async getGamesStatistic(@UserField('userId') userId: number) {
        return await this.statisticService.getGamesStatistic(userId);
    }

    @Get('/all/dictionaries')
    async getStatisticsOfAllDictionaries(@UserField('userId') userId: number) {
        return await this.statisticService.getStatisticsOfAllDictionaries(userId);
    }
}
