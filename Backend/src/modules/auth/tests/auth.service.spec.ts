import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { ConflictException, BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { AuthService } from '../auth.service';
import { User } from '../entity/users.entity';
import { Reset } from '../entity/reset.entity';
import { Statistic } from '../../statistic/entity/statistic.entity';
import { LanguagesService } from '../../languages/languages.service';

describe('AuthService', () => {
  let service: AuthService;
  let userRepository: Repository<User>;
  let jwtService: JwtService;

  const mockUserRepository = {
    findOneBy: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockResetRepository = {
    create: jest.fn(),
    delete: jest.fn(),
  };

  const mockStatisticRepository = {
    create: jest.fn(),
  };

  const mockJwtService = {
    signAsync: jest.fn(),
  };

  const mockLangService = {
    createLang: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: getRepositoryToken(User), useValue: mockUserRepository },
        { provide: getRepositoryToken(Reset), useValue: mockResetRepository },
        { provide: getRepositoryToken(Statistic), useValue: mockStatisticRepository },
        { provide: JwtService, useValue: mockJwtService },
        { provide: LanguagesService, useValue: mockLangService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userRepository = module.get(getRepositoryToken(User));
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should throw ConflictException if user exists', async () => {
      mockUserRepository.findOneBy.mockResolvedValue({ id: 1 });

      await expect(
        service.register({ email: 'test@test.com' } as any),
      ).rejects.toThrow(ConflictException);
    });

    it('should create user and return token', async () => {
      mockUserRepository.findOneBy.mockResolvedValue(null);
      jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashed' as never);

      mockUserRepository.create.mockReturnValue({ id: 1 });
      mockStatisticRepository.create.mockReturnValue({});
      mockUserRepository.save.mockResolvedValue({ id: 1, email: 'test@test.com' });

      mockJwtService.signAsync.mockResolvedValue('mockToken');

      const result = await service.register({
        email: 'test@test.com',
        password: '123456',
      } as any);

      expect(result.newToken).toBe('mockToken');
    });
  });

  describe('login', () => {
    it('should throw if user not found', async () => {
      mockUserRepository.findOneBy.mockResolvedValue(null);

      await expect(
        service.login({ email: 'test@test.com' } as any),
      ).rejects.toThrow(BadRequestException);
    });

    it('should return token if credentials valid', async () => {
      mockUserRepository.findOneBy.mockResolvedValue({
        id: 1,
        email: 'test@test.com',
        password: 'hashed',
      });

      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);
      mockJwtService.signAsync.mockResolvedValue('mockToken');

      const result = await service.login({
        email: 'test@test.com',
        password: '123456',
      } as any);

      expect(result).toBe('mockToken');
    });
  });
});
