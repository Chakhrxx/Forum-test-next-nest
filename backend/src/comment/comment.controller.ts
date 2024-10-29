import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Logger,
  BadRequestException,
  InternalServerErrorException,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { RedisService } from '../redis/redis.service';
import { Comment, PaginatedComments } from './entities/comment.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('comments')
export class CommentController {
  private readonly logger = new Logger(CommentController.name); // Create a logger instance

  constructor(
    private readonly commentService: CommentService, // Inject CommentService for handling comment operations
    private readonly redisService: RedisService, // Inject RedisService for caching
  ) {}

  // Endpoint to create a new comment
  @Post()
  async create(@Body() createCommentDto: CreateCommentDto): Promise<Comment> {
    this.logger.log('Creating a new comment'); // Log action
    try {
      const comment = await this.commentService.create(createCommentDto); // Create comment in the database
      await this.redisService.resetCache();
      await this.redisService.setCache(`comment:${comment.id}`, comment); // Cache the newly created comment
      this.logger.log(`Comment created with ID: ${comment.id}`); // Log the created comment
      return comment; // Return the created comment
    } catch (error) {
      this.logger.error(error); // Log the error
      throw new InternalServerErrorException(error);
    }
  }

  @Get()
  async findAll(
    @Query('page') page: string = '1', // Default to string
    @Query('limit') limit: string = '20', // Default to string
  ): Promise<PaginatedComments> {
    this.logger.log('Retrieving all comments'); // Log action
    try {
      // Parse page and limit to numbers
      const validPage = Math.max(1, Number(page) || 1);
      const validLimit = Math.min(100, Math.max(1, Number(limit) || 20));

      // Log the valid page and limit
      this.logger.log(`Page: ${validPage}, Limit: ${validLimit}`);

      const cachedPosts: PaginatedComments | null =
        await this.redisService.getCache(
          `comments:page:${validPage}:limit:${validLimit}`,
        ); // Check cache for comments

      if (cachedPosts) {
        this.logger.log('Returning cached comments'); // Log cache hit
        return cachedPosts; // Return cached comments if available
      }

      const comments = await this.commentService.findAll(validPage, validLimit); // Fetch comments from the database

      // Cache the retrieved comments
      await this.redisService.setCache(
        `comments:page:${validPage}:limit:${validLimit}`,
        comments,
      );

      this.logger.log('Posts retrieved'); // Log the retrieved posts
      return comments; // Return the posts
    } catch (error) {
      this.logger.error(error); // Log the error
      throw new InternalServerErrorException(error);
    }
  }

  // Endpoint to retrieve a comment by ID
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Comment> {
    // Validate the ID parameter
    if (!id || typeof id !== 'string') {
      throw new BadRequestException(
        'Invalid ID parameter. It must be a non-empty string.',
      );
    }
    this.logger.log(`Retrieving comment with ID: ${id}`); // Log action
    try {
      const cachedUser: Comment = await this.redisService.getCache(
        `comment:${id}`,
      ); // Check cache for the comment
      if (cachedUser) {
        this.logger.log(`Returning cached comment with ID: ${id}`); // Log cache hit
        return cachedUser; // Return cached comment if available
      }
      const comment = await this.commentService.findOne(id); // Fetch comment from the database
      await this.redisService.setCache(`comment:${id}`, comment); // Cache the retrieved comment
      this.logger.log(`Comment retrieved with ID: ${id}}`); // Log the retrieved comment
      return comment; // Return the comment
    } catch (error) {
      this.logger.error(error); // Log the error
      throw new InternalServerErrorException(error);
    }
  }

  // Endpoint to update a comment by ID
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCommentDto: UpdateCommentDto,
  ): Promise<Comment> {
    // Validate the ID parameter
    if (!id || typeof id !== 'string') {
      throw new BadRequestException(
        'Invalid ID parameter. It must be a non-empty string.',
      );
    }
    this.logger.log(`Updating comment with ID: ${id}`); // Log action
    try {
      const comment = await this.commentService.update(id, updateCommentDto); // Update the comment in the database
      await this.redisService.resetCache();
      await this.redisService.setCache(`comment:${id}`, comment); // Cache the updated comment
      this.logger.log(`Commnet updated with ID: ${id}`); // Log the updated comment
      return comment; // Return the updated comment
    } catch (error) {
      this.logger.error(error); // Log the error
      throw new InternalServerErrorException(error);
    }
  }

  // Endpoint to delete a comment by ID
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    // Validate the ID parameter
    if (!id || typeof id !== 'string') {
      throw new BadRequestException(
        'Invalid ID parameter. It must be a non-empty string.',
      );
    }
    this.logger.log(`Deleting comment with ID: ${id}`); // Log action
    try {
      await this.redisService.deleteCache(`comment:${id}`); // Remove the comment from cache
      await this.commentService.remove(id); // Delete the comment from the database
      await this.redisService.resetCache();
      this.logger.log(`Comment deleted with ID: ${id}`); // Log successful deletion
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(error);
    }
  }
}
