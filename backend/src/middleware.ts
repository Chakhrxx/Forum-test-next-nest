// src/middleware.ts
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { json, urlencoded } from 'express';
import compression from 'compression';
import { HttpExceptionFilter } from './http-exception.filter';

// Function to apply middleware to the NestJS application
export const middlewares = (app: INestApplication) => {
  // Enable Cross-Origin Resource Sharing (CORS) for all origins
  app.enableCors({
    origin: ['http://localhost:3000'], // Allow requests from any origin
    methods: 'GET,POST,PUT,PATCH,DELETE,OPTION', // Allowed HTTP methods
    allowedHeaders: 'Content-Type,Authorization,x-api-key', // Allowed headers in requests
    credentials: true, // Allow credentials to be included in requests
  });

  // Middleware to parse incoming JSON requests with a size limit of 50mb
  app.use(json({ limit: '50mb' }));

  // Middleware to parse URL-encoded requests with a size limit of 50mb
  app.use(urlencoded({ extended: true, limit: '50mb' }));

  // Middleware to compress response bodies for all requests
  app.use(compression());

  // Enable global validation for incoming requests
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // Automatically transform payloads to be instances of their DTO classes
      whitelist: true, // Strip properties that do not have decorators in the DTO (whitelist)
      forbidNonWhitelisted: true, // Throw an error if non-whitelisted properties are present in the request
    }),
  );

  // Register a global exception filter to handle and log HTTP exceptions
  app.useGlobalFilters(new HttpExceptionFilter());
};
