import { Test, TestingModule } from '@nestjs/testing';
import { LanguagesController } from '../languages.controller';
import { LanguagesService } from '../languages.service';

describe('LanguagesController', () => {
  let controller: LanguagesController;
  let service: LanguagesService;

  const mockLanguagesService = {
    addLearningLangs: jest.fn(),
    changeNativeLang: jest.fn(),
    changePriorityLangs: jest.fn(),
    getUserLanguages: jest.fn(),
    getAllLanguages: jest.fn(),
    removeLearningLangs: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LanguagesController],
      providers: [
        {
          provide: LanguagesService,
          useValue: mockLanguagesService,
        },
      ],
    }).compile();

    controller = module.get<LanguagesController>(LanguagesController);
    service = module.get<LanguagesService>(LanguagesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should add learning languages', async () => {
    mockLanguagesService.addLearningLangs.mockResolvedValue([{ lang: 'en', id: 1 }]);

    const result = await controller.addLearningLangs(
      { learningLangs: ['en'] } as any,
      1,
    );

    expect(service.addLearningLangs).toHaveBeenCalledWith({ learningLangs: ['en'] }, 1);
    expect(result).toEqual([{ lang: 'en', id: 1 }]);
  });

  it('should change native language', async () => {
    mockLanguagesService.changeNativeLang.mockResolvedValue({
      message: 'Native language successfully changed',
    });

    const result = await controller.setUpLangSettings(
      { nativeLang: 'uk' } as any,
      1,
    );

    expect(service.changeNativeLang).toHaveBeenCalledWith({ nativeLang: 'uk' }, 1);
    expect(result).toEqual({ message: 'Native language successfully changed' });
  });

  it('should return user languages', async () => {
    mockLanguagesService.getUserLanguages.mockResolvedValue({
      nativeLang: 'uk',
      learningLang: [],
    });

    const result = await controller.getUserLanguages(1);

    expect(service.getUserLanguages).toHaveBeenCalledWith(1);
    expect(result.nativeLang).toBe('uk');
  });

  it('should return all languages', async () => {
    mockLanguagesService.getAllLanguages.mockResolvedValue([
      { code: 'en', name: 'English' },
    ]);

    const result = await controller.getAllLanguages();

    expect(service.getAllLanguages).toHaveBeenCalled();
    expect(result[0].code).toBe('en');
  });

  it('should remove learning languages', async () => {
    mockLanguagesService.removeLearningLangs.mockResolvedValue({
      message: 'All languages was deleted',
    });

    const result = await controller.removeLearningLangs(
      { learningLangs: ['1'] } as any,
      1,
    );

    expect(service.removeLearningLangs).toHaveBeenCalledWith(
      { learningLangs: ['1'] },
      1,
    );
    expect(result).toEqual({ message: 'All languages was deleted' });
  });
});
