import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Post,
  UnauthorizedException,
  UseGuards,
  Req,
  Param,
} from '@nestjs/common';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import { RedisService } from './redis/redis.service';
import { User } from './user/entities/user.entity';
import { UserService } from './user/user.service';
import { CreateUserDto } from './user/dto/create-user.dto';
import { JwtAuthGuard } from './auth/jwt-auth.guard';

interface AuthRequest extends Request {
  user: User;
}

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly redisService: RedisService,
  ) {}

  @Get('')
  getHello(): { message: string; timestamp: string } {
    return this.appService.getHello();
  }

  @Post('auth/sign-in/:username')
  async signIn(
    @Param('username') username: string,
  ): Promise<{ accessToken: string }> {
    try {
      // Check if username is provided
      if (!username) {
        throw new BadRequestException('Username is required');
      }

      // Find the user by username
      const user = await this.userService.findOneByUsername(username);
      if (!user) {
        throw new NotFoundException(`User with Username ${username} not found`);
      }

      // Generate and return the access token
      return this.authService.signIn(user);
    } catch (error) {
      // Handle any errors that occur
      throw new BadRequestException(error);
    }
  }

  @Post('auth/sign-up/')
  async signUp(
    @Body() createUserDto: CreateUserDto,
  ): Promise<{ user: User; accessToken: string }> {
    const { username, email } = createUserDto;

    // Check if username and email are provided
    if (!username || !email) {
      throw new BadRequestException('Username and email are required');
    }

    // Create the user and cache the user data
    const user = await this.userService.create(createUserDto);
    await this.redisService.setCache(`user:${user.id}`, user);

    // Generate access token for the new user
    const { accessToken } = await this.authService.signIn(user);

    // Return the newly created user and the access token
    return { user, accessToken };
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getProfile(@Req() req: AuthRequest): Promise<User> {
    const { user } = req;

    if (!user) {
      throw new UnauthorizedException('Invalid access token');
    }

    return user;
  }
}
