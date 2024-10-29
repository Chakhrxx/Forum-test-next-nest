// src/redis/redis.module.ts
import { Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  // Import the CacheModule to enable caching functionality
  imports: [],
  // Define providers for dependency injection, including the RedisService
  providers: [RedisService],
  // Export the RedisService so it can be used in other modules
  exports: [RedisService],
})
export class RedisModule {}
