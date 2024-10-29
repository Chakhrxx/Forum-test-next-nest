import { Test, TestingModule } from '@nestjs/testing';
import { PostService } from './post.service';
import { Post, Community } from './entities/post.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { UserService } from '../user/user.service';

describe('PostService', () => {
  let postService: PostService;

  const mockPost: Post = {
    id: '1',
    title: 'Cooking Tips',
    description: 'Learn effective cooking techniques.',
    community: Community.Food,
    created: new Date(),
    updated: new Date(),
    users: {
      id: '8769e14b-1eb2-4009-bbf7-80884d8f9b70',
      username: 'JaneDoe',
      email: 'jane@example.com',
      posts: [],
      comments: [],
      created: new Date(),
      updated: new Date(),
      hasId: jest.fn(),
      save: jest.fn(),
      remove: jest.fn(),
      softRemove: jest.fn(),
      recover: jest.fn(),
      reload: jest.fn(),
    },
    comments: [],
    hasId: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
    softRemove: jest.fn(),
    recover: jest.fn(),
    reload: jest.fn(),
  };

  const mockPostRepository = {
    create: jest
      .fn()
      .mockImplementation((dto: CreatePostDto) => ({ id: '1', ...dto })),
    save: jest.fn().mockResolvedValue(mockPost),
    findAndCount: jest.fn().mockResolvedValue([[], 0]),
    createQueryBuilder: jest.fn().mockReturnThis(),
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    getOne: jest.fn(),
    remove: jest.fn().mockResolvedValue(mockPost),
  };

  const mockUserService = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostService,
        {
          provide: getRepositoryToken(Post),
          useValue: mockPostRepository,
        },
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    postService = module.get<PostService>(PostService);
  });

  it('should be defined', () => {
    expect(postService).toBeDefined();
  });

  describe('create', () => {
    it('should create and return a new post', async () => {
      const createPostDto: CreatePostDto = {
        title: 'Cooking Tips',
        description: 'Learn effective cooking techniques.',
        community: Community.Food,
        userId: '8769e14b-1eb2-4009-bbf7-80884d8f9b70',
      };

      const user = {
        id: '8769e14b-1eb2-4009-bbf7-80884d8f9b70',
        username: 'JaneDoe',
        email: 'jane@example.com',
      };

      // Mock the user service to return the user
      mockUserService.findOne.mockResolvedValue(user);

      const result = await postService.create(createPostDto);

      // Ensure the user was found
      expect(mockUserService.findOne).toHaveBeenCalledWith(
        createPostDto.userId,
      );

      // Define expected post structure without userId
      const expectedPost = {
        id: expect.any(String), // This will be assigned upon saving
        title: createPostDto.title,
        description: createPostDto.description,
        community: createPostDto.community,
        users: user,
        created: expect.any(Date), // Include created field
        updated: expect.any(Date), // Include updated field
      };

      // Check the parameters used in create
      expect(mockPostRepository.create).toHaveBeenCalledWith({
        title: createPostDto.title,
        description: createPostDto.description,
        community: createPostDto.community,
        users: user,
      });

      // Check the parameters used in save
      expect(mockPostRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          id: expect.any(String),
          title: createPostDto.title,
          description: createPostDto.description,
          community: createPostDto.community,
          users: user,
          created: expect.any(Date), // Ensure created date is checked
          updated: expect.any(Date), // Ensure updated date is checked
        }),
      );

      // Verify the result
      expect(result).toEqual(expectedPost);
    });

    it('should throw NotFoundException if user does not exist', async () => {
      const createPostDto: CreatePostDto = {
        title: 'Cooking Tips',
        description: 'Learn effective cooking techniques.',
        community: Community.Food,
        userId: 'non-existent-8769e14b-1eb2-4009-bbf7-80884d8f9b70',
      };

      mockUserService.findOne.mockResolvedValue(null);

      await expect(postService.create(createPostDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findAll', () => {
    it('should return a paginated list of posts', async () => {
      const result = await postService.findAll(1, 10);

      expect(mockPostRepository.findAndCount).toHaveBeenCalledWith({
        skip: 0,
        take: 10,
        relations: ['users', 'comments'],
        select: {
          id: true,
          title: true,
          description: true,
          community: true,
          users: { id: true, username: true },
          comments: { id: true, message: true },
        },
      });
      expect(result).toEqual({ posts: [], total: 0, page: 1, totalPages: 0 });
    });
  });

  describe('findOne', () => {
    it('should return a post by ID', async () => {
      mockPostRepository.getOne.mockResolvedValue(mockPost);

      const result = await postService.findOne('1');

      expect(mockPostRepository.getOne).toHaveBeenCalled();
      expect(result).toEqual(mockPost);
    });

    it('should throw NotFoundException if post does not exist', async () => {
      mockPostRepository.getOne.mockResolvedValue(null);

      await expect(postService.findOne('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update and return the post', async () => {
      const updatePostDto: UpdatePostDto = { title: 'Updated Cooking Tips' };
      mockPostRepository.getOne.mockResolvedValue(mockPost);

      const result = await postService.update('1', updatePostDto);

      expect(mockPostRepository.getOne).toHaveBeenCalled();
      expect(Object.assign(mockPost, updatePostDto)).toEqual(result);
      expect(mockPostRepository.save).toHaveBeenCalledWith(result);
    });

    it('should throw NotFoundException if post does not exist', async () => {
      mockPostRepository.getOne.mockResolvedValue(null);

      await expect(postService.update('non-existent-id', {})).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should remove the post', async () => {
      mockPostRepository.getOne.mockResolvedValue(mockPost);

      await postService.remove('1');

      expect(mockPostRepository.getOne).toHaveBeenCalled();
      expect(mockPostRepository.remove).toHaveBeenCalledWith(mockPost);
    });

    it('should throw NotFoundException if post does not exist', async () => {
      mockPostRepository.getOne.mockResolvedValue(null);

      await expect(postService.remove('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
