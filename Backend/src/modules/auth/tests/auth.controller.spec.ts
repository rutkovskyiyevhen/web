import { Test, TestingModule } from '@nestjs/testing';
import { Response } from 'express';
import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    register: jest.fn(),
    login: jest.fn(),
    sendCodeEmail: jest.fn(),
    verifiedUser: jest.fn(),
    setNewPassword: jest.fn(),
    googleAuth: jest.fn(),
  };

  const mockResponse = () => {
    const res: Partial<Response> = {};
    res.cookie = jest.fn();
    res.clearCookie = jest.fn();
    res.redirect = jest.fn();
    return res as Response;
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should register user and set cookie', async () => {
    mockAuthService.register.mockResolvedValue({
      message: 'Registration successful',
      newToken: 'mockToken',
    });

    const res = mockResponse();

    const result = await controller.registration(
      { email: 'test@test.com', password: '123456' } as any,
      res,
    );

    expect(authService.register).toHaveBeenCalled();
    expect(res.cookie).toHaveBeenCalled();
    expect(result).toEqual({ message: 'Registration successful' });
  });

  it('should login user and set cookie', async () => {
    mockAuthService.login.mockResolvedValue('mockToken');

    const res = mockResponse();

    const result = await controller.login(
      { email: 'test@test.com', password: '123456' } as any,
      res,
    );

    expect(authService.login).toHaveBeenCalled();
    expect(res.cookie).toHaveBeenCalled();
    expect(result).toEqual({ message: 'Logged in successfully!' });
  });

  it('should logout and clear cookie', async () => {
    const res = mockResponse();

    const result = await controller.logout(res);

    expect(res.clearCookie).toHaveBeenCalledWith('jwt', expect.any(Object));
    expect(result).toEqual({ message: 'Logged out successfully' });
  });

  it('should return current user', () => {
    const req = { user: { id: 1 } };
    const result = controller.getMe(req);
    expect(result).toEqual({ id: 1 });
  });
});
