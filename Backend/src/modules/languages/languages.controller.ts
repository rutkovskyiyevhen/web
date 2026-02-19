import { Body, Controller, Delete, Get, Patch, Post, UseGuards, UsePipes } from '@nestjs/common';
import { LanguagesService } from './languages.service';
import { ZodValidationPipe } from '../../common/pipes/zodValidationPipe';
import { updateNativeLangSchema, UpdateNativeLangZodDto } from './dto/updateNativeLangZod.dto';
import { UserField } from '../../common/decorators/user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt.guard';
import { learningLangSchema, LearningLangZodDto } from './dto/learningLangZod.dto';
import { deleteLearningLangSchema, DeleteLearningLangZodDto } from './dto/deleteLearningLangZod.dto';
import { changePrioritySchema, ChangePriorityZodDto } from './dto/changePriorityZod.dto';

@Controller('languages')
export class LanguagesController {
    constructor(private readonly languagesService: LanguagesService) { }
    
    @Post('/add')
    @UseGuards(JwtAuthGuard)
    @UsePipes(new ZodValidationPipe(learningLangSchema))
    async addLearningLangs(@Body() langs: LearningLangZodDto, @UserField('userId') userId: number) {
        return await this.languagesService.addLearningLangs(langs, userId);
    }

    @Patch('/native')
    @UseGuards(JwtAuthGuard)
    @UsePipes(new ZodValidationPipe(updateNativeLangSchema))
    async setUpLangSettings(@Body() params: UpdateNativeLangZodDto, @UserField('userId') userId: number) {
        return await this.languagesService.changeNativeLang(params, userId);
    }

    @Patch('/change/priority')
    @UseGuards(JwtAuthGuard)
    @UsePipes(new ZodValidationPipe(changePrioritySchema))
    async changePriorityLangs(@Body() langs: ChangePriorityZodDto, @UserField('userId') userId: number) {
        return await this.languagesService.changePriorityLangs(langs, userId);
    }

    @Get('/user')
    @UseGuards(JwtAuthGuard)
    async getUserLanguages(@UserField('userId') userId: number) {
        return await this.languagesService.getUserLanguages(userId);
    }
    
    @Get()
    async getAllLanguages() {
        return await this.languagesService.getAllLanguages();
    }

    @Delete('/remove')
    @UseGuards(JwtAuthGuard)
    @UsePipes(new ZodValidationPipe(deleteLearningLangSchema))
    async removeLearningLangs(@Body() langs: DeleteLearningLangZodDto, @UserField('userId') userId: number) {
        return await this.languagesService.removeLearningLangs(langs, userId);
    }
}
