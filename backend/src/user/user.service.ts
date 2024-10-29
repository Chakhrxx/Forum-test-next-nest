import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // Create a new user
  async create(userDto: CreateUserDto): Promise<User> {
    const user = this.userRepository.create(userDto); // Create a new user instance
    return await this.userRepository.save(user); // Save and return the created user
  }

  // Retrieve all users
  async findAll(): Promise<User[]> {
    return await this.userRepository.find(); // Return all users from the repository
  }

  // Retrieve a user by ID
  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with Id ${id} not found`);
    }
    return user; // Return the found user
  }

  async findOneByUsername(username: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { username } });
    if (!user) {
      throw new NotFoundException(`User with Username ${username} not found`);
    }
    return user; // Return the found user
  }

  // Update a user by ID
  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id); // Use findOne to check if user exists
    const updatedUser = Object.assign(user, updateUserDto); // Merge updates
    return await this.userRepository.save(updatedUser); // Save and return the updated user
  }

  // Remove a user by ID
  async remove(id: string): Promise<void> {
    const user = await this.findOne(id); // Use findOne to check if user exists
    await this.userRepository.remove(user); // Remove the user
  }
}
