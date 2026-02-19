import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StatisticService } from '../statistic.service';
import { User } from '../../auth/entity/users.entity';
import { Language } from '../../languages/entity/lang.entity';
import { Word } from '../../word/entity/words.entity';
import { WordStatus } from '../../../common/enums/word-status.enum';

describe('StatisticService', () => {
  let service: StatisticService;
  let userRepository: Repository<User>;
  let langRepository: Repository<Language>;

  const mockWordRepository = {
    createQueryBuilder: jest.fn(),
  };

  const mockUserRepository = {
    findOne: jest.fn(),
    save: jest.fn(),
  };

  const mockLangRepository = {
    findOne: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StatisticService,
        { provide: getRepositoryToken(Word), useValue: mockWordRepository },
        { provide: getRepositoryToken(User), useValue: mockUserRepository },
        { provide: getRepositoryToken(Language), useValue: mockLangRepository },
      ],
    }).compile();

    service = module.get<StatisticService>(StatisticService);
    userRepository = module.get(getRepositoryToken(User));
    langRepository = module.get(getRepositoryToken(Language));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getWordsStatistic', () => {
    it('should return language word statistics', async () => {
      mockLangRepository.findOne.mockResolvedValue({
        qtyLearnedWord: 5,
        qtyNotLearnedWord: 2,
        qtyInProgress: 1,
      });

      const result = await service.getWordsStatistic(1);

      expect(result.qtyLearnedWord).toBe(5);
      expect(result.qtyNotLearnedWord).toBe(2);
      expect(result.qtyInProgress).toBe(1);
    });
  });

  describe('getGamesStatistic', () => {
    it('should return games statistics', async () => {
      mockUserRepository.findOne.mockResolvedValue({
        statistic: {
          matching_word: 3,
          translate_it: 2,
          wordByMeaning: 1,
          makeASentence: 4,
        },
      });

      const result = await service.getGamesStatistic(1);

      expect(result.matching_word).toBe(3);
      expect(result.makeASentence).toBe(4);
    });
  });

  describe('getStatisticsOfAllDictionaries', () => {
    it('should sum all dictionaries statistics', async () => {
      mockUserRepository.findOne.mockResolvedValue({
        learningLangs: [
          { qtyLearnedWord: 2, qtyNotLearnedWord: 1, qtyInProgress: 3 },
          { qtyLearnedWord: 4, qtyNotLearnedWord: 2, qtyInProgress: 1 },
        ],
      });

      const result = await service.getStatisticsOfAllDictionaries(1);

      expect(result.qtyLearnedWord).toBe(6);
      expect(result.qtyNotLearnedWord).toBe(3);
      expect(result.qtyInProgress).toBe(4);
    });
  });

  describe('updateWordStatisticChangeStatus', () => {
    it('should update counters when status changes', async () => {
      const lang = {
        qtyLearnedWord: 1,
        qtyNotLearnedWord: 1,
        qtyInProgress: 1,
      } as any;

      const updated = await service.updateWordStatisticChangeStatus(
        lang,
        WordStatus.LEARNED,
        WordStatus.NOT_LEARNED,
      );

      expect(updated.qtyLearnedWord).toBe(2);
      expect(updated.qtyNotLearnedWord).toBe(0);
    });
  });

  describe('updateGamesStatistic', () => {
    it('should increment game counter', async () => {
      const user = {
        statistic: { matching_word: 1 },
      };

      mockUserRepository.findOne.mockResolvedValue(user);
      mockUserRepository.save.mockResolvedValue(user);

      await service.updateGamesStatistic(1, 'matching_word');

      expect(user.statistic.matching_word).toBe(2);
      expect(mockUserRepository.save).toHaveBeenCalled();
    });
  });
});
