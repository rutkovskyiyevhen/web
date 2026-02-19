import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../auth/entity/users.entity';
import { Word } from '../word/entity/words.entity';
import { WordStatus } from '../../common/enums/word-status.enum';
import { Repository } from 'typeorm';
import { Language } from '../languages/entity/lang.entity';

@Injectable()
export class StatisticService {
    private static readonly wordStatusToFieldMap = new Map<WordStatus, string>([
        [WordStatus.NOT_LEARNED, 'qtyNotLearnedWord'],
        [WordStatus.LEARNED, 'qtyLearnedWord'],
        [WordStatus.IN_PROGRESS, 'qtyInProgress']
    ]);
    constructor(
        @InjectRepository(Word) private readonly wordRepository: Repository<Word>,
        @InjectRepository(User) private readonly userRepository: Repository<User>,
        @InjectRepository(Language) private readonly langRepository: Repository<Language>,
    ) { }
    
    async createWordStatistic(userId: number, langId: number) {
        const lang = await this.langRepository.findOne({where: { id: langId }});
        const wordStatuses = [WordStatus.NOT_LEARNED, WordStatus.IN_PROGRESS, WordStatus.LEARNED];
        const [qtyNotLearnedWord, qtyInProgress, qtyLearnedWord] = await Promise.all(
            wordStatuses.map((status) => 
                this.queryBuilder(
                    this.wordRepository, 'word', 'word.dictionary', 'language',
                    'language.id = :langId AND word.status = :status', { langId, status }
                )
            )
        );
        Object.assign(lang, { qtyNotLearnedWord, qtyInProgress, qtyLearnedWord });
        await this.langRepository.save(lang);
        return { qtyLearnedWord, qtyNotLearnedWord, qtyInProgress };
    }
    
    async updateWordStatisticCreateAndDelete(langId: number, operation: 'create' | 'delete', status: WordStatus) {
        const lang = await this.langRepository.findOne({ where: { id: langId } });
        const field = StatisticService.wordStatusToFieldMap.get(status);
        lang[field] = operation === 'create' ?
            lang[field] + 1 : lang[field] - 1;
        await this.langRepository.save(lang);
    }

    async updateWordStatisticChangeStatus(
        lang: Language, newStatus: WordStatus, previousStatus: WordStatus
    ) {
        lang[StatisticService.wordStatusToFieldMap.get(previousStatus)] -= 1;
        lang[StatisticService.wordStatusToFieldMap.get(newStatus)] += 1;
        return lang;
    }

    async getWordsStatistic(langId: number) {
        const lang = await this.langRepository.findOne({ where: { id: langId } });
        return {
            qtyLearnedWord: lang.qtyLearnedWord,
            qtyNotLearnedWord: lang.qtyNotLearnedWord,
            qtyInProgress: lang.qtyInProgress
        };
    }

    async getGamesStatistic(userId: number) {
        const user = await this.userRepository.findOne({
            where: { id: userId },
            relations: ['statistic'],
        });
        return {
            matching_word: user.statistic.matching_word,
            translate_it: user.statistic.translate_it,
            wordByMeaning: user.statistic.wordByMeaning,
            makeASentence: user.statistic.makeASentence,
        };
    }

    async getStatisticsOfAllDictionaries(userId: number) {
        const user = await this.userRepository.findOne({
            where: { id: userId },
            relations: ['learningLangs']
        });

        const res = { qtyLearnedWord: 0, qtyNotLearnedWord: 0, qtyInProgress: 0 }
        for (const dictionary of user.learningLangs) {
            res.qtyInProgress += dictionary.qtyInProgress;
            res.qtyLearnedWord += dictionary.qtyLearnedWord;
            res.qtyNotLearnedWord += dictionary.qtyNotLearnedWord;
        }
        return res;
    }

    async updateGamesStatistic(userId: number, gameName: string) {
        const user = await this.userRepository.findOne({
            where: { id: userId },
            relations: ['statistic']
        });
        user.statistic[gameName] += 1;
        await this.userRepository.save(user);
    }

    private async queryBuilder(
        repo,
        table: string,
        fieldJoin: string,
        joinTable: string,
        whereCondition: string,
        whereParams: {},
    ) {
        const qty = await repo
            .createQueryBuilder(table)
            .innerJoin(fieldJoin, joinTable)
            .where(whereCondition, whereParams)
            .getCount();
        return qty;
    }
}
