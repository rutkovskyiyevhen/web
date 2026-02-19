import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UseGuards, UsePipes } from '@nestjs/common';
import { WordService } from './word.service';
import { JwtAuthGuard } from '../../common/guards/jwt.guard';
import { wordSchema, WordZodDto } from './dto/wordZod.dto';
import { UserField } from '../../common/decorators/user.decorator';
import { updateWordSchema, UpdateWordZodDto } from './dto/updateWordZod.dto';
import { ZodValidationPipe } from '../../common/pipes/zodValidationPipe';
import { filterWordsSchema, FilterWordsZodDto } from './dto/filterWordZod.dto';
import { deleteWordsSchema, DeleteWordsZodDto } from './dto/deleteWordsZod.dto';
import { updateStatusSchema, UpdateStatusZodDto } from './dto/updateStatusZod.dto';
import { generateWordAISchema, GenerateWordAIZodDto } from './dto/generateWordAIZod.dto';

@UseGuards(JwtAuthGuard)
@Controller('word')
export class WordController {
    constructor(private readonly wordService: WordService) {}

    //when the user opens the page dictionary, client receives list of user dictionaries
    //and for first language send all words
    @Get('/dictionaries')
    async getAllDictionary(
        @UserField('userId') userId: number,
    ) {
        return await this.wordService.getAllDictionary(userId);
    }

    @Get('/filters')
    async getAllWord(
        @Query(new ZodValidationPipe(filterWordsSchema)) query: FilterWordsZodDto
    ) {
        return await this.wordService.getAllWord(query);
    }

    @Post('/create')
    @UsePipes(new ZodValidationPipe(wordSchema))
    async addNewWord(@Body() wordInfo: WordZodDto,
    @UserField('userId') userId: number) {
        return await this.wordService.addNewWord(wordInfo, userId);
    }

    @Put('/update/:id')
    @UsePipes(new ZodValidationPipe(updateWordSchema))
    async updateWord(@Param('id', ParseIntPipe) wordId: number,
    @Body() update_field: UpdateWordZodDto) {
        return await this.wordService.updateWord(update_field, wordId);
    }

    @Put('/status')
    @UsePipes(new ZodValidationPipe(updateStatusSchema))
    async updateStatusWord(@UserField('userId') userId: number,
        @Body() updateStatus: UpdateStatusZodDto
    ) {
        return await this.wordService.updateStatusWord(updateStatus, userId);
    }

    // @Post('/generate')
    // @UsePipes(new ZodValidationPipe(generateWordAISchema))
    // async generateWordAI(@UserField('userId') userId: number,
    //     @Body() option: GenerateWordAIZodDto
    // ) {
    //     return await this.wordService.generateWordsAI(userId, option);
    // }

    @Delete('/delete')
    @UsePipes(new ZodValidationPipe(deleteWordsSchema))
    async removeWord(@Body() wordsId: DeleteWordsZodDto,
    @UserField('userId') userId: number) {
        return await this.wordService.removeWord(userId, wordsId);
    }
}
