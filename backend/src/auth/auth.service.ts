import { User } from '../user/entities/user.entity';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  // A Set to store valid API keys
  private apiKeys: Set<string> = new Set();

  constructor(
    private readonly configService: ConfigService, // Inject ConfigService to access environment variables
    private readonly jwtService: JwtService, // Inject JwtService for JWT operations
  ) {
    this.initializeApiKey(); // Initialize API keys from environment or config
  }

  // Initializes the API key from the config or environment variables
  private initializeApiKey(): void {
    const apiKey =
      this.configService.get<string>('API_KEY') || process.env.API_KEY;

    // Add the API key to the Set if it exists
    this.apiKeys = new Set(apiKey ? [apiKey] : []);

    // Log a warning if the API key is not set
    if (!apiKey) {
      console.warn('API key is not set in environment variables');
    }
  }

  // Validates the provided API key against stored keys
  async validateApiKey(apiKey: string): Promise<boolean> {
    return this.apiKeys.has(apiKey); // Returns true if the API key is valid
  }

  // Signs in a user and generates an access token
  async signIn(user: User): Promise<{ accessToken: string }> {
    // Check if the user is valid
    if (!user || !user.id) {
      throw new UnauthorizedException('Invalid user credentials'); // Throw an exception if invalid
    }
    return { accessToken: this.generateToken(user) }; // Generate and return the access token
  }

  // Generates a JWT for the provided user
  private generateToken(user: User): string {
    // Get the JWT expiration time from config or environment
    const JWT_EXPIRATION =
      this.configService.get<string>('JWT_EXPIRATION') ||
      process.env.JWT_EXPIRATION;

    // Sign the token with user details and expiration
    return this.jwtService.sign(
      { username: user.username, sub: user.id }, // Payload containing user info
      { expiresIn: JWT_EXPIRATION || '1y' }, // Token expiration
    );
  }
}
