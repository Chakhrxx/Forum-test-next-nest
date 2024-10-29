import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from '../user/entities/user.entity';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
  let authService: AuthService;
  let configService: ConfigService;
  let jwtService: JwtService;

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

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockImplementation((key: string) => {
              switch (key) {
                case 'API_KEY':
                  return 'test-api-key';
                case 'JWT_EXPIRATION':
                  return '1h';
                default:
                  return null;
              }
            }),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('mock-token'),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    configService = module.get<ConfigService>(ConfigService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('initializeApiKey', () => {
    it('should initialize the API key', () => {
      expect(authService['apiKeys'].has('test-api-key')).toBe(true);
    });

    it('should warn if API key is not set', () => {
      jest.spyOn(configService, 'get').mockReturnValue(undefined);
      const warnSpy = jest.spyOn(console, 'warn').mockImplementation(); // Spy on console.warn

      authService = new AuthService(configService, jwtService); // Re-instantiate to trigger warning

      expect(warnSpy).toHaveBeenCalledWith(
        'API key is not set in environment variables',
      );
    });
  });

  describe('validateApiKey', () => {
    it('should return true for a valid API key', async () => {
      const isValid = await authService.validateApiKey('test-api-key');
      expect(isValid).toBe(true);
    });

    it('should return false for an invalid API key', async () => {
      const isValid = await authService.validateApiKey('invalid-api-key');
      expect(isValid).toBe(false);
    });
  });

  describe('signIn', () => {
    it('should throw an UnauthorizedException if user is invalid', async () => {
      await expect(authService.signIn(null)).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(authService.signIn({} as User)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should return an access token for a valid user', async () => {
      const result = await authService.signIn(mockUser);
      expect(result).toEqual({ accessToken: 'mock-token' });
    });
  });

  describe('generateToken', () => {
    it('should generate a JWT token', () => {
      const token = authService['generateToken'](mockUser);
      expect(token).toBe('mock-token');
      expect(jwtService.sign).toHaveBeenCalledWith(
        { username: mockUser.username, sub: mockUser.id },
        { expiresIn: '1h' },
      );
    });
  });
});
