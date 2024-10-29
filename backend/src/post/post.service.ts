import { UserService } from '../user/user.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginatedPosts, Post } from './entities/post.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post) // Injects the Post repository for handling database operations related to posts
    private readonly postRepository: Repository<Post>, // Repository instance to perform CRUD operations on Post entities
    private readonly userService: UserService, // Service to manage user-related operations and data retrieval
  ) {}

  // Create a new post
  async create(createPostDto: CreatePostDto): Promise<Post> {
    // Fetch the user based on the provided userId from the DTO
    const user = await this.userService.findOne(createPostDto.userId);
    // Check if the user exists; if not, throw a NotFoundException
    if (!user) {
      throw new NotFoundException(
        `User with ID ${createPostDto.userId} not found.`,
      );
    }
    // Create a new post instance using the data from the DTO and the found user
    const post = this.postRepository.create({ ...createPostDto, users: user });
    // Save the new post to the database and return it
    return await this.postRepository.save(post);
  }

  // Retrieve all posts
  async findAll(page: number = 1, limit: number = 20): Promise<PaginatedPosts> {
    // Ensure page and limit are valid numbers
    const validPage = Math.max(1, Number(page) || 1); // Default to 1 if not a valid number
    const validLimit = Math.min(100, Math.max(1, Number(limit) || 20)); // Ensure limit is between 1 and 100

    const [result, total] = await this.postRepository.findAndCount({
      relations: ['users', 'comments', 'comments.users'], // Include the user for comments
      skip: (validPage - 1) * validLimit, // Calculate skip value
      take: validLimit, // Limit the number of posts returned
      order: {
        created: 'ASC', // Order by created date in ascending order
      },
      select: {
        id: true,
        title: true,
        description: true,
        community: true,
        created: true,
        users: {
          id: true, // Select specific fields from User
          username: true, // Only include the username
        },
        comments: {
          id: true, // Include comment id
          message: true, // Include comment message
          created: true, // Ensure this field exists
          users: {
            id: true, // User ID for the comment
            username: true, // Username for the comment
          },
        },
      },
    });

    // Sort comments for each post
    result.forEach((post) => {
      post.comments.sort((a, b) => {
        return new Date(a.created).getTime() - new Date(b.created).getTime(); // Convert to Date if necessary
      });
    });

    return {
      posts: result,
      total,
      page: validPage,
      totalPages: Math.ceil(total / validLimit),
    };
  }

  async findMyPost(
    userId: string,
    page: number = 1,
    limit: number = 20,
  ): Promise<PaginatedPosts> {
    // Ensure page and limit are valid numbers
    const validPage = Math.max(1, Number(page) || 1); // Default to 1 if not a valid number
    const validLimit = Math.min(100, Math.max(1, Number(limit) || 20)); // Ensure limit is between 1 and 100

    const [result, total] = await this.postRepository.findAndCount({
      where: { users: { id: userId } }, // Filter by user ID
      relations: ['users', 'comments', 'comments.users'], // Include user for comments
      skip: (validPage - 1) * validLimit, // Calculate skip value
      take: validLimit, // Limit the number of posts returned
      order: {
        created: 'ASC', // Order by created date in ascending order
      },
      select: {
        id: true,
        title: true,
        description: true,
        community: true,
        created: true,
        users: {
          id: true, // Select specific fields from User
          username: true, // Only include the username
        },
        comments: {
          id: true, // Include comment id
          message: true, // Include comment message
          created: true,
          users: {
            // Include user information for each comment
            id: true, // User ID for the comment
            username: true, // Username for the comment
          },
        },
      },
    });

    result.forEach((post) => {
      post.comments.sort((a, b) => {
        return a.created.getTime() - b.created.getTime(); // Sort by created date in ascending order
      });
    });

    return {
      posts: result,
      total,
      page: validPage,
      totalPages: Math.ceil(total / validLimit),
    };
  }

  // Retrieve a post by ID
  async findOne(id: string): Promise<Post> {
    // Use QueryBuilder to find the post by ID and select specific fields
    const post = await this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.users', 'users') // Join user
      .leftJoinAndSelect('post.comments', 'comments') // Join comments
      .leftJoinAndSelect('comments.users', 'commentUser') // Join comments
      .where('post.id = :id', { id }) // Filter by post ID
      .select([
        'post.id',
        'post.title',
        'post.description',
        'post.community',
        'post.created',
        'users.id',
        'users.username',
        'comments.id',
        'commentUser.id',
        'commentUser.username',
        'comments.message',
        'comments.created',
        'comments.updated',
      ])
      .orderBy('comments.created', 'ASC')
      .getOne();

    if (!post) {
      // Throw an error if post not found
      throw new NotFoundException(`Post with Id ${id} not found`);
    }

    return post; // Return the found post
  }

  // Update a post by ID
  async update(id: string, updatePostDto: UpdatePostDto): Promise<Post> {
    // Check if the post exists
    const post = await this.findOne(id);
    // Merge updates into the existing post
    const updatedPost = Object.assign(post, updatePostDto);
    // Save and return the updated post
    return await this.postRepository.save(updatedPost);
  }

  // Remove a post by ID
  async remove(id: string): Promise<void> {
    // Check if the post exists
    const post = await this.findOne(id);
    // Remove the post from the repository
    await this.postRepository.remove(post);
  }
}
