import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../auth/entity/users.entity';
import { Word } from './entity/words.entity';
import { Repository } from 'typeorm';
import { WordZodDto } from './dto/wordZod.dto';
import { UpdateWordZodDto } from './dto/updateWordZod.dto';
import { StatisticService } from '../statistic/statistic.service';
import { WordStatus } from '../../common/enums/word-status.enum';
import { FilterWordsZodDto } from './dto/filterWordZod.dto';
import { DeleteWordsZodDto } from './dto/deleteWordsZod.dto';
import { queue } from 'async';
import { UpdateStatusZodDto } from './dto/updateStatusZod.dto';
import { GenerateWordAIZodDto } from './dto/generateWordAIZod.dto';
import { LanguagesService } from '../languages/languages.service';
import { Language } from '../languages/entity/lang.entity';

@Injectable()
export class WordService {
    constructor(@InjectRepository(Word) private readonly wordRepository: Repository<Word>,
        @InjectRepository(User) private readonly userRepository: Repository<User>,
        @InjectRepository(Language) private readonly langRepository: Repository<Language>,
        private readonly statisticService: StatisticService,
        private readonly languagesService: LanguagesService
    ) { }

    async getWordById(id: number): Promise<Word> {
        return await this.wordRepository.findOne({where: { id }});
    }

    async getAllDictionary(userId: number) {
        const userLangs = await this.languagesService.getLanguages(userId);
        const priorityLang = userLangs.learningLangs.find(el => el.priority === 1);
        const words = await this.wordRepository.find({ where: { dictionary: priorityLang } });
        return {langs: userLangs.learningLangs, words};
    }
    

    async getAllWord(query: FilterWordsZodDto) {
        const qb = this.wordRepository
            .createQueryBuilder('word')
            .innerJoin('word.dictionary', 'languages')
            .where('languages.id = :id', { id: query.idLang });

        if (query.status) {
            qb.andWhere('word.status = :status', { status: query.status });
        }

        if (query.order) {
            const direction = query.order.toUpperCase() as 'ASC' | 'DESC';
            qb.orderBy('word.created_at', direction);
        }

        const words = await qb.getMany();
        return { words };
    }

    async getWordForGame(
        query: { condition: string, params, select: [string, string][] }
    ) {
        const qb = this.wordRepository
            .createQueryBuilder('word')
            .innerJoin('word.dictionary', 'languages')
            .where(query.condition, query.params)
            .addSelect([])
        
        for (const pair of query.select) {
            qb.addSelect(pair[0], pair[1]);
        }
        const words = await qb.getRawMany();
        return words;
    }

    //isGenerated param needs for blocking method which update statistic words
    //cause without it, that works with anomalies
    //lately change this architecture to clean 
    async addNewWord(wordInfo: WordZodDto, userId: number, isGenerated: boolean = true) {
        const newWord = this.wordRepository.create({
            word: wordInfo.word.split(' ').filter(el => el !== '').join(' '),
            translation: wordInfo.translation.split(' ').filter(el => el !== '').join(' '),
            dictionary: {id: wordInfo.idLang, learningLang: wordInfo.lang},
        })
        await this.wordRepository.save(newWord);
        const { dictionary, ...remainder } = newWord;
        if (isGenerated) {
            await this.statisticService.updateWordStatisticCreateAndDelete(wordInfo.idLang, 'create', WordStatus.NOT_LEARNED);
        }
        return { remainder };
    }

    async updateWord(update_field: UpdateWordZodDto, wordId: number) {
        const word = await this.getWordById(wordId);
        for (const prop in update_field) {
            update_field[`${prop}`] = update_field[`${prop}`].split(' ').filter(el => el !== '').join(' ');
        }
        Object.assign(word, update_field);
        await this.wordRepository.save(word);
        const { dictionary, ...remainder } = word;
        return { remainder };
    }

    async updateStatusWord(updateStatus: UpdateStatusZodDto, userId: number) {
        const res = [];
        const changeStatuses = [];
        let lang = await this.langRepository.findOne({ where: { id: updateStatus.langId } });
        const q = queue(async (id: number) => {
            const word = await this.getWordById(id);
            changeStatuses.push([updateStatus.status, word.status]);
            word.status = updateStatus.status;
            await this.wordRepository.save(word);
            res.push(word);
        }, 5);
        for (const wordId of updateStatus.wordsId) {
            q.push(wordId);
        }
        await q.drain();
        for (const pair of changeStatuses) {
            lang = await this.statisticService.updateWordStatisticChangeStatus(
                lang, pair[0], pair[1]
            );
        }
        await this.langRepository.save(lang);
        return { res };
    }

    // async generateWordsAI(userId: number, option: GenerateWordAIZodDto) {
    //     const user = await this.userRepository.findOne({ where: { id: userId } });
    //     let lang = await this.langRepository.findOne({where: {id: option.idLang}});
    //     const gptResponse = await this.gptService.generateWords(option.quantity, option.level, option.lang, user.nativeLang);
    //     if ('message' in gptResponse) throw new BadRequestException('Invalid response format from GPT');
    //     const words = [];
    //     const q = queue(async (pair: { word: string, translation: string, id: number, lang: string }) => {
    //         const newWord = await this.addNewWord(pair, userId);
    //         words.push(newWord.remainder);
    //     }, 5);
    //     for (const pair of gptResponse) {
    //         Object.assign(pair, { idLang: option.idLang, lang: option.lang });
    //         q.push(pair);
    //     }
    //     await q.drain();
    //     lang.qtyNotLearnedWord += gptResponse.length;
    //     await this.langRepository.save(lang);
    //     return { words };
    // }

    async removeWord(userId: number, wordsId: DeleteWordsZodDto) {
        const q = queue(async (id: number) => {
            const word = await this.getWordById(id);
            if (!word) return;
            await this.statisticService.updateWordStatisticCreateAndDelete(wordsId.langId, 'delete', word.status);
            await this.wordRepository.remove(word);
        }, 5);

        for (const wordId of wordsId.wordsId) {
            q.push(wordId);
        }
        await q.drain();
        return { message: 'Words deleted successfully' };
    }
}
