import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment, PaginatedComments } from './entities/comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { UserService } from '../user/user.service';
import { PostService } from '../post/post.service';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment) // Injects the Comment repository for database operations
    private readonly commentRepository: Repository<Comment>, // Repository instance for managing Comment entities
    private readonly userService: UserService, // Service to handle user-related operations
    private readonly postService: PostService, // Service to manage post-related operations
  ) {}

  // Create a new comment
  async create(createCommentDto: CreateCommentDto): Promise<Comment> {
    // Retrieve the user and post associated with the comment
    const user = await this.userService.findOne(createCommentDto.userId);
    const post = await this.postService.findOne(createCommentDto.postId);

    // Check if the user and post exist
    if (!user || !post) {
      throw new NotFoundException(
        `User with ID ${createCommentDto.userId} or Post with ID ${createCommentDto.postId} not found.`,
      );
    }

    // Create a new comment instance with the provided data
    const comment = this.commentRepository.create({
      ...createCommentDto,
      users: user, // Associate the comment with the found user
      posts: post, // Associate the comment with the found post
    });

    // Save the comment to the database and return it
    return await this.commentRepository.save(comment);
  }

  // Retrieve all comments

  async findAll(
    page: number = 1,
    limit: number = 20,
  ): Promise<PaginatedComments> {
    // Ensure page and limit are valid numbers
    const validPage = Math.max(1, Number(page) || 1); // Default to 1 if not a valid number
    const validLimit = Math.min(100, Math.max(1, Number(limit) || 20)); // Ensure limit is between 1 and 100

    const [result, total] = await this.commentRepository.findAndCount({
      relations: ['posts', 'users'],
      skip: (validPage - 1) * validLimit, // Calculate skip value
      take: validLimit, // Limit the number of posts returned
      select: {
        id: true,
        message: true,
        users: {
          id: true, // Select specific fields from User
          username: true, // Only include the username
        },
        posts: {
          id: true, // Include comment id
          title: true,
          description: true,
          community: true,
        },
      },
    });

    return {
      comments: result,
      total,
      page: validPage,
      totalPages: Math.ceil(total / validLimit),
    };
  }

  // Retrieve a comment by ID
  async findOne(id: string): Promise<Comment> {
    // Find the comment by ID, including user and post relationships
    const comment = await this.commentRepository.findOne({
      where: { id },
      relations: ['users', 'posts'],
    });

    // Throw an error if the comment is not found
    if (!comment) {
      throw new NotFoundException(`Comment with Id ${id} not found`);
    }

    return comment; // Return the found comment
  }

  // Update a comment by ID
  async update(
    id: string,
    updateCommentDto: UpdateCommentDto,
  ): Promise<Comment> {
    // Check if the comment exists
    const comment = await this.findOne(id);
    // Merge updates into the existing comment
    const updatedComment = Object.assign(comment, updateCommentDto);
    // Save and return the updated comment
    return await this.commentRepository.save(updatedComment);
  }

  // Remove a comment by ID
  async remove(id: string): Promise<void> {
    // Check if the comment exists
    const comment = await this.findOne(id);
    // Remove the comment from the repository
    await this.commentRepository.remove(comment);
  }
}
