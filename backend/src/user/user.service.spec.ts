import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

describe('UserService', () => {
  let userService: UserService;

  const mockUser: User = {
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
  };

  const mockUserRepository = {
    create: jest.fn().mockImplementation((dto: CreateUserDto) => {
      return { id: '1', ...dto }; // Mock a user object with an ID
    }),
    save: jest.fn().mockImplementation((user: User) => Promise.resolve(user)),
    find: jest.fn().mockImplementation(() => Promise.resolve([])), // Initially return an empty array
    findOne: jest.fn(),
    findOneByUsername: jest.fn(),
    remove: jest.fn().mockImplementation((user: User) => Promise.resolve(user)),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  describe('create', () => {
    it('should create and return a new user', async () => {
      const createUserDto: CreateUserDto = {
        username: 'JaneDoe',
        email: 'jane@example.com',
      };
      const result = await userService.create(createUserDto);
      expect(mockUserRepository.create).toHaveBeenCalledWith(createUserDto);
      expect(mockUserRepository.save).toHaveBeenCalledWith(result);
      expect(result).toEqual({ id: '1', ...createUserDto });
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const result = await userService.findAll();
      expect(mockUserRepository.find).toHaveBeenCalled();
      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return a user by ID', async () => {
      const user: User = mockUser;
      mockUserRepository.findOne.mockResolvedValue(user);

      const result = await userService.findOne('1');
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { id: '1' },
      });
      expect(result).toEqual(user);
    });

    it('should throw NotFoundException if user does not exist', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(userService.findOne('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should return a user by Usermae', async () => {
      const user: User = mockUser;
      mockUserRepository.findOne.mockResolvedValue(user);

      const result = await userService.findOneByUsername(user?.username);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { username: 'JaneDoe' },
      });
      expect(result).toEqual(user);
    });

    it('should throw NotFoundException if user does not exist', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(
        userService.findOneByUsername('non-existent-username'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update and return the user', async () => {
      const user: User = mockUser;
      const updateUserDto: UpdateUserDto = { username: 'UpdatedJane' };
      mockUserRepository.findOne.mockResolvedValue(user);

      const result = await userService.update('1', updateUserDto);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { id: '1' },
      });
      expect(Object.assign(user, updateUserDto)).toEqual(result);
      expect(mockUserRepository.save).toHaveBeenCalledWith(result);
    });

    it('should throw NotFoundException if user does not exist', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(userService.update('non-existent-id', {})).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should remove the user', async () => {
      const user: User = mockUser;
      mockUserRepository.findOne.mockResolvedValue(user);

      await userService.remove('1');
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { id: '1' },
      });
      expect(mockUserRepository.remove).toHaveBeenCalledWith(user);
    });

    it('should throw NotFoundException if user does not exist', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(userService.remove('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
