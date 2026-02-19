import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { of, throwError } from 'rxjs';
import { SearchService } from '../search.service';

describe('SearchService', () => {
  let service: SearchService;
  let httpService: HttpService;

  const mockHttpService = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SearchService,
        {
          provide: HttpService,
          useValue: mockHttpService,
        },
      ],
    }).compile();

    service = module.get<SearchService>(SearchService);
    httpService = module.get<HttpService>(HttpService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return data from external API', async () => {
    const mockResponse = { data: { word: 'hello' } };

    mockHttpService.get.mockReturnValue(of(mockResponse));

    const result = await service.getWord('hello');

    expect(httpService.get).toHaveBeenCalled();
    expect(result).toEqual({ word: 'hello' });
  });

  it('should return error message if API fails', async () => {
    mockHttpService.get.mockReturnValue(
      throwError(() => new Error('API error')),
    );

    const result = await service.getWord('wrongword');

    expect(result).toEqual({
      message: 'Word not found. Check spelling.',
    });
  });
});
