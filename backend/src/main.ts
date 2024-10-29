// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { middlewares } from './middleware';
import { swagger } from './swagger.config';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  // Create a NestJS application instance
  const app = await NestFactory.create(AppModule);

  // Get an instance of ConfigService to access environment variables
  const configService = app.get<ConfigService>(ConfigService);

  // Configure Swagger documentation for the API
  swagger(app);

  // Apply custom middlewares to the application
  middlewares(app);

  // Set a global prefix for all API routes (e.g., /api/users)
  app.setGlobalPrefix('api');

  // Use ConfigService to get the HOST and PORT values from environment variables
  // Fallback to process.env or default values if not set
  const HOST =
    configService.get<string>('HOST') || process.env.HOST || 'localhost'; // Default to 'localhost' if HOST is not set
  const PORT =
    configService.get<number>('PORT') || Number(process.env.PORT) || 3001; // Default to 3001 if PORT is not set

  // Start the application and listen on the specified PORT
  await app.listen(PORT);

  // Log the server URL to the console
  console.log(`HTTP server is running on: http://${HOST}:${PORT}/api`);
}

// Call the bootstrap function to initialize the application
bootstrap();
