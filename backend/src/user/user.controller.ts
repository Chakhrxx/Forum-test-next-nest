import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  BadRequestException,
  InternalServerErrorException,
  Logger,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RedisService } from '../redis/redis.service';
import { User } from './entities/user.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('users') // Define the base route for user-related endpoints
export class UserController {
  private readonly logger = new Logger(UserController.name); // Create a logger instance

  constructor(
    private readonly userService: UserService, // Inject UserService for handling user operations
    private readonly redisService: RedisService, // Inject RedisService for caching
  ) {}

  // Endpoint to create a new user
  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    this.logger.log('Creating a new user'); // Log action
    try {
      const user = await this.userService.create(createUserDto); // Create user in the database
      await this.redisService.resetCache();
      await this.redisService.setCache(`user:${user.id}`, user); // Cache the newly created user
      this.logger.log(`User created with ID: ${user.id}`); // Log the created user
      return user; // Return the created user
    } catch (error) {
      this.logger.error(error); // Log the error
      throw new InternalServerErrorException(error);
    }
  }

  // Endpoint to retrieve all users
  @Get()
  async findAll(): Promise<User[]> {
    this.logger.log('Retrieving all users'); // Log action
    try {
      const cachedUsers: User[] = await this.redisService.getCache('users'); // Check cache for users
      if (cachedUsers) {
        this.logger.log('Returniang cached users'); // Log cache hit
        return cachedUsers; // Return cached users if available
      }
      const users = await this.userService.findAll(); // Fetch users from the database
      await this.redisService.setCache('users', users); // Cache the retrieved users
      this.logger.log(`Users retrieved`); // Log the retrieved users
      return users; // Return the users
    } catch (error) {
      this.logger.error(error); // Log the error
      throw new InternalServerErrorException(error);
    }
  }

  // Endpoint to retrieve a user by ID
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<User> {
    // Validate the ID parameter
    if (!id || typeof id !== 'string') {
      throw new BadRequestException(
        'Invalid ID parameter. It must be a non-empty string.',
      );
    }
    this.logger.log(`Retrieving user with ID: ${id}`); // Log action
    try {
      const cachedUser: User = await this.redisService.getCache(`user:${id}`); // Check cache for the user
      if (cachedUser) {
        this.logger.log(`Returning cached user with ID: ${id}`); // Log cache hit
        return cachedUser; // Return cached user if available
      }
      const user = await this.userService.findOne(id); // Fetch user from the database
      await this.redisService.setCache(`user:${id}`, user); // Cache the retrieved user
      this.logger.log(`User retrieved with ID: ${id}}`); // Log the retrieved user
      return user; // Return the user
    } catch (error) {
      this.logger.error(error); // Log the error
      throw new InternalServerErrorException(error);
    }
  }

  // Endpoint to update a user by ID
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    // Validate the ID parameter
    if (!id || typeof id !== 'string') {
      throw new BadRequestException(
        'Invalid ID parameter. It must be a non-empty string.',
      );
    }
    this.logger.log(`Updating user with ID: ${id}`); // Log action
    try {
      const user = await this.userService.update(id, updateUserDto); // Update the user in the database
      await this.redisService.resetCache();
      await this.redisService.setCache(`user:${user.id}`, user); // Cache the updated user
      this.logger.log(`User updated with ID: ${id}`); // Log the updated user
      return user; // Return the updated user
    } catch (error) {
      this.logger.error(error); // Log the error
      throw new InternalServerErrorException(error);
    }
  }

  // Endpoint to delete a user by ID
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    // Validate the ID parameter
    if (!id || typeof id !== 'string') {
      throw new BadRequestException(
        'Invalid ID parameter. It must be a non-empty string.',
      );
    }
    this.logger.log(`Deleting user with ID: ${id}`); // Log action
    try {
      await this.userService.remove(id); // Delete the user from the database
      await this.redisService.deleteCache(`user:${id}`); // Remove the user from cache
      await this.redisService.resetCache();
      this.logger.log(`User deleted with ID: ${id}`); // Log successful deletion
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(error);
    }
  }
}
