import { Test, TestingModule } from '@nestjs/testing';
import { CommentService } from './comment.service';
import { UserService } from '../user/user.service';
import { PostService } from '../post/post.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { NotFoundException } from '@nestjs/common';

const mockCommentRepository = () => ({
  create: jest.fn(),
  save: jest.fn(),
  findAndCount: jest.fn(),
  findOne: jest.fn(),
  remove: jest.fn(),
});

describe('CommentService', () => {
  let commentService: CommentService;
  let commentRepository: Repository<Comment>;
  let userService: UserService;
  let postService: PostService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommentService,
        {
          provide: getRepositoryToken(Comment),
          useFactory: mockCommentRepository,
        },
        {
          provide: UserService,
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: PostService,
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    commentService = module.get<CommentService>(CommentService);
    commentRepository = module.get<Repository<Comment>>(
      getRepositoryToken(Comment),
    );
    userService = module.get<UserService>(UserService);
    postService = module.get<PostService>(PostService);
  });

  describe('create', () => {
    it('should create a comment', async () => {
      const createCommentDto = {
        message: 'Test comment',
        userId: '1',
        postId: '1',
      };
      const user = { id: '1', username: 'testUser' };
      const post = { id: '1', title: 'Test Post' };

      userService.findOne = jest.fn().mockResolvedValue(user);
      postService.findOne = jest.fn().mockResolvedValue(post);
      commentRepository.create = jest.fn().mockReturnValue(createCommentDto);
      commentRepository.save = jest.fn().mockResolvedValue(createCommentDto);

      const result = await commentService.create(createCommentDto);
      expect(result).toEqual(createCommentDto);
      expect(commentRepository.create).toHaveBeenCalledWith({
        ...createCommentDto,
        users: user,
        posts: post,
      });
      expect(commentRepository.save).toHaveBeenCalledWith(createCommentDto);
    });

    it('should throw NotFoundException if user or post does not exist', async () => {
      const createCommentDto = {
        message: 'Test comment',
        userId: '1',
        postId: '1',
      };

      userService.findOne = jest.fn().mockResolvedValue(null);
      postService.findOne = jest.fn().mockResolvedValue(null);

      await expect(commentService.create(createCommentDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findAll', () => {
    it('should return paginated comments', async () => {
      const comments = [{ id: '1', message: 'Test comment' }];
      const total = 1;

      commentRepository.findAndCount = jest
        .fn()
        .mockResolvedValue([comments, total]);

      const result = await commentService.findAll(1, 10);
      expect(result).toEqual({
        comments,
        total,
        page: 1,
        totalPages: 1,
      });
    });
  });

  describe('findOne', () => {
    it('should return a comment', async () => {
      const comment = { id: '1', message: 'Test comment' };
      commentRepository.findOne = jest.fn().mockResolvedValue(comment);

      const result = await commentService.findOne('1');
      expect(result).toEqual(comment);
    });

    it('should throw NotFoundException if comment does not exist', async () => {
      commentRepository.findOne = jest.fn().mockResolvedValue(null);

      await expect(commentService.findOne('1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update and return the comment', async () => {
      const comment = { id: '1', message: 'Old message' };
      const updateCommentDto = { message: 'Updated message' };
      commentRepository.findOne = jest.fn().mockResolvedValue(comment);
      commentRepository.save = jest
        .fn()
        .mockResolvedValue({ ...comment, ...updateCommentDto });

      const result = await commentService.update('1', updateCommentDto);
      expect(result).toEqual({ ...comment, ...updateCommentDto });
    });
  });

  describe('remove', () => {
    it('should remove the comment', async () => {
      const comment = { id: '1', message: 'Test comment' };
      commentRepository.findOne = jest.fn().mockResolvedValue(comment);
      commentRepository.remove = jest.fn();

      await commentService.remove('1');
      expect(commentRepository.remove).toHaveBeenCalledWith(comment);
    });
  });
});
