// src/redis/redis.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { RedisService } from './redis.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

describe('RedisService', () => {
  let redisService: RedisService;
  let cacheManager: Cache;

  // Create a mock cache manager
  const mockCacheManager = {
    set: jest.fn(),
    get: jest.fn(),
    del: jest.fn(),
    reset: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RedisService,
        {
          provide: CACHE_MANAGER,
          useValue: mockCacheManager,
        },
      ],
    }).compile();

    redisService = module.get<RedisService>(RedisService);
    cacheManager = module.get<Cache>(CACHE_MANAGER);
  });

  afterEach(() => {
    jest.clearAllMocks(); // Clear mock calls after each test
  });

  describe('setCache', () => {
    it('should set a value in the cache', async () => {
      const key = 'testKey';
      const value = 'testValue';

      await redisService.setCache(key, value);

      expect(cacheManager.set).toHaveBeenCalledWith(key, value);
    });
  });

  describe('getCache', () => {
    it('should retrieve a value from the cache', async () => {
      const key = 'testKey';
      const value = 'testValue';
      cacheManager.get = jest.fn().mockResolvedValue(value); // Mock return value

      const result = await redisService.getCache<string>(key);

      expect(result).toBe(value);
      expect(cacheManager.get).toHaveBeenCalledWith(key);
    });

    it('should return undefined if the key does not exist', async () => {
      const key = 'nonExistentKey';
      cacheManager.get = jest.fn().mockResolvedValue(undefined); // Mock return value

      const result = await redisService.getCache<string>(key);

      expect(result).toBeUndefined();
      expect(cacheManager.get).toHaveBeenCalledWith(key);
    });
  });

  describe('deleteCache', () => {
    it('should delete a value from the cache', async () => {
      const key = 'testKey';

      await redisService.deleteCache(key);

      expect(cacheManager.del).toHaveBeenCalledWith(key);
    });
  });

  describe('resetCache', () => {
    it('should reset the cache', async () => {
      await redisService.resetCache();

      expect(cacheManager.reset).toHaveBeenCalled();
    });
  });
});
