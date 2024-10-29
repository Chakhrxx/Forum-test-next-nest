// src/redis/redis.service.ts
import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class RedisService {
  // Inject the cache manager into the service
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  // Set a value in the cache with the specified key
  async setCache(key: string, value: any): Promise<void> {
    await this.cacheManager.set(key, value);
  }

  // Retrieve a value from the cache by its key
  async getCache<T>(key: string): Promise<T | undefined> {
    const cachedValue = await this.cacheManager.get<T>(key);
    return cachedValue; // Return the cached value or undefined if not found
  }

  // Delete a value from the cache using its key
  async deleteCache(key: string): Promise<void> {
    await this.cacheManager.del(key);
  }

  // Reset the entire cache, removing all cached values
  async resetCache(): Promise<void> {
    await this.cacheManager.reset();
  }
}
