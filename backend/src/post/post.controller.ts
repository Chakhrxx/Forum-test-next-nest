import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Logger,
  InternalServerErrorException,
  BadRequestException,
  Query,
  UseGuards,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { RedisService } from '../redis/redis.service';
import { PaginatedPosts, Post as PostEntity } from './entities/post.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { User } from 'src/user/entities/user.entity';

interface AuthRequest extends Request {
  user: User;
}

@UseGuards(JwtAuthGuard)
@Controller('posts')
export class PostController {
  private readonly logger = new Logger(PostController.name); // Create a logger instance
  constructor(
    private readonly postService: PostService, // Inject PostService for handling post operations
    private readonly redisService: RedisService, // Inject RedisService for caching
  ) {}

  // Endpoint to create a new post
  @Post()
  async create(@Body() createPostDto: CreatePostDto): Promise<PostEntity> {
    this.logger.log('Creating a new post'); // Log action
    try {
      const post = await this.postService.create(createPostDto); // Create post in the database
      await this.redisService.resetCache();
      await this.redisService.setCache(`post:${post.id}`, post); // Cache the newly created post
      this.logger.log(`Post created with ID: ${post.id}`); // Log the created post
      return post; // Return the created post
    } catch (error) {
      this.logger.error(error); // Log the error
      throw new InternalServerErrorException(error);
    }
  }

  // Endpoint to retrieve all posts
  @Get()
  async findAll(
    @Query('page') page: string = '1', // Default to string
    @Query('limit') limit: string = '20', // Default to string
  ): Promise<PaginatedPosts> {
    this.logger.log('Retrieving all posts'); // Log action
    try {
      // Parse page and limit to numbers
      const validPage = Math.max(1, Number(page) || 1);
      const validLimit = Math.min(100, Math.max(1, Number(limit) || 20));

      // Log the valid page and limit
      this.logger.log(`Page: ${validPage}, Limit: ${validLimit}`);

      const cachedPosts: PaginatedPosts | null =
        await this.redisService.getCache(
          `posts:page:${validPage}:limit:${validLimit}`,
        ); // Check cache for posts

      if (cachedPosts) {
        this.logger.log('Returning cached posts'); // Log cache hit
        return cachedPosts; // Return cached posts if available
      }

      const posts = await this.postService.findAll(validPage, validLimit); // Fetch posts from the database

      // Cache the retrieved posts
      await this.redisService.setCache(
        `posts:page:${validPage}:limit:${validLimit}`,
        posts,
      );

      this.logger.log('Posts retrieved'); // Log the retrieved posts
      return posts; // Return the posts
    } catch (error) {
      this.logger.error(error); // Log the error
      throw new InternalServerErrorException(error);
    }
  }
  @Get('/me')
  async findMyPost(
    @Req() req: AuthRequest,
    @Query('page') page: string = '1', // Default to string
    @Query('limit') limit: string = '20', // Default to string
  ): Promise<PaginatedPosts> {
    this.logger.log('Retrieving all posts'); // Log action
    try {
      // Parse page and limit to numbers
      const validPage = Math.max(1, Number(page) || 1);
      const validLimit = Math.min(100, Math.max(1, Number(limit) || 20));

      // Log the valid page and limit
      this.logger.log(`Page: ${validPage}, Limit: ${validLimit}`);

      const cachedPosts: PaginatedPosts | null =
        await this.redisService.getCache(
          `myPosts:page:${validPage}:limit:${validLimit}`,
        ); // Check cache for posts

      if (cachedPosts) {
        this.logger.log('Returning cached posts'); // Log cache hit
        return cachedPosts; // Return cached posts if available
      }

      const { user } = req;

      if (!user) {
        throw new UnauthorizedException('Invalid access token');
      }

      const posts = await this.postService.findMyPost(
        user.id,
        validPage,
        validLimit,
      ); // Fetch posts from the database

      // Cache the retrieved posts
      await this.redisService.setCache(
        `myPosts:page:${validPage}:limit:${validLimit}`,
        posts,
      );

      this.logger.log('Posts retrieved'); // Log the retrieved posts
      return posts; // Return the posts
    } catch (error) {
      this.logger.error(error); // Log the error
      throw new InternalServerErrorException(error);
    }
  }

  // Endpoint to retrieve a post by ID
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<PostEntity> {
    // Validate the ID parameter
    if (!id || typeof id !== 'string') {
      throw new BadRequestException(
        'Invalid ID parameter. It must be a non-empty string.',
      );
    }
    this.logger.log(`Retrieving post with ID: ${id}`); // Log action
    try {
      const cachedUser: PostEntity = await this.redisService.getCache(
        `post:${id}`,
      ); // Check cache for the post
      if (cachedUser) {
        this.logger.log(`Returning cached post with ID: ${id}`); // Log cache hit
        return cachedUser; // Return cached post if available
      }
      const post = await this.postService.findOne(id); // Fetch post from the database
      await this.redisService.setCache(`post:${id}`, post); // Cache the retrieved post
      this.logger.log(`Post retrieved with ID: ${id}}`); // Log the retrieved post
      return post; // Return the post
    } catch (error) {
      this.logger.error(error); // Log the error
      throw new InternalServerErrorException(error);
    }
  }

  // Endpoint to update a post by ID
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
  ): Promise<PostEntity> {
    // Validate the ID parameter
    if (!id || typeof id !== 'string') {
      throw new BadRequestException(
        'Invalid ID parameter. It must be a non-empty string.',
      );
    }
    this.logger.log(`Updating post with ID: ${id}`); // Log action
    try {
      const post = await this.postService.update(id, updatePostDto); // Update the post in the database
      await this.redisService.resetCache();
      await this.redisService.setCache(`post:${id}`, post); // Cache the updated post
      this.logger.log(`Post updated with ID: ${id}`); // Log the updated post
      return post; // Return the updated post
    } catch (error) {
      this.logger.error(error); // Log the error
      throw new InternalServerErrorException(error);
    }
  }

  // Endpoint to delete a post by ID
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    // Validate the ID parameter
    if (!id || typeof id !== 'string') {
      throw new BadRequestException(
        'Invalid ID parameter. It must be a non-empty string.',
      );
    }
    this.logger.log(`Deleting post with ID: ${id}`); // Log action
    try {
      await this.postService.remove(id); // Delete the post from the database
      await this.redisService.deleteCache(`post:${id}`); // Remove the post from cache
      await this.redisService.resetCache();
      this.logger.log(`Post deleted with ID: ${id}`); // Log successful deletion
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(error);
    }
  }
}
