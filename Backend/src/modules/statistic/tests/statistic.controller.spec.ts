import { Test, TestingModule } from '@nestjs/testing';
import { StatisticController } from '../statistic.controller';
import { StatisticService } from '../statistic.service';

describe('StatisticController', () => {
  let controller: StatisticController;
  let service: StatisticService;

  const mockStatisticService = {
    createWordStatistic: jest.fn(),
    getWordsStatistic: jest.fn(),
    getGamesStatistic: jest.fn(),
    getStatisticsOfAllDictionaries: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StatisticController],
      providers: [
        {
          provide: StatisticService,
          useValue: mockStatisticService,
        },
      ],
    }).compile();

    controller = module.get<StatisticController>(StatisticController);
    service = module.get<StatisticService>(StatisticService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create word statistic', async () => {
    mockStatisticService.createWordStatistic.mockResolvedValue({
      qtyLearnedWord: 1,
      qtyNotLearnedWord: 2,
      qtyInProgress: 3,
    });

    const result = await controller.createWordsStatistic(1, 10);

    expect(service.createWordStatistic).toHaveBeenCalledWith(1, 10);
    expect(result.qtyLearnedWord).toBe(1);
  });

  it('should return words statistic', async () => {
    mockStatisticService.getWordsStatistic.mockResolvedValue({
      qtyLearnedWord: 5,
      qtyNotLearnedWord: 2,
      qtyInProgress: 1,
    });

    const result = await controller.getWordsStatistic(10);

    expect(service.getWordsStatistic).toHaveBeenCalledWith(10);
    expect(result.qtyLearnedWord).toBe(5);
  });

  it('should return games statistic', async () => {
    mockStatisticService.getGamesStatistic.mockResolvedValue({
      matching_word: 1,
    });

    const result = await controller.getGamesStatistic(1);

    expect(service.getGamesStatistic).toHaveBeenCalledWith(1);
    expect(result.matching_word).toBe(1);
  });

  it('should return statistics of all dictionaries', async () => {
    mockStatisticService.getStatisticsOfAllDictionaries.mockResolvedValue({
      qtyLearnedWord: 10,
      qtyNotLearnedWord: 5,
      qtyInProgress: 2,
    });

    const result = await controller.getStatisticsOfAllDictionaries(1);

    expect(service.getStatisticsOfAllDictionaries).toHaveBeenCalledWith(1);
    expect(result.qtyLearnedWord).toBe(10);
  });
});
