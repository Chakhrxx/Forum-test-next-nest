import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';
import { RedisModule } from './redis/redis.module';
import { RedisService } from './redis/redis.service';
import { UserModule } from './user/user.module';
import { PostModule } from './post/post.module';
import { CommentModule } from './comment/comment.module';
import { UserController } from './user/user.controller';
import { PostController } from './post/post.controller';
import { CommentController } from './comment/comment.controller';
import { UserService } from './user/user.service';
import { PostService } from './post/post.service';
import { CommentService } from './comment/comment.service';
import { User } from './user/entities/user.entity';
import { Post } from './post/entities/post.entity';
import { Comment } from './comment/entities/comment.entity';
import { APP_GUARD } from '@nestjs/core';
import { ApiKeyGuard } from './auth/apikey.guard';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('PG_HOST') || process.env.PG_HOST,
        port:
          configService.get<number>('PG_PORT') || Number(process.env.PG_USER),
        username: configService.get<string>('PG_USER') || process.env.PG_USER,
        password:
          configService.get<string>('PG_PASSWORD') || process.env.PG_PASSWORD,
        database:
          configService.get<string>('PG_DATABASE') || process.env.PG_DATABASE,
        entities: [User, Post, Comment],
        synchronize: true,
        cache: {
          duration: 30000,
        },
        extra: {
          max: 10,
          idleTimeoutMillis: 30000,
          connectionTimeoutMillis: 5000,
        },
      }),
      inject: [ConfigService],
    }),
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const store = await redisStore({
          socket: {
            host:
              configService.get<string>('REDIS_HOST') || process.env.REDIS_HOST,
            port:
              configService.get<number>('REDIS_PORT') ||
              Number(process.env.REDIS_PORT),
          },
          password:
            configService.get<string>('REDIS_PASSWORD') ||
            process.env.REDIS_PASSWORD,
          ttl: 24 * 60 * 60 * 1000,
        });

        return {
          store,
        };
      },
      isGlobal: true, // Makes the cache available globally in the app
    }),
    RedisModule,
    UserModule,
    PostModule,
    CommentModule,
    AuthModule,
  ],
  controllers: [
    AppController,
    UserController,
    PostController,
    CommentController,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ApiKeyGuard, // Register ApiKeyGuard as a global guard
    },
    AppService,
    RedisService,
    UserService,
    PostService,
    CommentService,
  ],
})
export class AppModule {}
