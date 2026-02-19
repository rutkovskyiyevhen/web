import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LanguagesService } from '../languages.service';
import { Language } from '../entity/lang.entity';
import { User } from '../../auth/entity/users.entity';

describe('LanguagesService', () => {
  let service: LanguagesService;
  let langRepository: Repository<Language>;
  let userRepository: Repository<User>;

  const mockLangRepository = {
    create: jest.fn(),
    save: jest.fn(),
    count: jest.fn(),
    delete: jest.fn(),
  };

  const mockUserRepository = {
    findOne: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LanguagesService,
        { provide: getRepositoryToken(Language), useValue: mockLangRepository },
        { provide: getRepositoryToken(User), useValue: mockUserRepository },
      ],
    }).compile();

    service = module.get<LanguagesService>(LanguagesService);
    langRepository = module.get(getRepositoryToken(Language));
    userRepository = module.get(getRepositoryToken(User));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createLang', () => {
    it('should create and save language', async () => {
      const mockLang = { id: 1, learningLang: 'en' };
      mockLangRepository.create.mockReturnValue(mockLang);
      mockLangRepository.save.mockResolvedValue(mockLang);

      const result = await service.createLang({ id: 1 } as any, 'en', 1);

      expect(result).toEqual(mockLang);
      expect(mockLangRepository.save).toHaveBeenCalled();
    });
  });

  describe('changeNativeLang', () => {
    it('should update native language', async () => {
      const user = { id: 1, nativeLang: 'en' };
      mockUserRepository.findOne.mockResolvedValue(user);
      mockUserRepository.save.mockResolvedValue(user);

      const result = await service.changeNativeLang(
        { nativeLang: 'uk' } as any,
        1,
      );

      expect(user.nativeLang).toBe('uk');
      expect(result).toEqual({
        message: 'Native language successfully changed',
      });
    });
  });

  describe('getUserLanguages', () => {
    it('should return mapped languages', async () => {
      const user = {
        nativeLang: 'uk',
        learningLangs: [
          { id: 1, learningLang: 'en', priority: 1 },
        ],
      };

      jest.spyOn(service, 'getLanguages').mockResolvedValue(user as any);

      const result = await service.getUserLanguages(1);

      expect(result.nativeLang).toBe('uk');
      expect(result.learningLang[0].lang).toBe('en');
    });
  });

  describe('removeLearningLangs', () => {
    it('should delete languages', async () => {
      mockLangRepository.delete.mockResolvedValue({});

      const result = await service.removeLearningLangs(
        { learningLangs: ['1', '2'] } as any,
        1,
      );

      expect(mockLangRepository.delete).toHaveBeenCalled();
      expect(result).toEqual({ message: 'All languages was deleted' });
    });
  });
});
