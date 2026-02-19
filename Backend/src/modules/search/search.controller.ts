import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { SearchService } from './search.service';
import { JwtAuthGuard } from '../../common/guards/jwt.guard';

@UseGuards(JwtAuthGuard)
@Controller('search')
export class SearchController {
    constructor(private readonly searchService: SearchService) { }
    
    @Get('/:word')
    async getWord(@Param('word') word: string) {
        return await this.searchService.getWord(word);
    }
}
