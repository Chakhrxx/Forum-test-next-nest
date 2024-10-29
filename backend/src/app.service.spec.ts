import { Test, TestingModule } from '@nestjs/testing';
import { AppService } from './app.service';

describe('AppService', () => {
  let appService: AppService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AppService],
    }).compile();

    appService = module.get<AppService>(AppService);
  });

  it('should be defined', () => {
    expect(appService).toBeDefined();
  });

  describe('getHello', () => {
    it('should return a message and timestamp', () => {
      const result = appService.getHello();
      expect(result).toHaveProperty('message', 'Hello World!');
      expect(result).toHaveProperty('timestamp');

      // Optionally, you can check if timestamp is in the expected format
      const timestamp = new Date(result.timestamp);
      expect(timestamp instanceof Date).toBe(true); // Ensure it's a valid date
    });
  });
});
