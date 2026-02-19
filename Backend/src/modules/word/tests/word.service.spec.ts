import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WordService } from '../word.service';
import { Word } from '../entity/words.entity';
import { StatisticService } from '../../statistic/statistic.service';
import { Language } from '../../languages/entity/lang.entity';
import { User } from '../../auth/entity/users.entity';
import { LanguagesService } from '../../languages/languages.service';
import { WordStatus } from '../../../common/enums/word-status.enum';

describe('WordService', () => {
  let service: WordService;
  let wordRepository: Repository<Word>;
  let statisticService: StatisticService;
  let langRepository: Repository<Language>;

  const mockWordRepository = {
    findOne: jest.fn(),
    find: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
    createQueryBuilder: jest.fn(),
  };

  const mockUserRepository = {};

  const mockLangRepository = {
    findOne: jest.fn(),
    save: jest.fn(),
  };

  const mockStatisticService = {
    updateWordStatisticCreateAndDelete: jest.fn(),
    updateWordStatisticChangeStatus: jest.fn(),
  };

  const mockLanguagesService = {
    getLanguages: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WordService,
        { provide: getRepositoryToken(Word), useValue: mockWordRepository },
        { provide: getRepositoryToken(User), useValue: mockUserRepository },
        { provide: getRepositoryToken(Language), useValue: mockLangRepository },
        { provide: StatisticService, useValue: mockStatisticService },
        { provide: LanguagesService, useValue: mockLanguagesService },
      ],
    }).compile();

    service = module.get<WordService>(WordService);
    wordRepository = module.get(getRepositoryToken(Word));
    statisticService = module.get<StatisticService>(StatisticService);
    langRepository = module.get(getRepositoryToken(Language));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('addNewWord', () => {
    it('should create word and update statistic', async () => {
      const newWord = {
        id: 1,
        word: 'hello',
        translation: 'привіт',
        dictionary: { id: 1 },
      };

      mockWordRepository.create.mockReturnValue(newWord);
      mockWordRepository.save.mockResolvedValue(newWord);

      const result = await service.addNewWord(
        { word: 'hello', translation: 'привіт', idLang: 1, lang: 'en' } as any,
        1,
      );

      expect(statisticService.updateWordStatisticCreateAndDelete).toHaveBeenCalledWith(
        1,
        'create',
        WordStatus.NOT_LEARNED,
      );

      expect(result.remainder.id).toBe(1);
    });
  });

  describe('updateWord', () => {
    it('should update word fields', async () => {
      const word = { id: 1, word: 'hello', translation: 'hi' };

      jest.spyOn(service, 'getWordById').mockResolvedValue(word as any);
      mockWordRepository.save.mockResolvedValue(word);

      const result = await service.updateWord(
        { word: ' updated ' } as any,
        1,
      );

      expect(word.word).toBe('updated');
      expect(result.remainder.id).toBe(1);
    });
  });

  describe('getAllDictionary', () => {
    it('should return priority dictionary words', async () => {
      mockLanguagesService.getLanguages.mockResolvedValue({
        learningLangs: [{ id: 1, priority: 1 }],
      });

      mockWordRepository.find.mockResolvedValue([{ id: 10 }]);

      const result = await service.getAllDictionary(1);

      expect(result.words.length).toBe(1);
    });
  });

  describe('removeWord', () => {
    it('should delete words and update statistic', async () => {
      const word = { id: 1, status: WordStatus.LEARNED };

      jest.spyOn(service, 'getWordById').mockResolvedValue(word as any);
      mockWordRepository.remove.mockResolvedValue(word);

      await service.removeWord(1, { wordsId: [1], langId: 1 } as any);

      expect(statisticService.updateWordStatisticCreateAndDelete).toHaveBeenCalledWith(
        1,
        'delete',
        WordStatus.LEARNED,
      );
    });
  });
});
