import { Test, TestingModule } from '@nestjs/testing';
import { WordController } from '../word.controller';
import { WordService } from '../word.service';

describe('WordController', () => {
  let controller: WordController;
  let service: WordService;

  const mockWordService = {
    getAllDictionary: jest.fn(),
    getAllWord: jest.fn(),
    addNewWord: jest.fn(),
    updateWord: jest.fn(),
    updateStatusWord: jest.fn(),
    removeWord: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WordController],
      providers: [
        { provide: WordService, useValue: mockWordService },
      ],
    }).compile();

    controller = module.get<WordController>(WordController);
    service = module.get<WordService>(WordService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return all dictionaries', async () => {
    mockWordService.getAllDictionary.mockResolvedValue({ langs: [], words: [] });

    const result = await controller.getAllDictionary(1);

    expect(service.getAllDictionary).toHaveBeenCalledWith(1);
    expect(result.langs).toEqual([]);
  });

  it('should return filtered words', async () => {
    mockWordService.getAllWord.mockResolvedValue({ words: [] });

    const result = await controller.getAllWord({ idLang: 1 } as any);

    expect(service.getAllWord).toHaveBeenCalledWith({ idLang: 1 });
    expect(result.words).toEqual([]);
  });

  it('should add new word', async () => {
    mockWordService.addNewWord.mockResolvedValue({ remainder: { id: 1 } });

    const result = await controller.addNewWord(
      { word: 'hello', translation: 'привіт' } as any,
      1,
    );

    expect(service.addNewWord).toHaveBeenCalled();
    expect(result.remainder.id).toBe(1);
  });

  it('should update word', async () => {
    mockWordService.updateWord.mockResolvedValue({ remainder: { id: 1 } });

    const result = await controller.updateWord(1, { word: 'hi' } as any);

    expect(service.updateWord).toHaveBeenCalledWith({ word: 'hi' }, 1);
    expect(result.remainder.id).toBe(1);
  });

  it('should update word status', async () => {
    mockWordService.updateStatusWord.mockResolvedValue({ res: [] });

    const result = await controller.updateStatusWord(
      1,
      { wordsId: [1], status: 'LEARNED' } as any,
    );

    expect(service.updateStatusWord).toHaveBeenCalled();
    expect(result.res).toEqual([]);
  });

  it('should remove words', async () => {
    mockWordService.removeWord.mockResolvedValue({
      message: 'Words deleted successfully',
    });

    const result = await controller.removeWord(
      { wordsId: [1], langId: 1 } as any,
      1,
    );

    expect(service.removeWord).toHaveBeenCalledWith(1, {
      wordsId: [1],
      langId: 1,
    });
    expect(result.message).toBe('Words deleted successfully');
  });
});
